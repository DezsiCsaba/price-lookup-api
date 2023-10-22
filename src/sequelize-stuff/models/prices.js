const sequelize = require('sequelize')
const {Model} = require('sequelize')
const _db = require('../seqDB')

const Items = require('./items')

class prices extends Model {}

prices.init(
    {
        Price: {
            type: sequelize.INTEGER,
            allowNull: false
        },
        ShopName: {
            type: sequelize.STRING,
            allowNull: false
        },
        ItemId: {
            type: sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: _db,
        tableName: 'prices',
        modelName: 'Prices'
    }
)

module.exports = prices





