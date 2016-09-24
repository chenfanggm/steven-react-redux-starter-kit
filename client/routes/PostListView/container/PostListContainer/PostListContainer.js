import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as postListActions } from '../../../../redux/modules/PostListReducer'
import PostList from '../../components/PostList'


class PostListContainer extends React.Component {

  static propTypes = {
    posts: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.fetchAllPosts()
  }

  render() {
    return (<PostList posts={this.props.posts} />)
  }
}

function mapStateToProps(state) {
  return {
    posts: state.postList.posts
  }
}

export default connect(mapStateToProps, postListActions)(PostListContainer)
