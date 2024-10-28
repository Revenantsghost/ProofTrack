
const express = require('express');
const cors = require('cors');
const { connectToDB, sql } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/fetchData', async (req, res) => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query('SELECT * FROM proofTrackDemo');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
