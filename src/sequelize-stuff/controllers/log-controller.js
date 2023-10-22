const Logger = require('../models/logger')
const connector = require('../dbConnector')

class LogController{
    constructor() {

    }

    async createLog(req, res, next){
        await connector(false)
        let log = Logger.build({
            Request: req.method,
            Path: `${req.url}`
        })
        await log.save()
        next()
    }

    async createLogWithError(err, req, res, next){
        await connector(false)
        let log = Logger.build({
            Request: req.method,
            Path: `${req.url}`,
            Error: err.code
        })
        await log.save()
        next()
    }
}

module.exports = LogController