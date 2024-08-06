//models

const connector = require('../sequelize-stuff/dbConnector')
const _ = require("lodash");

const functions = {
    //TODO - ezt az egész file-t átnézni, esetlegesen optimalizálni, ha méág lehet, illetve commentelgetni, h mi a rák van

    /**
     * Connects to DB and saves the given entry
     * @param entry
     * @param alreadyConnected
     * @returns {Promise<*>}
     */
    async connectAndSave(entry={}, alreadyConnected = false){
        await connector(false, alreadyConnected)
        return await entry.save()
    },

    /**
     * Filters and returns all the products by comparing productName similarity
     * @param like
     * @param allEntry
     * @returns {*}
     */
    filterSimilarNames(like, allEntry){
        let percArray = []
        let cutOff = 80 //minimum percentage of similarity

        allEntry.forEach((entry) => {
            let perc = this.similarity(like, entry.ProductName)
            if(perc >= cutOff/100){
                percArray.push({
                    percentage: perc,
                    id: entry.id
                })
            }
        })
        console.log({percArray})
        return _.maxBy(percArray, (a) => {return a.percentage})
    },

    /**
     *
     * @param s1
     * @param s2
     * @returns {number}
     */
    similarity(s1, s2) {
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
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
    },

    /**
     *
     * @param s1
     * @param s2
     * @returns {*}
     */
    editDistance(s1, s2) {
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
    },

    /**
     * Converts and returns image Buffers into base64 string
     * @param iterableArray
     * @returns {*[]}
     */
    akosMagiko(iterableArray){
        //TODO - kell egy megoldás fronton, hogy ezt ne kelljen, mert a sok conversion rohadtul lasítja a dolgokat
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

}

module.exports = functions
