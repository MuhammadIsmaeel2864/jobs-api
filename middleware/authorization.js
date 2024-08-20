const { UnauthenticatedError } = require('../errors')

const adminAuth = (req, res, next) => {
  console.log('User Role', req.user.role)

  // Ensure user is authenticated
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' })
  }

  next()
}

module.exports = adminAuth
