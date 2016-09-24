import mongoose from 'mongoose'
import moment from 'moment'

/**
 * Constants
 */
const STATUS ={
  INACTIVE: 0,
  ACTIVE: 1
}

/**
 * Message Schema
 */
const MessageSchema = new mongoose.Schema({
  author: { type: String, required: true },
  receiver: { type: String, required: true, default: '' },
  content: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, sparse: true },
  status: { type: Number, required: true, default: STATUS.ACTIVE },
  createdAt: { type: Date, required: true, default: moment().format("YYYY-MM-DD HH:mm:ss") },
  updatedAt: { type: Date, required: true, default: moment().format("YYYY-MM-DD HH:mm:ss") }
})

/**
 * Indexing
 */
MessageSchema.index({ author: 1 })
MessageSchema.index({ replyTo: 1 })
MessageSchema.index({ createdAt: -1 })
MessageSchema.index(
  { author: 'text', receiver: 'text', content: 'text' },
  {
    name: 'message_author_receiver_content_index',
    weights: {author: 7, receiver: 8, content: 6}
  }
)

const MessageModal = mongoose.model('Message', MessageSchema)

/**
 * Constants
 */
MessageModal.STATUS = STATUS;

export default MessageModal
