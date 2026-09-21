import ApiError from '../utils/ApiError.js'

const errorHandler = (err, req, res, next) => {
    let error = err

    if (!(error instanceof ApiError)) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((e) => e.message)
            error = new ApiError(400, 'Validation failed', errors)
        } else if (err.name === 'CastError') {
            error = new ApiError(400, 'Invalid id format')
        } else if (err.type === 'entity.parse.failed') {
            error = new ApiError(400, 'Invalid JSON in request body')
        } else {
            console.error(err)
            error = new ApiError(500, 'Internal server error')
        }
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: null,
    })
}

export default errorHandler