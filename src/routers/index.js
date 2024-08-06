const routingMap = require('./routerMap')
const promisRouter = require('express')
const _ = require('lodash')

const router = promiseRouter()
routingMap.forEach(routerConf => {
    const routingMapConfig = { ...routerConf }

    //mivel nincsenek felhasználói fiókok ez jelenleg felesleges
    // if (routingMapConfig.isAuth) {
    //     routingMapConfig.mid.push(authenticateMiddleware)
    // }
    const {
        method, path, controller, action, parser, mid,
    } = routingMapConfig

    router[method](path, ...mid, async(req, res, next)=>{
        req.routingMapConfig = routingMapConfig
        const newController = new controller(req, res, next)
        await newController[action]()
    })
})

module.exports = router
