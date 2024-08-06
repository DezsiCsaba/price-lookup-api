//alap
const express = require('express')
const config = require('./src/config')
const app = express()

//router + extras
const router = require('./src/router')
const newRouter = require('./src/routers/index')
const cors = require('cors')
const ApiError = require('./src/classes/apiError')

//logger
const LogController = require('./src/controllers/log-controller')
const logController = new LogController()

//error handling
function errorHandler (err, req, res, next) {
    console.log('index.errorHandler', err, '\n>>> Unhandled error!!!')

    if (err instanceof ApiError){
        res.status(err.statusCode).json({
            msg: err.message,
            err: err.originalError,
            code: err.code,
            shouldDisplay: err.shouldDisplay
        })
    }
    else{
        res.status(500).json({
            msg: 'Something broke!',
            err: err.message
        })
    }
}

//.use
app.use(cors())
app.use(express.json())
app.use('/api', newRouter)
app.use(errorHandler)

const PORT = config.SERVER_PORT

app.listen(PORT, () => {
    console.log(`\n\n\t***** Server RUNNNING >>> PORT : ${PORT} *****`)
})


