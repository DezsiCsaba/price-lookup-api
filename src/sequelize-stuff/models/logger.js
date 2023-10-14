const sequelize = require('sequelize')
const {Model} = require('sequelize')
const _db = require('../seqDB')

class Logger extends Model {}

Logger.init(
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
        modelName: 'Logger'
    }
)

module.exports = Logger
