
// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_LOGIN_MODAL     = 'global/SHOW_LOGIN_MODAL'
export const HIDE_LOGIN_MODAL     = 'global/HIDE_LOGIN_MODAL'
export const SHOW_REGISTER_MODAL  = 'global/SHOW_REGISTER_MODAL'
export const HIDE_REGISTER_MODAL  = 'global/HIDE_REGISTER_MODAL'
export const SHOW_USERNAME_MODAL  = 'global/SHOW_USERNAME_MODAL'
export const HIDE_USERNAME_MODAL  = 'global/HIDE_USERNAME_MODAL'

// ------------------------------------
// Actions
// ------------------------------------
export const showLoginModal = () => ({ type: SHOW_LOGIN_MODAL })
export const hideLoginModal = () => ({ type: HIDE_LOGIN_MODAL })
export const showRegisterModal = () => ({ type: SHOW_REGISTER_MODAL })
export const hideRegisterModal = () => ({ type: HIDE_REGISTER_MODAL })
export const showUsernameModal = () => ({ type: SHOW_USERNAME_MODAL })
export const hideUsernameModal = () => ({ type: HIDE_USERNAME_MODAL })
export const switchLoginRegisterForm = () =>
  (dispatch, getState) => {
    const state = getState()
    if (state.global.isShowLoginModal) {
      dispatch(hideLoginModal())
      dispatch(showRegisterModal())
    } else {
      dispatch(hideRegisterModal())
      dispatch(showLoginModal())
    }
  }

export const actions = {
  showLoginModal,
  hideLoginModal,
  showRegisterModal,
  hideRegisterModal,
  showUsernameModal,
  hideUsernameModal,
  switchLoginRegisterForm
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SHOW_LOGIN_MODAL]: (state, action) => {
    return { ...state, isShowLoginModal: true }
  },
  [HIDE_LOGIN_MODAL]: (state, action) => {
    return { ...state, isShowLoginModal: false }
  },
  [SHOW_REGISTER_MODAL]: (state, action) => {
    return { ...state, isShowRegisterModal: true }
  },
  [HIDE_REGISTER_MODAL]: (state, action) => {
    return { ...state, isShowRegisterModal: false }
  },
  [SHOW_USERNAME_MODAL]: (state, action) => {
    return { ...state, isShowUsernameModal: true }
  },
  [HIDE_USERNAME_MODAL]: (state, action) => {
    return { ...state, isShowUsernameModal: false }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isShowLoginModal: false,
  isShowRegisterModal: false,
  isShowUsernameModal: false
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
