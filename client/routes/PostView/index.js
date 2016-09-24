import { injectReducer } from '../../redux/reducers'

const PostView = (store) => ({
  path: ':postUrl',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const PostView = require('./PostView').default
      const PostReducer = require('../../redux/modules/PostReducer').default

      injectReducer(store, {key: 'post', reducer: PostReducer})

      cb(null, PostView)
    }, 'PostView')
  }
})

export default PostView
