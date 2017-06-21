import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import { reportPageView } from '../utils/analytics'

class AppContainer extends React.Component {

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <Router history={browserHistory} children={routes} onUpdate={reportPageView} />
      </Provider>
    )
  }
}

export default AppContainer
