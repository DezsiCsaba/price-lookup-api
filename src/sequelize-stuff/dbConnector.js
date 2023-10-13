const _db = require('./seqDB')
const config = require('../config')

const connect = async (clearTable = false) => {
    console.log('>>> connecting to DB')
    await _db.authenticate()
        .then(async () => {
            console.log(`\n\n\t***** CONNECTION WITH DB ESTABLISHED >>> _db : ${config.DATABASE} *****`)

            if (clearTable){
                await _db.sync({
                    force: true
                })
            }
            else{
                await _db.sync()
            }
        }).catch((err) => {
            console.log('EROOR >>>> CANNOT CONNECT TO DATABASE')
            throw err
        })
}

module.exports = connect
