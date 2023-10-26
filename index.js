const express = require('express')
const config = require('./src/config')
const app = express()

const router = require('./src/router')

const cors = require('cors')

const LogController = require('./src/sequelize-stuff/controllers/log-controller')
const logController = new LogController()


app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(async (err, req, res, next) => {
    // await logController.createLogWithError(err, req, res, next)
    console.log('\n\n\nSOMETHING WENT DOWNHILL M8 >>>> details below:')
    console.error(err.stack)
    
    res.status(500).json({
        msg: 'Something broke!',
        err: err.message
    })
    throw new Error(err.stack)
})

const PORT = config.SERVER_PORT
app.listen(PORT, () => {
    console.log(`\n\n\t***** Server RUNNNING >>> PORT : ${PORT} *****`)
})
