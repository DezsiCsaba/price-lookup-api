const _db = require('./seqDB')
const config = require('../config')
function sendToElasticAndLogToConsole (sql, queryObject) {
    // console.log(sql)
}
const connect = async (clearTable = false) => {
    console.log('>>> connecting to DB')
    await _db.authenticate()
        .then(async () => {
            console.log(`\n\n\t***** CONNECTION WITH DB ESTABLISHED >>> _db : ${config.DATABASE} *****`)

            if (clearTable){
                console.log('>>> TABLE BEING RECREATED DUE TO force sync being true <<<')
                await _db.sync({
                    logging: (sql, queryObject) => {
                        sendToElasticAndLogToConsole(sql, queryObject)
                    },
                    force: true
                })
            }
            else{
                await _db.sync()
            }
        }).catch((err) => {
            console.log('EROOR >>>> CANNOT CONNECT TO DATABASE')
            console.error(err)
            throw err
        })
}

module.exports = connect
