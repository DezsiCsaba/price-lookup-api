const BaseController = require('./base')
const functions = require('../services/abstractedControllerHelper')
const ApiError = require('../classes/apiError')
const Pictures = require('../sequelize-stuff/models/pictures')
const connector = require("../sequelize-stuff/dbConnector");
const Items = require("../sequelize-stuff/models/items");

class PictureController extends BaseController{
    async uploadPicture(){
        const {itemId} = this._req.params
        const img = this._req.file

        console.log('getByItemId, itemId - ', itemId)

        const pictureBuild = Pictures.build({
            Picture: img.buffer,
            ItemId: itemId
        })
        const pictureSaved = await functions.connectAndSave(pictureBuild)

        //TODO - ha nem használjuk fel a response-t akkor elég lenne egy 200OK
        this._res.json({
            asd: Buffer.from(img.buffer),
            success: true, //TODO - why?
            uploaded: this._req.file.originalname
        })
    }

    async getPicturesByItemId(){
        console.log('getPicturesByItemId', this._req.files);

        const {itemId} = this._req.params

        const pictures= await Pictures.findAll({
            include: Items,
            where: {
                ItemId: itemId
            }
        })

        if (pictures.length === 0){
            throw new ApiError('Item has no picture', 100406, {statusCode: 406, shouldDisplay: false})
        }

        let imgs=[]
        pictures.forEach((img) => {
            let arraybuffer= Buffer.from(img.Picture)
            imgs.push({
                array: arraybuffer.toString('base64'),
                item: img.Item
            })
        })

        this._res.setHeader("Content-Type", "application/json");
        this._res.json({
            succes: true, //TODO - why?
            images: imgs
        })
    }

}

module.exports = PictureController
