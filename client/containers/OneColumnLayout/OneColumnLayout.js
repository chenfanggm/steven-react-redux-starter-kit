import '../../styles/main.scss'
import React from 'react'
import { connect } from 'react-redux'
import { message } from 'antd'
import classes from './OneColumnLayout.scss'
import Navbar from '../../components/Navbar'
import Toolbar from '../../components/Toolbar'
import Footer from '../../components/Footer'
import { actions as authActions } from '../../redux/modules/UserReducer'


class OneColumnLayout extends React.Component {

  componentDidMount() {
    /**
     * init global scope behavior
     */
    // config antd message {top}
    message.config({ top: 70 })
    // stop bg scrolling on mobile when modal is opened
    $('body').on('touchmove', (e) => {
      if ($('.noScroll').has($(e.target)).length) e.preventDefault()
    })
    // check login status
    this.props.isLoggedIn()
  }

  render() {
    const { children } = this.props
    const { location, routes, params } = this.props

    return (
      <div className={classes.container}>
        <Navbar />
        <div className={classes.page}>
          <Toolbar location={location} routes={routes} params={params} />
          <main className={classes.main}>
            {children}
          </main>
        </div>
        <div className={classes.bottom}>
          <Footer />
        </div>
        <div className={classes.hiddenLayer}>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const isLoading = (state.post && state.post.isLoading) || false

  return {
    isLoading: isLoading
  }
}

export default connect(mapStateToProps, authActions)(OneColumnLayout)

