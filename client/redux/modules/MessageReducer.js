import { errorFilter } from '../../utils/common'
import { routerActions } from 'react-router-redux'
import { message as globalMessage } from 'antd'
import { getQueryString } from '../../utils/common'
import API from '../../utils/APIConstants'


// ------------------------------------
// Constants
// ------------------------------------
export const START_LOAD             = 'message/START_LOAD'
export const LOAD_SUCCESS           = 'message/LOAD_SUCCESS'
export const LOAD_FAILED            = 'message/LOAD_FAILED'
export const CLEAR_UNREAD_MESSAGE   = 'message/CLEAR_UNREAD_MESSAGE'
export const SHOW_MESSAGE_MODAL     = 'message/SHOW_MESSAGE_MODAL'
export const HIDE_MESSAGE_MODAL     = 'message/HIDE_MESSAGE_MODAL'


// ------------------------------------
// Actions
// ------------------------------------
export const startLoad = () => ({ type: START_LOAD })
export const loadSuccess = (messages) => ({ type: LOAD_SUCCESS, messages: messages })
export const loadFailed = (error) => ({ type: LOAD_FAILED, error: error })
export const clearUnreadMessage = () => ({ type: CLEAR_UNREAD_MESSAGE })
export const hideMessageModal = () => ({ type: HIDE_MESSAGE_MODAL })
export const showMessageModal = () =>
  (dispatch, getState) => {
    dispatch(fetchMessages())
    dispatch({ type: SHOW_MESSAGE_MODAL })
  }

export const fetchMessages = () =>
  (dispatch, getState) => {
    dispatch(startLoad())
    const state = getState()

    const queryParams = {}
    let queryString = ''
    if (state.user.user) {
      queryParams.lastReadMessageAt = state.user.user.lastReadMessageAt
      queryString = queryString.concat('?', getQueryString(queryParams))
    }

    return fetch(`${API.MESSAGE}${queryString}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(errorFilter())
      .then((messages) => {
        dispatch(loadSuccess(messages))
      })
      .catch((error) => {
        dispatch(loadFailed(error))
      })
  }

export const sendMessage = (message) =>
  (dispatch, getState) => {
    dispatch(startLoad())
    return fetch(API.MESSAGE, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
      .then(errorFilter())
      .then((messages) => {
        dispatch(loadSuccess(messages))
        globalMessage.success('Message sent!')
      })
      .catch((error) => {
        dispatch(loadFailed(error))
        globalMessage.error('Failed to send!')
      })
  }

export const actions = {
  fetchMessages,
  sendMessage,
  clearUnreadMessage,
  showMessageModal,
  hideMessageModal
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [START_LOAD]: (state) => {
    return { ...state, isLoading: true }
  },
  [LOAD_SUCCESS]: (state, { messages }) => {
    return { ...state,
      isLoading: false,
      messages: messages.allMessages,
      unreadMessages: messages.unreadMessages ? messages.unreadMessages : []
    }
  },
  [LOAD_FAILED]: (state, { error }) => {
    return { ...state, isLoading: false, error: error }
  },
  [CLEAR_UNREAD_MESSAGE]: (state, action) => {
    return { ...state, unreadMessages: [] }
  },
  [SHOW_MESSAGE_MODAL]: (state, action) => {
    return { ...state, isShowMessageModal: true }
  },
  [HIDE_MESSAGE_MODAL]: (state, action) => {
    return { ...state, isShowMessageModal: false }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  isShowMessageModal: false,
  messages: [],
  unreadMessages: []
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

