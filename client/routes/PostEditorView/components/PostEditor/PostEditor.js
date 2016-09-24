import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classes from './PostEditor.scss'
import moment from 'moment'
import { Input } from 'antd'

class PostEditor extends React.Component {

  static propTypes = {
    saveEdit: PropTypes.func.isRequired
  };

  render() {
    const { post, saveEdit } = this.props

    const author = post ? post.author : ''
    const readLength = post ? post.readLength : ''
    const url = post ? post.url : ''
    const title = post ? post.title : ''
    const content = post ? post.content : ''
    const updatedAt = post ? post.updatedAt : moment(new Date(), 'MM-DD-YYYY')

    return (
      <article className={classes.container}>
        <header className={classes.header}>
          <div className={classes.toolbar}>
            <span className={classes.author}>
              <i className='fa fa-user' aria-hidden="true"></i>&nbsp;
              <Input type='text'
                     id='postAuthor'
                     defaultValue={author}/>
            </span>
            <span className={classes.readLength}>
            <i className='fa fa-clock-o' aria-hidden="true"></i>&nbsp;
              <Input type='text'
                     id='postReadLength'
                     addonAfter='min'
                     defaultValue={readLength}/>
            </span>
            <span>
              <i className='fa fa-calendar' aria-hidden="true"></i>&nbsp;
              {moment(updatedAt).format('MM-DD-YYYY')}
            </span>
            <span>
              <i className='fa fa-floppy-o' aria-hidden="true"></i>&nbsp;
              <a className={classes.editButton} onClick={saveEdit}>Save</a>
            </span>
            <span>
              <i className='fa fa-times' aria-hidden="true"></i>&nbsp;
              <Link to={`/${url}`} className={classes.editButton}>Cancel</Link>
            </span>
          </div>
          <div className={classes.url}>
            <Input type='text'
                   id='postUrl'
                   addonBefore={<span className={classes.addonBefore}>URL:</span>}
                   defaultValue={url}/>
          </div>
        </header>
        <main>
          <div className={classes.title}>
            <Input type='text'
                   id='postTitle'
                   addonBefore={<span className={classes.addonBefore}>Title:</span>}
                   defaultValue={title}/>
          </div>
          <div className={classes.content}>
            <Input type='textarea'
                   id='postContent'
                   defaultValue={content}
                   autosize={{minRows: 20, maxRows: 25}}/>
          </div>
        </main>
      </article>
    )
  }
}

export default PostEditor
