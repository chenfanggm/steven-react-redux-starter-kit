import moment from 'moment'
import Message from '../model/MessageModel'

export const getAll = ({ lastReadMessageAt, limit }
  = { limit: 25, lastReadMessageAt: null }) => {
  return new Promise((resolve, reject) => {

    const query = Message.find().sort({createdAt: -1})
    if (lastReadMessageAt) query.where('createdAt').gt(lastReadMessageAt)
    if (limit) query.limit(limit)

    query.exec()
      .then((messages) => {
        resolve(messages)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const create = (message, user) => {
  return new Promise((resolve, reject) => {
    Message.create({
        author: user.username,
        receiver: 'Chen',
        content: message.content
      })
      .then((createdMessage) => {
        resolve(createdMessage)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default ({
  getAll,
  create
})
