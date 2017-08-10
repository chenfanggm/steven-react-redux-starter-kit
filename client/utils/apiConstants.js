const PREFIX = '/api/v1'

const API = {
  // USER
  USER: PREFIX + '/user',
  USER_ISLOGGEDIN: PREFIX + '/user/isLoggedIn',
  USER_LOGIN: PREFIX + '/user/login',
  USER_REGISTER: PREFIX + '/user/register',
  USER_LOGOUT: PREFIX + '/user/logout',
  USER_UPDATE_USERNAME: PREFIX + '/user/username',
  USER_UPDATE_LAST_READ_MESSAGE_AT: PREFIX + '/user/lastReadMessageAt'
}

export default API
