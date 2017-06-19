import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import user from './modules/UserReducer'

export const makeRootReducer = (asyncReducers) =>
  (state, action) => {
    return combineReducers({
      // sync reducers here
      router,
      user,
      ...asyncReducers
    })(action.type === 'global/RESET_STATE' ? undefined : state, action)
  }

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
