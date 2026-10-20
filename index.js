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

// GET ALL
app.get('/', (req, res) => {
    console.log("TEST DATA :");

    pool.query('SELECT * FROM biodata ORDER BY id')
        .then(result => {
            res.send(result.rows);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});
