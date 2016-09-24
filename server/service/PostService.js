import moment from 'moment'
import Post from '../model/PostModel'

export const getAll = () => {
  return new Promise((resolve, reject) => {
    Post.find()
      .exec()
      .then((posts) => {
        if (posts) {
          resolve(posts)
        } else {
          reject(`Empty post collection`)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const getById = (postId) => {
  return new Promise((resolve, reject) => {
    Post.findOne({ _id: postId })
      .exec()
      .then((post) => {
        if (post) {
          resolve(post)
        } else {
          reject(`Item Not Found`)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const getByUrl = (url) => {
  return new Promise((resolve, reject) => {
    Post.findOne({ url: url })
      .exec()
      .then((post) => {
        resolve(post)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const create = (post) => {
  return new Promise((resolve, reject) => {
    Post.create({
        author: post.author,
        title: post.title,
        url: post.url,
        readLength: post.readLength,
        content: post.content
      })
      .then((post) => {
        resolve(post)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const update = (post) => {
  return new Promise((resolve, reject) => {
    const timeNow = moment().format("YYYY-MM-DD HH:mm:ss")
    Post.findOneAndUpdate({_id: post._id},
      {$set: {
        author: post.author,
        title: post.title,
        url: post.url,
        readLength: post.readLength,
        content: post.content,
        status: post.status,
        updatedAt: timeNow
      }},
      {new: true})
      .then((post) => {
        resolve(post)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default ({
  getAll,
  getById,
  getByUrl,
  create,
  update
})
