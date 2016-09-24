import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, FormItem, Input, Button, Col, Row } from 'antd';
import Constants from '../../../config/constants'
import classes from './UsernameModal.scss'
import { actions as authActions } from '../../redux/modules/UserReducer'
import { actions as globalActions } from '../../redux/modules/GlobalReducer'


class UsernameModal extends React.Component {

  static propTypes = {
    isShowUsernameModal: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props)
    this.submitHandler = this.submitHandler.bind(this)
    this.cancelHandler = this.cancelHandler.bind(this)
  }

  componentDidUpdate() {
    const { isShowUsernameModal } = this.props
    if(isShowUsernameModal) {
      $('body').addClass('noScroll')
    } else {
      $('body').removeClass('noScroll')
    }
  }

  submitHandler() {
    const fields = this.props.form.getFieldsValue()
    this.props.updateUsername(fields.username)
  }

  cancelHandler() {
    this.props.hideUsernameModal();
  }

  render() {
    const { isShowUsernameModal, isLoading } = this.props
    const { getFieldProps } = this.props.form;

    return (
      <Modal
        visible={isShowUsernameModal}
        title='Think an awesome Username'
        onCancel={this.cancelHandler}
        wrapClassName={classes.container}
        className={classes.modal}
        zIndex={1004}
        footer={[
          <div key='usernameModalFooter' className={classes.footer}>
            <Button type='primary' size='default'
              className={classes.submitButton}
              loading={isLoading}
              onClick={this.submitHandler}
              disabled = {isLoading}
            >
              Submit
            </Button>
          </div>
        ]}
      >
        <Form horizontal className={classes.form}>
          <Input {...getFieldProps('username', {})}
            type='text'
            autoComplete='off'
            placeholder='Enter your username...'
            className={classes.usernameInput}
            onPressEnter={this.submitHandler}
          />
        </Form>
      </Modal>
    )
  }
}

const UsernameModalForm = Form.create()(UsernameModal);

const mapStateToProps = (state) => ({
  isShowUsernameModal: state.global.isShowUsernameModal,
  isLoading : state.user.isLoading,
  statusText : state.user.statusText,
  user : state.user.user
})

export default connect(mapStateToProps,
  Object.assign({}, authActions, globalActions))(UsernameModalForm)
