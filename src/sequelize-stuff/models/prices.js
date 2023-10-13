const sequelize = require('sequelize')
const {Model} = require('sequelize')
const _db = require('../seqDB')


class Prices extends Model {}

Prices.init(
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
        tableName: 'Prices',
        modelName: 'Prices'
    }
)

module.exports = Prices





