
const Token = () => ({
  device: { type: String },
  ip: { type: String },
  refreshToken: { type: String },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
})

export default Token
