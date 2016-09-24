
const UserResponse = (user) => ({
  userId: user.id,
  role: user.role,
  username: user.username ? user.username : '',
  lastLogin: user.lastLogin,
  lastReadMessageAt: user.lastReadMessageAt,
  status: user.status
})

export default UserResponse
