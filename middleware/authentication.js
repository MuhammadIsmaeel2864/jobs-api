const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log('Authorization Header:', authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication Invalid')
  }

  const token = authHeader.split(' ')[1]
  console.log('Token', token)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Payload', payload)

    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid')
  }
}

module.exports = authenticateUser
