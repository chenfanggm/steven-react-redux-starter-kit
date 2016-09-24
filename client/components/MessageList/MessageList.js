import React, { PropTypes } from 'react'
import moment from 'moment'
import classes from './MessageList.scss'

const MessageList = ({ messages }) => {

  const messageListRender = messages.map((message) => {
    const createdAt = moment(message.createdAt).fromNow()
    return (
      <section key={message._id} className={classes.item}>
        <header className={classes.header}>
          <div className={classes.avatar}>
            <i className='fa fa-user' aria-hidden='true'></i>&nbsp;
          </div>
          <div className={classes.authorAndTime}>
            <span className={classes.author}>{message.author}</span>
            <span className={classes.createdAt}>{createdAt}</span>
          </div>
        </header>
        <main className={classes.body}>
          {message.content}
        </main>
      </section>
    )
  })

  return (
    <div className={classes.container}>
      {messageListRender}
    </div>
  )
}

MessageList.PropTypes = {
  messages: PropTypes.array.isRequired
}

export default MessageList
