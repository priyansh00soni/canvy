import ApiError from '../utils/ApiError.js'

const errorHandler = (error, req, res, next) => {
    let apiError = error

    if (!(apiError instanceof ApiError)) {
        if (error.name === 'ValidationError') {
            const validationMessages = Object.values(error.errors).map((fieldError) => fieldError.message)
            apiError = new ApiError(400, 'Validation failed', validationMessages)
        } 
        else if (error.name === 'CastError') apiError = new ApiError(400, 'Invalid id format')
        else if (error.type === 'entity.parse.failed') apiError = new ApiError(400, 'Invalid JSON in request body')
        else {
            console.error(error)
            apiError = new ApiError(500, 'Internal server error')
        }
    }

    res.status(apiError.statusCode).json({
        success: false,
        message: apiError.message,
        errors: apiError.errors,
        data: null,
    })
}

export default errorHandler