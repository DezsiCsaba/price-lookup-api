const express = require('express')
const promiseRouter = require('express-promise-router')
const router = new promiseRouter()


//#region >>> SEQ-CONTROLLERS
const LogController = require('./sequelize-stuff/controllers/log-controller')
const logController = new LogController()
//#endregion


//#region >>> SEQ-MODELS
const Items = require('./sequelize-stuff/models/items')
const Pictures = require('./sequelize-stuff/models/pictures')
//#endregion


//#region >>> OTHER STUFF
function sendToElasticAndLogToConsole (sql, queryObject) {
    console.log(sql)
}
const connector = require('./sequelize-stuff/dbConnector')
const multer = require("multer");
const upload = multer();
//#endregion


//#region >>> ROUTES
router.use(async (req, res, next) => {
    await logController.createLog(req, res, next)
})

//>>> ITEMS
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


//>>> PICTURES
//only for multipart/form-data MIME type
router.post("/img/:itemId", upload.single('file'), async (req, res) => {
    let {itemId} = req.params
    let img = req.file

    if (!img) {
        res.json({
            success: false,
            message: "No files sent."
        })
        return
    }

    await connector(false)
    let picture = Pictures.build({
        Picture:  img.buffer,
        ItemId: itemId
    })
    await picture.save()
        .catch((err) => { throw err })

    res.json({
        asd: Buffer.from(img.buffer),
        success: true,
        uploaded: req.file.originalname
    })
})
router.get("/img/:itemId", async (req, res) => {
    console.log("/img/:itemId", req.files);
    const {itemId} = req.params
    await connector(false)
    const images= await Pictures.findAll({where: {ItemId: itemId}})

    if (images.length === 0){
        res.json({
            success: false,
            message: "No images found for id: "+itemId
        })
        return
    }
    let imgs=[]
    images.forEach((img) => {
        let arraybuffer= Buffer.from(img.Picture)
        imgs.push(arraybuffer.toString('base64'))
    })

    res.setHeader("Content-Type", "application/json");
    res.json({
        succes: true,
        images: imgs
    })
})
//#endregion



module.exports = router