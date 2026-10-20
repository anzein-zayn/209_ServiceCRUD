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

// POST (Tambah Data)
app.post('/biodata', (req, res) => {
    const { id, nama, nim, kelas } = req.body;

    pool.query(
        'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1,$2,$3,$4) RETURNING *',
        [id, nama, nim, kelas]
    )
        .then(result => res.json(result.rows[0]))
        .catch(err => console.error(err));
});

// PUT (Update Data)
app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    pool.query(
        'UPDATE biodata SET nama=$1, nim=$2, kelas=$3 WHERE id=$4 RETURNING *',
        [nama, nim, kelas, id]
    )
        .then(result => {
            if (result.rowCount === 0) {
                return res.status(404).json({
                    message: "Data tidak ditemukan"
                });
            }

            res.json({
                message: "Data berhasil diupdate",
                data: result.rows[0]
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});
