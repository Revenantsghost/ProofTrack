require('dotenv').config();
const sql = require('mssql');


const config = {
  user: process.env.AZURE_SQL_USERNAME,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  options: {
    encrypt: true, // required for Azure
    trustServerCertificate: false
  },
  port: parseInt(process.env.AZURE_SQL_PORT, 10)
};

async function testConnection() {
  try {
    
    await sql.connect(config);
    console.log("Connected to the database!");

    
    const result = await sql.query`SELECT * FROM proofTrackDemo`; 
    console.log("Query result:", result);
  } catch (err) {
    console.error("Error connecting to the database:", err);
  } finally {

    await sql.close();
  }
}

async function testInsert() {
  try {
    await sql.connect(config);
    console.log("Connected to the database!");
    var values = ['link1', 'link1_url'];
    const result = await sql.query(`INSERT INTO proofTrackDemo (file_name, file_url) VALUES ('${values[0]}', '${values[1]}')`); 
    console.log("Query result:", result);
  } catch (err) {
    console.error("Error connecting to the database:", err);
  } finally {

    await sql.close();
  }
}


testInsert();
testConnection();

