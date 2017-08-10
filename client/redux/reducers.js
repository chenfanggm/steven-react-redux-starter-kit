import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './modules/userReducer'

export const makeRootReducer = (asyncReducers) =>
  (state, action) => {
    return combineReducers({
      // sync reducers here
      routing: routerReducer,
      user: userReducer,
      ...asyncReducers
    })(action.type === 'global/RESET_STATE' ? undefined : state, action)
  }

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
