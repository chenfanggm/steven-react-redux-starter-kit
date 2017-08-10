import { applyMiddleware, compose, createStore as createReduxStore } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'
import { routerMiddleware } from 'react-router-redux'


const createStore = (initialState = {}, history) => {
  // --------------------------------------
  // Middleware Configuration
  // --------------------------------------
  const middleware = [thunk, routerMiddleware(history)]

  // --------------------------------------
  // Store Enhancers
  // --------------------------------------
  const enhancers = []
  let composeEnhancers = compose
  if (__DEV__) {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  // --------------------------------------
  // Store Instantiation and HMR Setup
  // --------------------------------------
  const store = createReduxStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}

export default createStore
