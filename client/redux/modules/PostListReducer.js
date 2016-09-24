import { errorFilter } from '../../utils/common'
import API from '../../utils/APIConstants'


// ------------------------------------
// Constants
// ------------------------------------
export const START_LOAD         = 'postList/START_LOAD'
export const LOAD_SUCCESS       = 'postList/LOAD_SUCCESS'
export const LOAD_FAILED        = 'postList/LOAD_FAILED'

// ------------------------------------
// Actions
// ------------------------------------
export const startLoad = () => ({ type: START_LOAD })
export const loadSuccess = (posts) => ({ type: LOAD_SUCCESS, posts: posts })
export const loadFailed = (error) => ({ type: LOAD_FAILED, error: error })

export const fetchAllPosts = () =>
  (dispatch, state) => {
    dispatch(startLoad())
    return fetch(API.POST, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(errorFilter())
      .then((response) => {
        dispatch(loadSuccess(response.posts))
      })
      .catch((error) => {
        dispatch(loadFailed(error))
      })
  }

export const actions = {
  fetchAllPosts
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [START_LOAD]: (state) => {
    return { ...state, isLoading: true }
  },
  [LOAD_SUCCESS]: (state, { posts }) => {
    return { ...state, isLoading: false, posts: posts }
  },
  [LOAD_FAILED]: (state) => {
    return { ...state, isLoading: false }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  posts: []
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

