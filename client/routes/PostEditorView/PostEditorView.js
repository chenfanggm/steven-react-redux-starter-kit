import React from 'react'
import PostEditorContainer from './container/PostEditorContainer'

export const PostView = ({ params: {postUrl} }) => (
  <PostEditorContainer postUrl={postUrl} />
)

export default PostView
