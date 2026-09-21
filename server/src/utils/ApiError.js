class ApiError extends Error {
    constructor(
        statusCode,//if no msg given, aaccept this.
        errors = []
    ) {
        super(message) 
        this.statusCode = statusCode
        this.data = null 
        this.message = message
        this.success = false
        this.errors = errors
    }
}
export default ApiError
