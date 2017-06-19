import React from 'react'
import ImageModal from '../ImageModal'
import classes from './SSNLink.scss'


class SSNLink extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isShowWechatCode: false
    }
    this.showWechatCode = this.showWechatCode.bind(this)
    this.closeWechatCode = this.closeWechatCode.bind(this)
  }

  showWechatCode() {
    this.setState({ isShowWechatCode: true })
  }

  closeWechatCode() {
    this.setState({ isShowWechatCode: false })
  }

  render() {
    const { isShowWechatCode } = this.state

    return (
      <div className={classes.container}>
        <a href='https://github.com/chenfanggm' className={classes.link}>
          <i className='fa fa-github' aria-hidden='true'></i>
        </a>
        <a href='https://www.linkedin.com/in/chenfanggm' className={classes.link}>
          <i className='fa fa-linkedin-square' aria-hidden='true'></i>
        </a>
        <a className={classes.link} onClick={this.showWechatCode}>
          <i className='fa fa-weixin' aria-hidden='true'></i>
        </a>
        <ImageModal
          visible={isShowWechatCode}
          width='40rem'
          title='Scan QR to subscribe Wechat'
          onCancel={this.closeWechatCode}
        />
      </div>
    )
  }
}

export default SSNLink
