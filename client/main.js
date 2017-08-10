import './normalize'
import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './redux/createStore'
import createHistory from 'history/createBrowserHistory'
import { createRoutes } from './routes'
import AppContainer from './containers/AppContainer'


// --------------------------------------
// Store Instantiation
// --------------------------------------
const initialState = window.__INITIAL_STATE__
const history = createHistory()
const store = createStore(initialState, history)
const routes = createRoutes(store)

// --------------------------------------
// Render Setup
// --------------------------------------
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  ReactDOM.render(
    <AppContainer store={store} history={history} routes={routes} />,
    MOUNT_NODE
  )
}

// Development Tools
if (__DEV__) {
  if (module.hot) {
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default
      ReactDOM.render(
        <RedBox error={error} />,
        MOUNT_NODE
      )
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// --------------------------------------
// Go!
// --------------------------------------
render()
