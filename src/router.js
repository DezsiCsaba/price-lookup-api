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
const Prices = require('./sequelize-stuff/models/prices')
//#endregion


//#region >>> OTHER STUFF
function sendToElasticAndLogToConsole (sql, queryObject) {
    console.log(sql)
}
const connector = require('./sequelize-stuff/dbConnector')
const multer = require("multer");
const upload = multer();
const {Op} = require('sequelize')
const {all} = require("express/lib/application");
const _ = require('lodash')
//#endregion



//#region >>> ROUTES
router.use(async (req, res, next) => {
    await logController.createLog(req, res, next)
})

//>>> ITEMS
router.post('/product/create', async (req, res) => {
    await connector(false)

    let item = Items.build({
        ProductName: req.body.productName
    })
    let shit = await item.save()

    let price = Prices.build({
        ShopName: req.body.shop,
        Price: req.body.price,
        ItemId: shit.id
    })
    let shiter = await price.save()

    if (!shit || !shiter){
        res.sendStatus(406)
    }
    res.json({
        itemId: shit.id
    })
})
//updateOrAddProduct
router.put("/product/update", async (req, res) => {
    await connector()

    let oldVals = await Items.findAll()
    console.log({asd: req.body.productName})
    let bestMatch = filterSimilarNames(req.body.productName, oldVals )
    console.log({bestMatch})
    if (!bestMatch){
        res.sendStatus(406)
        return
    }

    let shopExists = null
    shopExists = await Prices.findOne({
        where: {
            ShopName: req.body.shop,
            ItemId: bestMatch.id
        }
    })
    console.log({shopExists})
    if(shopExists !== null){
        let updated = await shopExists.update({
            ShopName: req.body.shop,
            Price: req.body.price
        })
        res.json({
            itemId: updated.ItemId
        })
    }
    else{
        let created = await Prices.build({
            ShopName: req.body.shop,
            Price: req.body.price,
            ItemId: bestMatch.id
        })
        let result = await created.save()
        res.json({
            itemId: result.ItemId
        })
    }



})
function filterSimilarNames(like, allEntry){
    let percArray = []
    let cutOff = 80 //minimum percentage of similarity

    allEntry.forEach((entry) => {
        let perc = similarity(like, entry.ProductName)
        if(perc >= cutOff/100){
            percArray.push({
                percentage: perc,
                id: entry.id
            })
        }
    })
    console.log({percArray})
    return _.maxBy(percArray, (a) => {return a.percentage})
}

function similarity(s1, s2) {
    console.log('checking similarity between: ' + s1 + ', ' + s2)
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = []
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}
//http://localhost:3000/api/product/search/byname/

router.get('/product/getById/:itemId', async (req, res) => {
    let {itemId} = req.params
    let item = await Items.findOne({
        include: [
            {model: Pictures},
            {model: Prices}
        ],
        where: {id: itemId}
    })

    if (item === null) {
        res.sendStatus(406)
        return
    }
    let list = [item]
    let result = akosMagiko(list)

    res.send(JSON.stringify(result[0]))
})
router.get('/product/search/byname', async (req, res) => {
    console.log('>>>>> incoming search request')
    let productName = req.query.productName
    let allLikeName = await Items.findAll({
        include: [
            {model: Pictures, limit:1},
            {model: Prices}
        ],
        where: {
            ProductName: {
                [Op.like]: `%${productName}%`
            }
        },
    })
    if (allLikeName.length === 0){
        res.sendStatus(406)
        return
    }

    /*
    let obj=[]
    allLikeName.forEach((item)=>{
        let Pictures=[]
        let Prices=[]
        let main= {
            id: item.id,
            ProductName:item.ProductName,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            Pictures:Pictures,
            Prices:Prices
        }
        item.Pictures.forEach((p)=>{
            let pic={
                id: p.id,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                image: Buffer.from(p.Picture).toString('base64')
            }
            Pictures.push(pic)
        })
        item.Prices.forEach((pr)=>{
            let price={...pr}
            Prices.push(price)
        })
        obj.push(main)
    })*/
    let obj = akosMagiko(allLikeName)
    res.json({
        "searchResult": obj
    })
})
router.get('/recommendations', async (req, res) => {
    let allLikeName = await Items.findAll({
        include: [
            {model: Pictures, limit:1},
            {model: Prices}
        ],
    })
    if (allLikeName.length === 0) {
        res.sendStatus(406)
        return
    }
    /*let obj=[]
    allLikeName.forEach((item)=>{
        let Pictures=[]
        let Prices=[]
        let main= {
            id: item.id,
            ProductName:item.ProductName,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            Pictures:Pictures,
            Prices:Prices
        }
        item.Pictures.forEach((p)=>{
            let pic={
                id: p.id,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                image: Buffer.from(p.Picture).toString('base64').slice(0,10)
            }
            Pictures.push(pic)
        })
        item.Prices.forEach((pr)=>{
            let price={...pr.dataValues}
            Prices.push(price)
        })
        obj.push(main)
    })*/

    let obj = akosMagiko(allLikeName)
    let sorted = _.sortBy(obj, (item) => {
        return _.maxBy(item.Prices, (price) => {return price.updatedAt}).updatedAt
    })
    res.json({
        searchResult: sorted.reverse().slice(0, sorted.length > 20 ? -20 : sorted.length)
    })
})

//>>> PICTURES
//only for multipart/form-data MIME type
router.post("/img/:itemId", upload.single('file'), async (req, res) => {
    let {itemId} = req.params
    let img = req.file

    console.log({itemId})
    if (img){
        console.log('a z img type-ja: ',typeof img)
        console.log({img})
    }

    if (!img) {
        console.log('>>>>> [ERROR] nincs img!!!')
        res.sendStatus(406)
        return
    }

    await connector(false)
    let picture = Pictures.build({
        Picture: img.buffer,
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
    const images= await Pictures.findAll({
        include: Items,
        where: {
            ItemId: itemId
        }
    })

    if (images.length === 0){
        res.sendStatus(406)
        return
    }
    let imgs=[]
    images.forEach((img) => {
        let arraybuffer= Buffer.from(img.Picture)
        // imgs.push(arraybuffer.toString('base64'))
        let ret = {
            array: arraybuffer.toString('base64'),
            item: img.Item
        }
        // let ret = {
        //     array: arraybuffer.toString('base64').slice(0, 30),
        //     item: img.Item
        // }
        imgs.push(ret)
    })

    res.setHeader("Content-Type", "application/json");
    res.json({
        succes: true,
        images: imgs
    })
})
//#endregion


function akosMagiko(iterableArray){
    let obj=[]
    iterableArray.forEach((item)=>{
        let Pictures=[]
        let Prices=[]
        let main= {
            id: item.id,
            ProductName:item.ProductName,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            Pictures:Pictures,
            Prices:Prices
        }
        item.Pictures.forEach((p)=>{
            let pic={
                id: p.id,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                image: Buffer.from(p.Picture).toString('base64')
            }
            Pictures.push(pic)
        })
        item.Prices.forEach((pr)=>{
            let price={...pr.dataValues}
            Prices.push(price)
        })
        obj.push(main)
    })
    return obj
}

module.exports = router