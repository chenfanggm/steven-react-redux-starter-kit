import mongoose from 'mongoose'
import moment from 'moment'
import TokenEntity from './../entity/TokenEntity'

/**
 * Define
 */

const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1
}

const ROLE = {
  OWNER: 0,
  ADMIN: 1,
  USER: 2,
  GUEST: 3
}

/**
 * User Schema
 */
const Token = new TokenEntity
const UserSchema = new mongoose.Schema({
  role: { type: Number, min: 0, max: 3, default: ROLE.USER },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  token: { type: Token },
  lastLogin: { type: Date, required: true, default: moment().format("YYYY-MM-DD HH:mm:ss") },
  lastReadMessageAt: { type: Date, required: true, default: moment().format("YYYY-MM-DD HH:mm:ss") },
  status: { type: Number, required: true, default: STATUS.ACTIVE },
  createdAt: { type: Date, required: true, default: moment().format("YYYY-MM-DD HH:mm:ss") },
  updatedAt: { type: Date, required: true, default: moment().format("YYYY-MM-DD HH:mm:ss") }
})

/**
 * Indexing
 */
UserSchema.index({ email: 1 });

/**
 * Virtual Property
 */
UserSchema
  .virtual('userInfo')
  .get(() => {
    return {
      id: this._id,
      role: this.role,
      email: this.email,
      username: this.username,
      status: this.status,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updateAt: this.updateAt
    }
  })

/**
 * Validation
 */
// validate email format
UserSchema.path('email')
  .validate((email) => {
    var emailRegex = /^([\w\-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    return emailRegex.test(email)
  }, 'email is invalid')

// validate email duplication
UserSchema.path('email')
  .validate((value, response) => {
    mongoose.models['User']
      .findOne({'email': value}, (err, user) => {
        if(err) throw err
        if(user) return response(false)
        response(true)
      })
  }, 'email is already exist')

// validate username duplication
UserSchema.path('username')
  .validate((value, response) => {
    mongoose.models['User']
      .findOne({'username': value}, (err, user) => {
        if(err) throw err
        if(user) return response(false)
        response(true)
      })
  }, 'username is already exist')

/**
 * Pre Save
 */
UserSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next()
  }

  if (!isValidPassword(this.password)) {
    return next(new Error('Invalid password'))
  }
  return next()
})

const isValidPassword = (value) => (value && value.length)

// method
UserSchema.methods = {
  // generating a hashed password
  generateHash: (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),

  // authentication
  authenticate: (password) => bcrypt.compareSync(password, this.local.password)
}

UserSchema.statics = {
  // getLastRecordId
  getLastRecordId : (cb) => {
    mongoose.models['User'].find().sort({_id:-1}).limit(1).exec((err, user) => {
      if(err) throw err
      if(user && user.length!=0){
        return cb(user[0].userId)
      }
      return cb(0)
    })
  }
}

const UserModel = mongoose.model('User', UserSchema)

/**
 * Constants
 */
UserModel.STATUS = STATUS
UserModel.ROLE = ROLE

export default UserModel
