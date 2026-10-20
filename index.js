import express from 'express';
import pg from 'pg';
const app = express();
const port = process.env.PORT || 3000;
const { Pool } = pg;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mahasiswa',
    password: process.env.DB_PASSWORD || '12345', // sesuaikan dengan password database masing-masing
    port: process.env.DB_PORT || 5432,
});

// Middleware untuk error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!'
    });
});

// Middleware untuk validasi input
const validateBiodata = (req, res, next) => {
    const { nama, nim, kelas } = req.body;
    
    if (!nama || !nim || !kelas) {
        return res.status(400).json({
            error: 'nama, nim, dan kelas wajib diisi'
        });
    }
    
    if (typeof nama !== 'string' || nama.trim().length === 0) {
        return res.status(400).json({
            error: 'nama tidak valid'
        });
    }
    
    if (typeof nim !== 'string' || !/^\d+$/.test(nim)) {
        return res.status(400).json({
            error: 'nim harus berupa angka'
        });
    }
    
    next();
};

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
app.post('/biodata', validateBiodata, (req, res) => {
    const { id, nama, nim, kelas } = req.body;

    pool.query(
        'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1,$2,$3,$4) RETURNING *',
        [id, nama, nim, kelas]
    )
        .then(result => res.json(result.rows[0]))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Gagal menambahkan data'
            });
        });
});

// PUT (Update Data)
app.put('/biodata/:id', validateBiodata, (req, res) => {
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

// DELETE (Hapus Data)
app.delete('/biodata/:id', (req, res) => {
    const { id } = req.params;

    pool.query(
        'DELETE FROM biodata WHERE id=$1 RETURNING *',
        [id]
    )
        .then(result => {
            if (result.rowCount === 0) {
                return res.status(404).json({
                    message: "Data tidak ditemukan"
                });
            }

            res.json({
                message: "Data berhasil dihapus",
                data: result.rows[0]
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
