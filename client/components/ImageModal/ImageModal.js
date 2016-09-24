import React, { PropTypes } from 'react'
import { Modal } from 'antd'
import wechatCodeImg from '../../static/img/me/wechat_code.jpg'
import classes from './ImageModal.scss'

class ImageModal extends React.Component {

  static propTypes = {
    visible: PropTypes.bool.isRequired
  };

  componentDidUpdate() {
    const { visible } = this.props
    if(visible) {
      $('body').addClass('noScroll')
    } else {
      $('body').removeClass('noScroll')
    }
  }

  render() {
    const { visible, width, title, onCancel } = this.props

    return (
      <Modal visible={visible}
             width={width}
             footer={false}
             closable={true}
             wrapClassName={classes.container}
             onCancel={onCancel}
             style={{maxWidth: width, margin: '1rem auto'}}
             zIndex={1010}
      >
        <div className={classes.modalBody}>
          <h4 className={classes.title}>{title}</h4>
          <img src={wechatCodeImg} className={classes.wechatCode}/>
        </div>
      </Modal>
    )
  }
}

export default ImageModal
