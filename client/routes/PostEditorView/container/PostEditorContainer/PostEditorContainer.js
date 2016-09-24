import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as postActions } from '../../../../redux/modules/PostReducer'
import PostEditor from '../../components/PostEditor'


class PostEditorContainer extends React.Component {

  static propTypes = {
    post: PropTypes.object.isRequired,
    savePost: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)
    this.saveEdit = this.saveEdit.bind(this)
  }

  componentDidMount() {
    const { post, postUrl } = this.props
    if (!post._id) {
      this.props.fetchPostByUrl(postUrl)
    }
  }

  saveEdit() {
    const { post } = this.props
    const author = $('#postAuthor').val()
    const title = $('#postTitle').val()
    const url = $('#postUrl').val()
    const readLength = $('#postReadLength').val()
    const content = $('#postContent').val()
    this.props.savePost(Object.assign({}, post, { author, title, url, readLength, content }))
  }

  render() {
    const { post } = this.props

    const PostEditorRender = post._id
      ? <PostEditor post={post} saveEdit={this.saveEdit} />
      : <PostEditor saveEdit={this.saveEdit} />

    return (
      <div>
        {PostEditorRender}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    post: state.post.post
  }
}

export default connect(mapStateToProps, postActions)(PostEditorContainer)
