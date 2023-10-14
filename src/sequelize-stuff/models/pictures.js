const sequelize = require('sequelize')
const {Model} = require('sequelize')
const _db = require('../seqDB')

class Pictures extends Model {}

Pictures.init(
    {
        Picture: {
            type: sequelize.BLOB('long'),
            allowNull: false
        },
        ItemId: {
            type: sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: _db,
        tableName: 'pictures',
        modelName: 'Pictures'
    }
)

module.exports = Pictures
