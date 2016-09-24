import React, { PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import ReactGA from 'react-ga'


ReactGA.initialize('UA-60711230-1')

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

class Root extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    routerKey: PropTypes.number,
    store: PropTypes.object.isRequired
  }


  render () {
    const { history, routes, routerKey, store } = this.props

    return (
      <Provider store={store}>
        <Router onUpdate={logPageView} history={history} children={routes} key={routerKey} />
      </Provider>
    )
  }
}

export default Root
