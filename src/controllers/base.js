

class BaseController {
    constructor(req, res, next) {
        this._req = req
        this._res = res
        this._next = next
    }

    response(data){
        return {
            response: data
        }
    }

    result(data, options={}){

    }

}

module.exports = BaseController
