class ApiError extends Error {
    constructor(
        statusCode,
        message = 'Something went wrong',
        data = null,
        errors = []
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = data
        this.success = false
        this.errors = errors
    }
}

export default ApiError