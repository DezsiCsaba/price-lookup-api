const BaseController = require('./base')
const functions = require('../services/abstractedControllerHelper')
const ApiError = require('../classes/apiError')
const {Op} = require('sequelize')

//models
const Items = require('../sequelize-stuff/models/items')
const Prices = require('../sequelize-stuff/models/prices')

class ProductController extends BaseController{
    async create(){
        const itemBuild = Items.build({
            ProductName: this._req.body.productName
        })
        const itemSaved = functions.connectAndSave(itemBuild)

        const priceBuild = Prices.build({
            ShopName: this._req.body.body.shop,
            Price: this._req.body.body.price,
            ItemId: this._req.body.id
        })
        const priceSaved = functions.connectAndSave(priceBuild, true)

        this._res.json({
            itemId: itemSaved.id,
            item: itemSaved,
            price: priceSaved
        })
    }

    async update(){
        const oldVals = await Items.findAll()
        const bestMatch = functions.filterSimilarNames(this._req.productName, oldVals)

        if (!bestMatch){
            console.log('routers - product.update, could not find similar product')
            throw new ApiError('Could not find similar product', 100406, {statusCode: 406, shouldDisplay: false})
        }

        const connectedPrice = await Prices.findOne({
            where: {
                ShopName: this._req.body.shop,
                ItemId: bestMatch.id
            }
        })
        if (connectedPrice){
            const updatedPrice = await connectedPrice.update({
                ShopName: this._req.body.shop,
                Price: this._req.body.price
            })
            this._res.json({
                itemId: updatedPrice.id,
            })
        }
        //TODO - ezt a részt úgy ahogy van el kéne tűntetni és frontról meghívni a create-et, ha az update errort ad...
        else{
            let created = await Prices.build({
                ShopName: this._req.body.shop,
                Price: this._req.body.price,
                ItemId: bestMatch.id
            })
            let result = await created.save()
            this._res.json({
                itemId: result.ItemId
            })
        }
    }

    async getById(){
        const itemId = this._req.params
        const item = await Items.findOne({
            include: [
                {model: Pictures},
                {model: Prices}
            ],
            where: {id: itemId}
        })

        const converted = functions.akosMagiko([item])
        this._res.send(JSON.stringify(converted[0])) //TODO - json-el kéne itt is visszatérni, nem tudom miért így adjuk vissza
    }


    async getProductsByName(){
        const productName = this._req.query.productName
        const allLikeName = await Items.findAll({
            inclue: [
                {model: Pictures, limit: 1},
                {model: Prices}
            ],
            where: {
                ProductName: {
                    [Op.like]: `${productName}`
                }
            }
        })

        if (allLikeName.length === 0){
            console.log(`routers - product.getProductsByName, could not find product with name: ${productName}`)
            throw new ApiError('Could not find the product you are looking for', 100406, {statusCode: 406, shouldDisplay: true})
        }

        const converted = functions.akosMagiko(allLikeName)
        this._res.json({
            searchResult: converted
        })
    }

    async recommendations(){

    }
}

module.exports = ProductController
