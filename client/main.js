import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import createStore from './redux/createStore'

// Browser History Setup
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: __BASENAME__
})

// Store and History Instantiation
// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the routerKey "router" in redux/reducers.js,
// so we need to provide a custom `selectLocationState` to inform react-router-redux
const store = createStore(window.__INITIAL_STATE__, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

// Render Setup
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const routes = require('./routes/index').default(store)
  const Root = require('./Root').default
  ReactDOM.render(
    <AppContainer>
      <Root
        store={store}
        history={history}
        routes={routes}
      />
    </AppContainer>,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default
      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () => {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    })
  }
}

// Render!
render()
