import { injectReducer } from '../../redux/reducers'

const PostListView = (store) => ({
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const PostListView = require('./PostListView').default
      //const PostListReducer = require('../../redux/modules/PostListReducer').default
      //injectReducer(store, {key: 'postList', reducer: PostListReducer})

      cb(null, PostListView)

    }, 'PostListView')
  }
})

export default PostListView
