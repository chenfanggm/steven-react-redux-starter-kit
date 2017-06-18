import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Modal, Button, Input } from 'antd'
import MessageList from '../../components/MessageList'
import classes from './MessageModal.scss'
import { actions as messageActions } from '../../redux/modules/MessageReducer'
import { actions as userActions } from '../../redux/modules/UserReducer'
import { actions as globalActions } from '../../redux/modules/GlobalReducer'


class MessageModal extends React.Component {

  static propTypes = {
    isShowMessageModal: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired,
    hideMessageModal: PropTypes.func.isRequired,
    showLoginModal: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
    updateLastReadMessageAt: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      isShowMessageEditor: false
    }
    this.hideMessageModal = this.hideMessageModal.bind(this)
    this.showMessageEditor = this.showMessageEditor.bind(this)
    this.hideMessageEditor = this.hideMessageEditor.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidUpdate() {
    const { isShowMessageModal } = this.props
    if(isShowMessageModal) {
      $('#root').addClass('noScroll')
    } else {
      $('#root').removeClass('noScroll')
    }
  }

  hideMessageModal() {
    const { user } = this.props
    if (user) {
      this.props.updateLastReadMessageAt(user.userId)
    }
    this.props.hideMessageModal()
    this.props.clearUnreadMessage()
  }

  showMessageEditor() {
    const { isAuthenticated, user } = this.props
    if (!isAuthenticated) {
      return this.props.showLoginModal()
    }

    this.setState({
      isShowMessageEditor: true
    })
  }

  hideMessageEditor() {
    this.setState({
      isShowMessageEditor: false
    })
  }

  sendMessage() {
    const { user } = this.props
    if (!user) {
      return this.props.showLoginModal()
    }
    if (!user.username) {
      return this.props.showUsernameModal()
    }
    const messageContent = $('#messageInput').val()
    const message = {
      content: messageContent
    }

    this.props.sendMessage(message)
    this.hideMessageEditor()
  }

  render() {
    const { isShowMessageModal, isLoading, messages } = this.props
    const { isShowMessageEditor } = this.state

    const messageRender = isShowMessageEditor ? (
      <div className={classes.messageInputWrapper}>
        <Input type='textarea'
               id='messageInput'
               size='large'
               placeholder='Start new message...'
               autosize={{ minRows: 10, maxRows: 10 }}
               className={classes.messageInput}
        />
      </div>
    ) : (<MessageList messages={messages} />)

    const footerRender = isShowMessageEditor ? (
      <div key='messageModalFooter' className={classes.footer}>
        <Button type='default' size='default'
                className={classes.loginButton}
                loading={isLoading}
                disabled = {isLoading}
                onClick={this.hideMessageEditor}
        >
          Cancel
        </Button>
        <Button type='primary' size='default'
                className={classes.loginButton}
                loading={isLoading}
                disabled = {isLoading}
                onClick={this.sendMessage}
        >
         Send
        </Button>
      </div>
    ) : (
      <div key='messageModalFooter' className={classes.footer}>
        <Button type='primary' size='default'
                className={classes.loginButton}
                loading={isLoading}
                onClick={this.showMessageEditor}
                disabled = {isLoading}
        >
          New Message
        </Button>
      </div>
    )

    return (
      <Modal visible={isShowMessageModal}
             closable={true}
             onCancel={this.hideMessageModal}
             wrapClassName={classes.container}
             className={classes.modal}
             zIndex={1001}
             title='Message'
             footer={[footerRender]}
      >
        <div className={classes.content}>
          { messageRender }
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  isShowMessageModal: state.message.isShowMessageModal,
  isLoading : state.message.isLoading,
  messages : state.message.messages,
  isAuthenticated: state.user.isAuthenticated,
  user: state.user.user
})

export default connect(mapStateToProps,
  Object.assign({}, messageActions, userActions, globalActions))(MessageModal)
