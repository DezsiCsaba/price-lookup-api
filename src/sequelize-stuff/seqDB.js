const config = require('../config')
const Sequelize = require('sequelize')

module.exports = new Sequelize(
    config.DATABASE,
    config.DB_USER,
    config.DB_PASSWORD,
    {
        host: config.DB_HOST,
        port: config.DB_PORT,
        dialect: config.DIALECCT
    }
)