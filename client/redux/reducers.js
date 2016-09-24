import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import global from './modules/GlobalReducer'
import user from './modules/UserReducer'
import postList from './modules/PostListReducer'
import message from './modules/MessageReducer'

export const makeRootReducer = (asyncReducers) =>
  (state, action) => {
    return combineReducers({
      // sync reducers here
      global,
      router,
      user,
      postList,
      message,
      ...asyncReducers
    })(action.type === 'global/RESET_STATE' ? undefined : state, action)
  }

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
