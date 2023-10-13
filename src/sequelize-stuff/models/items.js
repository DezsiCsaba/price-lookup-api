const sequelize = require('sequelize')
const {Model} = require('sequelize')
const _db = require('../seqDB')

const Pictures = require('./pictures')
const Prices = require('./prices')

class Items extends Model {}

Items.init(
    {
        ProductName: {
            type: sequelize.STRING,
            allowNull: false
        }
    },
    {
        sequelize: _db,
        tableName: 'items',
        modelName: 'Items'
    }
)

Items.hasMany(Pictures, {foreignKey: 'ItemId'})
Pictures.belongsTo(Items)

Items.hasMany(Prices, {foreignKey: 'ItemId'})
Prices.belongsTo(Items)

module.exports = Items





