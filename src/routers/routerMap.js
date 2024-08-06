//Controllers
const ProductController = require('../controllers/product')
const PictureController = require('../controllers/picture')

const {uploadSingle} = require('../routers/middlewares')

const routingMap = [
    {
        method: 'post',
        path: '/product/create',
        controller: ProductController,
        action: 'create'
    },{
        method: 'put',
        path: '/product/update',
        controller: ProductController,
        action: 'update'
    },{
        method: 'get',
        path: '/product/getById/:itemId',
        controller: ProductController,
        action: 'getById'
    },{
        method: 'get',
        path: '/product/search/byname',
        controller: ProductController,
        action: 'getProductsByName'
    },

    {
        method: 'post',
        path: '/img/:itemId',
        controller: PictureController,
        action: 'uploadPicture'
    },{
        method: 'get',
        path: '/img/:itemId',
        controller: PictureController,
        action: 'getPicturesByItemId',
        mid: uploadSingle //TODO - midi tesztelése, nem biztos, hogy műkszik XD
    }
]

module.exports = routingMap
