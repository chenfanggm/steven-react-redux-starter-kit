import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import ReactGA from 'react-ga'

ReactGA.initialize('UA-60711230-1')

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

class AppContainer extends React.Component {

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <Router onUpdate={logPageView} history={browserHistory} children={routes} />
      </Provider>
    )
  }
}

export default AppContainer
