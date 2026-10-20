const express = require('express');
const pg = require('pg');
const app = express();
const port = 3000;
const { Pool } = pg;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '12345', // sesuaikan dengan password database masing-masing
    port: 5432,
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
