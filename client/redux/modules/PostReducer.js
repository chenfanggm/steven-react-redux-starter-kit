import { errorFilter } from '../../utils/common'
import { routerActions } from 'react-router-redux'
import API from '../../utils/APIConstants'


// ------------------------------------
// Constants
// ------------------------------------
export const START_LOAD         = 'post/START_LOAD'
export const LOAD_SUCCESS       = 'post/LOAD_SUCCESS'
export const LOAD_FAILED        = 'post/LOAD_FAILED'

// ------------------------------------
// Actions
// ------------------------------------
export const startLoad = () => ({ type: START_LOAD })
export const loadSuccess = (post) => ({ type: LOAD_SUCCESS, post: post })
export const loadFailed = (error) => ({ type: LOAD_FAILED, error: error })

export const fetchPostByUrl = (postUrl) =>
  (dispatch, state) => {
    dispatch(startLoad())
    return fetch(`${API.POST_URL}/${postUrl}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(errorFilter())
      .then((response) => {
        dispatch(loadSuccess(response.post))
      })
      .catch((error) => {
        dispatch(loadFailed(error))
        dispatch(routerActions.push('/'))
      })
  }

export const savePost = (post) =>
  (dispatch, state) => {
    dispatch(startLoad())
    let method = 'post'
    if (post._id) {
      method = 'put'
    }
    return fetch(API.POST, {
      method: method,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    })
      .then(errorFilter())
      .then((response) => {
        dispatch(loadSuccess(response.post))
        dispatch(routerActions.push(`/${post.url}`))
      })
      .catch((error) => {
        dispatch(loadFailed(error))
      })
  }

export const actions = {
  fetchPostByUrl,
  savePost
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [START_LOAD]: (state) => {
    return { ...state, isLoading: true }
  },
  [LOAD_SUCCESS]: (state, { post }) => {
    return { ...state, isLoading: false, post: post }
  },
  [LOAD_FAILED]: (state, { error }) => {
    return { ...state, isLoading: false, error: error }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  isEditing: false,
  post: {}
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

