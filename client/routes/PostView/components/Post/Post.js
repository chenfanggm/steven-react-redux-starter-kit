import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import Showdown from 'showdown'
import Scrolls from '../../../../containers/Scrolls'
import classes from './Post.scss'


const converter = new Showdown.Converter()

const Post = ({ post, isAdmin }) => {

  const toolRender = isAdmin ? (
    <span className={classes.tool}>
      <i className='fa fa-pencil' aria-hidden="true"></i>&nbsp;
      <Link to={`/${post.url}/edit`} className={classes.editButton}>
        Edit
      </Link>
    </span>
  ) : ''

  return (
    <article className={ classes.container }>
      <header className={ classes.header }>
        <h1 className={ classes.title }>{post.title}</h1>
        <div className={classes.toolbar}>
          <div className={classes.toolbarLeft}>
            <span>{moment(post.updatedAt).format('MMMM Do, YYYY')},</span>&nbsp;
            <span className={classes.author}>{`by ${post.author}`}</span>
            {toolRender}
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
        dangerouslySetInnerHTML={{__html: converter.makeHtml(post.content)}}>
      </main>
      <Scrolls />
    </article>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired
}

export default Post
