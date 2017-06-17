import { injectReducer } from '../../redux/reducers'

const PostEditorView = (store) => ({
  path: ':postUrl/edit',
  name: 'edit',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const PostEditorView = require('./PostEditorView').default
      const PostReducer = require('../../redux/modules/PostReducer').default

      injectReducer(store, {key: 'post', reducer: PostReducer})

      cb(null, PostEditorView)
    }, 'PostEditorView')
  }
})

export default PostEditorView
