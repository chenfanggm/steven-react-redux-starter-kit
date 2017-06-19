import { routerActions } from 'react-router-redux'
import { message } from 'antd'
import { errorFilter } from '../../utils/common'
import API from '../../utils/APIConstants'


// ------------------------------------
// Enum
// ------------------------------------
export const USER_ENUM = {
  ROLE_OWNER: 0,
  ROLE_ADMIN: 1,
  ROLE_USER: 2,
  ROLE_GUEST: 3
}

// ------------------------------------
// Constants
// ------------------------------------
export const ISSUE_AUTH_REQUEST = 'user/ISSUE_AUTH_REQUEST'
export const AUTH_SUCCESS = 'user/AUTH_SUCCESS'
export const AUTH_FAILED = 'user/AUTH_FAILED'
export const LOGOUT = 'user/LOGOUT'
export const UPDATE_USER = 'user/UPDATE_USER'
export const SHOW_ERROR = 'user/SHOW_ERROR'

// ------------------------------------
// Actions
// ------------------------------------
const authSuccess = () => ({
  type: AUTH_SUCCESS
})

const authFailed = (error) => ({
  type: AUTH_FAILED,
  error: error
})

const issueAuthRequest = () => ({
  type: ISSUE_AUTH_REQUEST
})

const logout = () => ({
  type: LOGOUT
})

const updateUser = (user) => ({
  type: UPDATE_USER,
  user: user
})

const isLoggedIn = (opts = { showLogin: false }) =>
  (dispatch, getState) => {
    const state = getState()
    const currentPath = state.router.locationBeforeTransitions.pathname
    const isShowLogin = opts.showLogin

    fetch(API.USER_ISLOGGEDIN, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(errorFilter())
      .then((user) => {
        dispatch(updateUser(user))
        dispatch(afterLoginAppInitActions())
        dispatch(authSuccess())
        const originPath = state.router.locationBeforeTransitions.query.origin
        if (originPath) {
          dispatch(routerActions.push(`/${originPath}`))
        }
      })
      .catch((error) => {
        dispatch(authFailed(error))
        if (isShowLogin) {
          dispatch(routerActions.push(`/?origin=${currentPath}`))
        }
      })
  }

const loginUser = (email, password, rememberMe, redirect='/') =>
  (dispatch, getState) => {
    const authPayload = btoa(JSON.stringify({
      email: email,
      password: password ,
      rememberMe: rememberMe
    }))

    dispatch(issueAuthRequest())
    return fetch(API.USER_LOGIN, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ authPayload: authPayload })
    })
      .then(errorFilter())
      .then((user) => {
        dispatch(updateUser(user))
        dispatch(afterLoginAppInitActions())
        dispatch(globalActions.hideLoginModal())
        dispatch(authSuccess())
        message.success('Login Successfully')
      })
      .catch((error) => {
        console.log(error)
        dispatch(authFailed(error))
        message.error(`Failed to login user! Try again!`)
      })
  }

const registerUser = (email, password, redirect='/') =>
  (dispatch, getState) => {

    const authPayload = btoa(JSON.stringify({
      email: email,
      password: password
    }))

    dispatch(issueAuthRequest())
    return fetch(API.USER_REGISTER, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ authPayload: authPayload })
    })
      .then(errorFilter())
      .then((user) => {
        dispatch(updateUser(user))
        dispatch(afterLoginAppInitActions())
        dispatch(authSuccess())
        dispatch(globalActions.hideRegisterModal())
        dispatch(globalActions.showUsernameModal())
        message.success('Register Successfully')
      })
      .catch((error) => {
        console.log(error)
        dispatch(authFailed(error))
        if (error.status && 409 === error.status) {
          return message.error(`Sorry! ${email} already exist!`)
        }
        message.error(`Failed to register user! Try again!`)
      })
  }

const logoutUser = () =>
  (dispatch, getState) => {
    return fetch(API.USER_LOGOUT, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(errorFilter())
      .then((response) => {
        dispatch(logout())
        dispatch(afterLogoutAppClearActions())
        message.success('Logout Successfully')
      })
      .catch((error) => {
        dispatch(authFailed(error))
      })
  }

const afterLoginAppInitActions = (dispatch) =>
  (dispatch, getState) => {
  }

const afterLogoutAppClearActions = (dispatch) =>
  (dispatch, getState) => {
    dispatch(routerActions.push('/'))
  }

const unauthorizedRoute = () =>
  (dispatch, getState) => {
    dispatch(routerActions.push('/'))
  }

const updateUsername = (username) =>
  (dispatch, getState) => {
    return fetch(API.USER_UPDATE_USERNAME, {
      method: 'put',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username })
    })
      .then(errorFilter())
      .then((user) => {
        dispatch(updateUser(user))
        message.success(`Welcome ${user.username}!`, 2.5)
      })
      .catch((error) => {
        if (error.status && 409 === error.status) {
          return message.error(`Sorry! ${username} already exist!`)
        }
        message.error(`Failed to save username! Try again!`)
      })
  }

const updateLastReadMessageAt = () =>
  (dispatch, getState) => {
    return fetch(API.USER_UPDATE_LAST_READ_MESSAGE_AT, {
      method: 'put',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(errorFilter())
      .then((user) => {
        dispatch(updateUser(user))
      })
      .catch((error) => {
        dispatch(authFailed(error))
      })
  }

const updateError = (target, errorCode) =>
  (dispatch, getState) => {
    const state = getState()
    const error = Object.assign({}, state.user.error, { [target]: errorCode })
    dispatch(showError(error))
  }

const showError = (error) => ({
  type: SHOW_ERROR,
  payload: {
    error: error
  }
})

const removeError = (target) =>
  (dispatch, getState) => {
    const state = getState()
    const preError = state.user.error
    if (preError.hasOwnProperty(target)) {
      delete preError[target]
      const error = Object.assign({}, preError)
      dispatch(showError(error))
    }
  }

export const actions = {
  isLoggedIn,
  loginUser,
  registerUser,
  logoutUser,
  unauthorizedRoute,
  updateUsername,
  updateLastReadMessageAt,
  showError,
  updateError,
  removeError
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ISSUE_AUTH_REQUEST]: (state, action) => {
    return {
      ...state,
      isLoading : true,
      statusText : 'Authenticating...'
    }
  },
  [AUTH_SUCCESS]: (state, action) => {
    return {
      ...state,
      isLoading : false,
      isAuthenticated : true,
      error: {},
      statusText : `Successfully logged in.`
    }
  },
  [AUTH_FAILED]: (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      isAuthenticated: false,
      user: null,
      error: error,
      statusText: `Status: (${error.status}) ${error.message}`
    }
  },
  [LOGOUT]: (state, action) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
      error: {},
      statusText: 'Successfully logged out.'
    }
  },
  [UPDATE_USER]: (state, { user }) => {
    return {
      ...state,
      user : user
    }
  },
  [SHOW_ERROR]: (state, { error }) => {
    return {
      ...state,
      error: error.message
    }
  }
}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  statusText: '',
  error: {}
}

export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
