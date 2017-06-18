import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Badge } from 'antd'
import Constants from '../../utils/constants'
import classes from './MessageBadge.scss'
import { actions as messageActions } from '../../redux/modules/MessageReducer'


class MessageBadge extends React.Component {

  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired,
    unreadMessages: PropTypes.array.isRequired,
    showMessageModal: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchMessages()
  }

  render() {
    const { messages, unreadMessages } = this.props
    const { showMessageModal } = this.props

    const relatedMessages = messages.filter((message) => {
      return message.status === Constants.MESSAGE_UNREAD
    })

    return (
      <div className={classes.container}>
        <Badge count={unreadMessages.length}
               overflowCount={10}
               style={{ backgroundColor: '#ffa07a' }}
               className={classes.badge}
        >
          <a className={classes.link}
             onClick={showMessageModal}
          >
            <span className={classes.text}>MSG</span>
            <i className={`fa fa-comments-o ${classes.icon}`} aria-hidden='true'></i>
          </a>
        </Badge>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.message.isLoading,
  messages: state.message.messages,
  unreadMessages: state.message.unreadMessages
})

export default connect(mapStateToProps,
  Object.assign({}, messageActions))(MessageBadge)
