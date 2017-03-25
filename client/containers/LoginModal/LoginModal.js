import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, FormItem, Input, Button, Col, Row } from 'antd';
import { isValidEmail } from '../../utils/common'
import Constants from '../../../config/constants'
import classes from './LoginModal.scss'
import { actions as authActions } from '../../redux/modules/UserReducer'
import { actions as globalActions } from '../../redux/modules/GlobalReducer'


class LoginModal extends React.Component {

  static propTypes = {
    isShowLoginModal: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loginUser: PropTypes.func.isRequired,
    updateError: PropTypes.func.isRequired,
    removeError: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)
    this.submitHandler = this.submitHandler.bind(this)
    this.cancelHandler = this.cancelHandler.bind(this)
  }

  componentDidUpdate() {
    const { isShowLoginModal } = this.props
    if(isShowLoginModal) {
      $('body').addClass('noScroll')
    } else {
      $('body').removeClass('noScroll')
    }
  }

  submitHandler() {
    const fields = this.props.form.getFieldsValue()
    this.props.loginUser(fields.email, fields.password)
  }

  cancelHandler() {
    this.props.hideLoginModal();
  }

  render() {
    const { isShowLoginModal, isLoading } = this.props
    const { switchLoginRegisterForm } = this.props
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    return (
      <Modal
        visible={isShowLoginModal}
        title='LOGIN'
        onCancel={this.cancelHandler}
        wrapClassName={classes.container}
        className={classes.modal}
        zIndex={1002}
        footer={[
          <div key='loginModalFooter' className={classes.footer}>
            <Button type='dashed' size='default'
              className={classes.registerButton}
              onClick={switchLoginRegisterForm}
              disabled = {isLoading}
            >
              REGISTER
            </Button>
            <Button type='primary' size='default'
              className={classes.loginButton}
              loading={isLoading}
              onClick={this.submitHandler}
              disabled = {isLoading}
            >
              LOGIN
            </Button>
          </div>
        ]}
      >
        <Form horizontal>
          <Row type='flex' justify='center' align='middle'>
            <Col span={22}>
              <Form.Item
                {...formItemLayout}
                label='EMAIL'
              >
                <Input {...getFieldDecorator('email', {})} type='email' autoComplete='on' />
              </Form.Item>
            </Col>
          </Row>
          <Row type='flex' justify='center' align='middle'>
            <Col span={22}>
              <Form.Item
                {...formItemLayout}
                label='PASSWORD'
              >
                <Input {...getFieldDecorator('password', {})}
                  type='password'
                  autoComplete='on'
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

const LoginModalForm = Form.create()(LoginModal);

const mapStateToProps = (state) => ({
  isShowLoginModal: state.global.isShowLoginModal,
  isLoading : state.user.isLoading,
  statusText : state.user.statusText,
  user : state.user.user
})

export default connect(mapStateToProps,
  Object.assign({}, authActions, globalActions))(LoginModalForm)
