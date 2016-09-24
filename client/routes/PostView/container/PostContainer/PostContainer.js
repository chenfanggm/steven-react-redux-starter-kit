import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Post from '../../components/Post'
import { actions as postActions } from '../../../../redux/modules/PostReducer'
import { USER_ENUM } from '../../../../redux/modules/UserReducer'


class PostContainer extends React.Component {

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
    postUrl: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { postUrl } = this.props
    this.props.fetchPostByUrl(postUrl)
  }

  render() {
    const { post, isAuthenticated, user } = this.props

    const isAdmin = (isAuthenticated && user.user &&
    [USER_ENUM.ROLE_OWNER, USER_ENUM.ROLE_ADMIN].includes(user.user.role))

    return (
      <Post post={post} isAdmin={isAdmin} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    post: state.post.post,
    isAuthenticated: state.user.isAuthenticated,
    user: state.user
  }
}

export default connect(mapStateToProps, postActions)(PostContainer)
