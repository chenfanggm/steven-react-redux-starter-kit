import React from 'react'
import { Provider } from 'react-redux'
// import { Router } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'


class AppContainer extends React.Component {

  shouldComponentUpdate() {
    return false
  }

  render() {
    const { store, history, routes } = this.props

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}
                         children={routes} />
      </Provider>
    )
  }
}

export default AppContainer
