class ApiError extends Error{
    constructor(
        message,
        customCode,
        params={
            statusCode: 500,
            err: {},
            shouldDisplay: true,
        }
    ){
        super(message)
        this.code = customCode
        this.statusCode = params.statusCode
        this.originalError = params.err
        this.params = params
        this.shouldDisplay = params.shouldDisplay || true //this way if it is not defined as false the error will be dispayed
    }
}

module.exports = ApiError
