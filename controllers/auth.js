const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  console.log('Requested Body', req.body)
  // const user = await User.create({ ...req.body })
  // const token = user.createJWT()
  // res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })

  try {
    // Extract user data from request body
    const { name, email, password, role } = req.body

    // Ensure required fields are provided
    if (!name || !email || !password || !role) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Please provide all required fields' })
    }

    // Create a new user
    const user = await User.create({ name, email, password, role })

    // Generate a JWT token
    const token = user.createJWT()

    // Respond with the user's name and the JWT token
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Error registering user', error: error.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please Provide Email and Password')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Please Provide valid Credientials')
  }

  const iscorrectPassword = await user.comparePassword(password)
  if (!iscorrectPassword) {
    throw new UnauthenticatedError('please provide valid Password')
  }

  const token = await user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
  register,
  login,
}
