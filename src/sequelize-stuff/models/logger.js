const sequelize = require('sequelize')
const {Model} = require('sequelize')
const _db = require('../seqDB')

class logger extends Model {}

logger.init(
    {
        Request:{
            type: sequelize.STRING
        },
        Path: {
            type: sequelize.STRING
        },
        Error:{
            type: sequelize.STRING,
            allowNull: true
        }
    },
    {
        sequelize: _db,
        tableName: 'logs',
        modelName: 'logger'
    }
)

module.exports = logger
