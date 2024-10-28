const sql = require('mssql');

const config = {
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    user: process.env.AZURE_SQL_USERNAME,
    password: process.env.AZURE_SQL_PASSWORD,
    options: {
        encrypt: true, // for Azure SQL
        enableArithAbort: true
    }
};

async function connectToDB() {
    try {
        let pool = await sql.connect(config);
        console.log('Connected to Azure SQL Database');
        return pool;
    } catch (err) {
        console.error('Database connection failed', err);
        throw err;
    }
}

module.exports = { connectToDB, sql };
