import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classes from './RegisterModal.scss'
import { isValidEmail } from '../../utils/common'
import Constants from '../../utils/constants'
import { Modal, Form, FormItem, Input, Button, Col, Row } from 'antd';
import { actions as authActions } from '../../redux/modules/UserReducer'
import { actions as globalActions } from '../../redux/modules/GlobalReducer'


class RegisterModal extends React.Component {

  static propTypes = {
    isShowRegisterModal: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    registerUser: PropTypes.func.isRequired,
    updateError: PropTypes.func.isRequired,
    removeError: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)
    this.submitHandler = this.submitHandler.bind(this)
    this.cancelHandler = this.cancelHandler.bind(this)
  }

  componentDidUpdate() {
    const { isShowRegisterModal } = this.props
    if(isShowRegisterModal) {
      $('body').addClass('noScroll')
    } else {
      $('body').removeClass('noScroll')
    }
  }

  submitHandler() {
    const fields = this.props.form.getFieldsValue()
    this.props.registerUser(fields.email, fields.password)
  }

  cancelHandler() {
    this.props.hideRegisterModal();
  }

  render() {
    const { isShowRegisterModal, isLoading } = this.props
    const { switchLoginRegisterForm } = this.props
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    }

    return (
      <Modal
        visible={isShowRegisterModal}
        width='40rem'
        title='REGISTER'
        onCancel={this.cancelHandler}
        wrapClassName={classes.container}
        className={classes.modal}
        zIndex={1003}
        footer={[
          <div key='registerModalFooter' className={classes.footer}>
            <Button type='dashed' size='default'
              className={classes.registerButton}
              onClick={switchLoginRegisterForm}
            >
              LOGIN
            </Button>
            <Button type='primary' size='default'
              className={classes.loginButton}
              loading={isLoading}
              onClick={this.submitHandler}
              disabled = {isLoading}
            >
              REGISTER
            </Button>
          </div>
        ]}
      >
        <Form horizontal className={classes.form}>
          <Row type='flex' justify='center' align='middle'>
            <Col span={23}>
              <Form.Item
                {...formItemLayout}
                label='EMAIL'
              >
                <Input {...getFieldDecorator('email', {})} type='email' autoComplete='off' />
              </Form.Item>
            </Col>
          </Row>
          <Row type='flex' justify='center' align='middle'>
            <Col span={23}>
              <Form.Item
                {...formItemLayout}
                label='PASSWORD'
              >
                <Input {...getFieldDecorator('password', {})} type='password' autoComplete='off' />
              </Form.Item>
            </Col>
          </Row>
          <Row type='flex' justify='center' align='middle'>
            <Col span={23}>
              <Form.Item
                {...formItemLayout}
                label='RE-PASSWORD'
              >
                <Input {...getFieldDecorator('passwordConfirm', {})}
                  type='password'
                  autoComplete='off'
                  onPressEnter={this.submitHandler}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

const RegisterModalForm = Form.create()(RegisterModal);

const mapStateToProps = (state) => ({
  isShowRegisterModal: state.global.isShowRegisterModal,
  isLoading : state.user.isLoading,
  user : state.user.user,
  error: state.user.error
})

export default connect(mapStateToProps,
  Object.assign({}, authActions, globalActions))(RegisterModalForm)
