const env = process.env


const conf = {
    DB_HOST: env.DB_HOST || 'localhost',
    DB_PORT: env.DB_PORT || '3306',
    DB_USER: env.DB_USER || 'root',
    DB_PASSWORD: env.DB_PASSWORD || '',
    DATABASE: env.DATABASE || 'price_lookup',
    DIALECCT: env.DIALECT || 'mysql',

    SERVER_PORT: env.SERVER_PORT || 3000
}

module.exports = conf