const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Tambahkan bcrypt

const app = express();
const port = 3000; 

app.use(cors()); 
app.use(express.json());

// --- KONFIGURASI DATABASE DIARAHKAN KE 'ramin' ---
const dbConfig = {
    host: 'localhost', 
    user: 'root',
    password: '3nt3r33x',
    database: 'ramin', // <-- UBAH KE DB BARU
    port: 3306,
    dateStrings: true 
};

// --- RUTE API UNTUK LOGIN (POST) ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);
        
        // 1. Cari pengguna berdasarkan NAMAPENGGUNA
        const [rows] = await connection.execute(
            'SELECT NAMAPENGGUNA, PASSWORD, NAMA, HAKAKSESID FROM 01_tms_penggunaaplikasi WHERE NAMAPENGGUNA = ?',
            [username]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Nama pengguna tidak ditemukan.' });
        }
        
        const user = rows[0];
        const hashedPassword = user.PASSWORD;

        // 2. Bandingkan password yang dimasukkan dengan hash di database
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            // Login Berhasil
            res.json({ 
                status: 'success', 
                message: 'Login Berhasil!', 
                user: { 
                    nama: user.NAMA, 
                    hakAksesId: user.HAKAKSESID 
                } 
            });
        } else {
            // Password Salah
            res.status(401).json({ status: 'error', message: 'Password salah.' });
        }

    } catch (error) {
        console.error("Error saat login:", error.message);
        res.status(500).json({ status: 'error', message: 'Kesalahan Server', detail: error.message });
    } finally {
        if (connection) connection.end();
    }
});


// RUTE LAMA /api/testing (Hapus atau biarkan jika masih diperlukan)
app.get('/api/testing', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id, kode, nama FROM testing');
        res.json({ status: 'success', data: rows });
    } catch (error) {
        console.error("Error saat mengakses DB:", error.message);
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data dari database.', detail: error.message });
    } finally {
        if (connection) connection.end();
    }
});


// --- START SERVER ---
app.listen(port, () => {
    console.log(`Backend API berjalan di http://localhost:${port}`);
    console.log(`Endpoint Login: POST http://localhost:${port}/api/login`);
});