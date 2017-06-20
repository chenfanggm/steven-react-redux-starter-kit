import { combineReducers } from 'redux'
import location from './modules/LocationReducer'
import user from './modules/UserReducer'

export const makeRootReducer = (asyncReducers) =>
  (state, action) => {
    return combineReducers({
      // sync reducers here
      location,
      user,
      ...asyncReducers
    })(action.type === 'global/RESET_STATE' ? undefined : state, action)
  }

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
