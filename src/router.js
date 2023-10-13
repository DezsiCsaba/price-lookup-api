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

// router.post(
//     "/upload",
//     upload.fields([{ name: "image", maxCount: 1 }]),
//     async (req, res, next) => {
//         console.log("/upload", req.files);
//         if (req.files.image.length) {
//             const image = req.files.image[0]; // { buffer, originalname, size, ...}
//             //ImageBlobConverter.ImageToBlob(image.buffer)
//             await connector(false)
//             let picture = Pictures.build({
//                 Picture: image,
//                 ItemId:
//             })
//             let shit = await picture.save()
//             res.send({ success: true, count: req.files.image.originalname });
//         } else {
//             res.send({ success: false, message: "No files sent." });
//         }
//     }
// );
//#endregion




module.exports = router