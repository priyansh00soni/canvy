import ApiError from '../utils/ApiError.js'

const validateBody = (schema) => {
  return (request, response, next) => {
    const validationResult = schema.safeParse(request.body)

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors
      return next(new ApiError(400, 'Validation failed', null, fieldErrors))
    }

    request.body = validationResult.data
    next()
  }
}

export default validateBody