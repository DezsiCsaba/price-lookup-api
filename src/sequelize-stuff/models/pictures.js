const sequelize = require('sequelize')
const {Model} = require('sequelize')
const _db = require('../seqDB')

const Items = require('./items')

class pictures extends Model {}

pictures.init(
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

Items.hasMany(pictures, {foreignKey: 'ItemId'})
pictures.belongsTo(Items)

module.exports = pictures
