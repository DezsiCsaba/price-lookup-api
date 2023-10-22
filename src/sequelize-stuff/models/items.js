const sequelize = require('sequelize')
const {Model} = require('sequelize')
const _db = require('../seqDB')

const Pictures = require('./pictures')
const Prices = require('./prices')

class items extends Model {}

items.init(
    {
        ProductName: {
            type: sequelize.STRING,
            allowNull: false
        }
    },
    {
        sequelize: _db,
        tableName: 'items',
        modelName: 'items'
    }
)

items.hasMany(Pictures, {foreignKey: 'ItemId'})
// Pictures.belongsTo(items)

items.hasMany(Prices, {foreignKey: 'ItemId'})
// Prices.belongsTo(items)

module.exports = items





