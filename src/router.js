const express = require('express')
const promiseRouter = require('express-promise-router')
const router = new promiseRouter()

//#region >>> SEQ-MODELS
const connector = require('./sequelize-stuff/dbConnector')
const Items = require('./sequelize-stuff/models/items')

router.post('/item/create', async (req, res) => {
    await connector(false)
    let item = Items.build({
        ProductName: req.body.ProductName
    })
    let shit = await item.save()

    res.json({
        item: shit
    })
})

//only for multipart/form-data MIME type
router.put(
    "/img/:itemId",
    async (req, res, next) => {
        console.log("/img/:itemId", req.files);
        if (req.files.image[0].length) {
            const image = req.files.image[0]; // { buffer, originalname, size, ...}
            //ImageBlobConverter.ImageToBlob(image.buffer)
            const {itemId} = req.params
            await connector(false)
            let picture = build({
                Picture: image,
                ItemId: itemId
            })
            let shit = await picture.save()
            res.send({ success: true, count: req.files.image.originalname });
        } else {
            res.send({ success: false, message: "No files sent." });
        }
    }
);
router.get(
    "/img/:itemId",
    async (req, res, next) => {
        console.log("/img/:itemId", req.files);
        if (req.files.image.length) {
            const {itemId} = req.params
            await connector(false)
            const images= Pictures.findAll({where: {ItemId: itemId}})
            res.send({ success: true, count: req.files.image.originalname });
        } else {
            res.send({ success: false, message: "No files sent." });
        }
    }
);
//#endregion




module.exports = router