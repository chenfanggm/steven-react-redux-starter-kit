import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import Showdown from 'showdown'
import Scrolls from '../../../../containers/Scrolls'
import classes from './PostList.scss'


const converter = new Showdown.Converter()

const PostList = ({ posts }) => {

  const postList = posts
    .sort((a, b) => a.createdAt < b.createdAt)
    .map((post) => {
      const markdownSummary = converter.makeHtml(post.content.slice(0, 300))
      return (
        <article key={post._id} className={classes.article}>
          <header className={classes.header}>
            <Link to={`/${post.url}`} className={classes.link}>
              <h3 className={classes.title}>{post.title}</h3>
            </Link>
            <div className={classes.toolbar}>
              <div className={classes.toolbarLeft}>
                <span>{moment(post.createdAt).format('MMMM Do, YYYY')},</span>&nbsp;
                <span>{`by ${post.author}`}</span>
              </div>
              <div className={classes.toolbarRight}>
              <span>
              <i className='fa fa-clock-o'></i>&nbsp;
                {`${post.readLength} min read`}
            </span>
              </div>
            </div>
          </header>
          <main
            className={classes.main}
            dangerouslySetInnerHTML={{__html: markdownSummary}}
          >
          </main>
          <footer className={classes.footer}>
            <Link to={`/${post.url}`}>Read more...</Link>
          </footer>
        </article>
      )
    })

  return (
    <div className={classes.container}>
      {postList}
      <Scrolls />
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired
}

export default PostList
