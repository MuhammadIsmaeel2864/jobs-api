const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //First of all we set Defaults 

    statuscode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong please try again later'

  }
  // No need to use CustomAPIError any More 

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(','),
      customError.statuscode = 400
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value for ${Object.keys(err.keyValue)} field , please choose valid value`,
      customError.statuscode = 400
  }

  // Error handling For Error Name "CastError"

  if (err.name === 'CastError') {
    customError.msg = `No job with ${err.value} ID Exsist`,
      customError.statuscode = 404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statuscode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
