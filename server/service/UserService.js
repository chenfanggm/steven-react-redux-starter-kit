import jwt from 'koa-jwt'
import bcrypt from 'bcrypt'
import moment from 'moment'
import config from '../../config'
import User from '../model/UserModel'
import Token from '../entity/TokenEntity'


export const getById = (userId) => {
  return new Promise((resolve, reject) => {
    User.findOne({
        '_id': userId
      })
      .exec()
      .then((user) => {
        if (user) {
          resolve(user)
        } else {
          reject(`Don't get record`)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const registerUser = (email, password) =>
  new Promise((resolve, reject) => {
    const salt = bcrypt.genSaltSync(8) + config.auth.secret
    const hash = bcrypt.hashSync(password, salt)
    User.create({
        email: email,
        password: hash
      })
      .then((user) => {
        resolve(user)
      })
      .catch((error) => {
        reject(error)
      })
  })

export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    User.findOne({
        'email': email
      })
      .exec()
      .then((user) => {
        if (user) {
          const hash = user.password
          const isValidPassword = bcrypt.compareSync(password, hash)
          if (isValidPassword) {
            const token = generateToken(user.id)
            resolve({
              user: user,
              token: token
            })
          } else {
            reject('Invalid password')
          }
        } else {
          reject(`Don't get record`)
        }

      })
      .catch((error) => {
        reject(error)
      })

  })
}

export const hasUser = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .exec()
      .then((user) => {
        if (user) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const hasUsername = (username) => {
  const usernameRegex = new RegExp(`^${username}$`, 'i');
  return new Promise((resolve, reject) => {
    User.findOne({ username: { $regex: usernameRegex, $options: 'i' } })
      .exec()
      .then((user) => {
        if (user) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const generateToken = (userId) => {
  const payload = {
    userId: userId
  }

  return jwt.sign(payload, config.jwt.secret, {
    tokenExpire: config.jwt.tokenExpire
  })
}

export const generateRefreshToken = (userId) => {
  const payload = { userId }

  return jwt.sign(payload, config.jwt.secret, {
    tokenExpire: config.jwt.refreshTokenExpire
  })
}

export const getTokenExpireDate = () => {
  return new Date(Date.now() + config.jwt.tokenCookieExpire)
}

export const getRefreshTokenExpireDate = () => {
  return new Date(Date.now() + config.jwt.refreshTokenCookieExpire)
}

export const getRefreshToken = (userId, device = '') => {
  return new Promise(function(resolve, reject) {
    new Token({
      userId: userId,
      device: device
    })
      .fetch()
      .then((model) => {
        if (model != null) {
          resolve(model.get('refresh'))
        } else {
          reject(`Don't get record`)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const updateRefreshToken = (userId, device = '') => {
  return new Promise(function(resolve, reject) {
    const refreshToken = generateRefreshToken(userId)
    const tokenSalt = bcrypt.genSaltSync(1)
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, tokenSalt)
    const dbTimeNow = moment().format("YYYY-MM-DD HH:mm:ss")

    User.findByIdAndUpdate(userId, {updatedAt: dbTimeNow})
      .then((user) => {
        if (user != null) {
          const token = new Token
          token.device = device
          token.refreshToken = hashedRefreshToken
          token.updatedAt = dbTimeNow
          user.token = token
          user.updatedAt = dbTimeNow
          user.update({_id: userId}, user)
            .exec()
            .then((user) => {
              resolve(user)
            })
            .catch((error) => {
              reject(error)
            })
        } else {
          reject(`Don't get record`)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const removeRefreshToken = (userId) => {
  return new Promise(function(resolve, reject) {
    const dbTimeNow = moment().format("YYYY-MM-DD HH:mm:ss")

    User.findOneAndUpdate({_id: userId},
      { $set: {token: '', updatedAt: dbTimeNow} },
      { new: true })
      .then((user) => {
        if (user) {
          resolve(user)
        } else {
          reject(`Don't get updated user`)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const updateUsername = (userId, username) => {
  return new Promise(function(resolve, reject) {
    const dbTimeNow = moment().format("YYYY-MM-DD HH:mm:ss")

    User.findOneAndUpdate({ _id: userId },
      { $set: { username: username, updatedAt: dbTimeNow }},
      { new: true })
      .then((user) => {
        if (user) {
          resolve(user)
        } else {
          reject(`Don't get updated user`)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const updateLastReadMessageAt = (userId) => {
  return new Promise(function(resolve, reject) {
    const dbTimeNow = moment().format("YYYY-MM-DD HH:mm:ss")

    User.findOneAndUpdate({ _id: userId },
      { $set: { lastReadMessageAt: dbTimeNow }},
      {new: true})
      .then((user) => {
        if (user) {
          resolve(user)
        } else {
          reject(`Don't get record`)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default ({
  getById,
  registerUser,
  loginUser,
  hasUser,
  hasUsername,
  generateToken,
  getTokenExpireDate,
  generateRefreshToken,
  getRefreshToken,
  getRefreshTokenExpireDate,
  updateRefreshToken,
  removeRefreshToken,
  updateLastReadMessageAt,
  updateUsername
})
