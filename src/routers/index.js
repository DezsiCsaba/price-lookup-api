const routingMap = require('./routerMap')
const promisRouter = require('express')
const _ = require('lodash')
const ApiError = require('../classes/apiError')

const router = new promisRouter()

const isLog = true

routingMap.forEach(routerConf => {
    const routingMapConfig = { ...routerConf }

    //mivel nincsenek felhasználói fiókok ez jelenleg felesleges
    // if (routingMapConfig.isAuth) {
    //     routingMapConfig.mid.push(authenticateMiddleware)
    // }
    const {
        method, path, controller, action, parser, mid,
    } = routingMapConfig

    router[method](path, async(req, res, next)=>{
        isLog && console.log(`Incoming request..\n\tmethod - ${method}\n\tpath - ${path}`)

        req.routingMapConfig = routingMapConfig
        const newController = new controller(req, res, next)
        await newController[action]()
            .catch((err)=>{
                if (err instanceof ApiError){
                    return res.status(err.statusCode).json({
                        msg: err.message,
                        err: err.originalError,
                        code: err.code,
                        shouldDisplay: err.shouldDisplay
                    })
                }
                throw err
            })
    })
})

module.exports = router
