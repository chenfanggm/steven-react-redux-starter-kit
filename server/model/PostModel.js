import mongoose from 'mongoose'
import moment from 'moment'


/**
 * Enum
 */
const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1
}

/**
 * Post Schema
 */
const PostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required:true, unique: true },
  readLength: { type: Number, required:true },
  status: { type: Number, required: true, default: STATUS.ACTIVE },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: moment().format("YYYY-MM-DD HH:mm:ss") },
  updatedAt: { type: Date, required: true, default: moment().format("YYYY-MM-DD HH:mm:ss") }
})

/**
 * Indexing
 */
PostSchema.index({ author: 1 })
PostSchema.index({ title: 1 })
PostSchema.index({ url: 1 })
PostSchema.index(
  { title: 'text', content: 'text' },
  { name: 'post_title_content_index', weights: {title: 8, content: 5} }
)

const PostModel = mongoose.model('Post', PostSchema)

/**
 * Constants
 */
PostModel.STATUS = STATUS

export default PostModel
