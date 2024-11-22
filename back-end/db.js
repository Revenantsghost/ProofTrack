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

let pool;

async function connectToDB() {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log('Connected to Azure SQL Database');
        }
        return pool;
    } catch (err) {
        console.error('Database connection failed', err);
        throw err;
    }
}

async function closeDB() {
    try {
        if (sql.connected) { 
            await sql.close();
            console.log('Database closed successfully');
        } else {
            console.log('Database already closed');
        }
    } catch (err) {
        console.error('Database close failed', err);
        throw err;
    }
}

module.exports = { connectToDB, sql, closeDB };
