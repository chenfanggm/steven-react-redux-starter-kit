import React, { PropTypes } from 'react'
import PostContainer from './container/PostContainer'

export const PostView = ({ params: {postUrl} }) => {
  return (
    <PostContainer postUrl={postUrl} />
  )
}

PostView.PropTypes = {
  postUrl: PropTypes.string.isRequired
}

export default PostView
