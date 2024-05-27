const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {

    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
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