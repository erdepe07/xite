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
        
        // 1. Cari pengguna
        const [users] = await connection.execute(
            'SELECT NAMAPENGGUNA, PASSWORD, NAMA, HAKAKSESID FROM 01_tms_penggunaaplikasi WHERE NAMAPENGGUNA = ?',
            [username]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ status: 'error', message: 'User tidak ditemukan.' });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.PASSWORD);

        if (isMatch) {
            // 2. Ambil DAFTAR MENU dinamis dari database untuk role ini
            const [menus] = await connection.execute(
                'SELECT menu_id FROM 01_tms_hak_akses_menu WHERE hak_akses_id = ?',
                [user.HAKAKSESID]
            );

            // LIHAT DI TERMINAL NODE.JS ANDA
    console.log("LOG: Hak Akses ID =", user.HAKAKSESID);
    console.log("LOG: Raw Data Menu =", menus);




            // Ubah hasil array objek [{menu_id: 'a'}, {menu_id: 'b'}] menjadi ['a', 'b']
            const allowedMenus = menus.map(m => m.menu_id);

                console.log("LOG: Final Array =", allowedMenus);

            res.json({ 
                status: 'success', 
                user: { 
                    nama: user.NAMA, 
                    hakAksesId: user.HAKAKSESID,
                    allowedMenus: allowedMenus // Daftar menu dinamis dari DB
                } 
            });
        } else {
            res.status(401).json({ status: 'error', message: 'Password salah.' });
        }

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
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


// --- RUTE API UNTUK MENGAMBIL DATA BARANG ---
app.get('/api/barang', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        // Query untuk mengambil data dari tabel barang (sesuaikan nama tabel Anda)
        // Contoh: SELECT id, kode, nama, harga_jual FROM tms_barang
        const [rows] = await connection.execute('SELECT * FROM 01_tms_barang'); 
        
        res.json({ 
            status: 'success', 
            data: rows 
        });
    } catch (error) {
        console.error("Error ambil data barang:", error.message);
        res.status(500).json({ 
            status: 'error', 
            message: 'Gagal mengambil data barang' 
        });
    } finally {
        if (connection) connection.end();
    }
});


app.get('/api/users', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        // Ambil data kecuali password untuk keamanan
        const [rows] = await connection.execute(
            'SELECT NAMAPENGGUNA, NAMA, HAKAKSESID FROM 01_tms_penggunaaplikasi'
        );
        
        res.json({ 
            status: 'success', 
            data: rows 
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    } finally {
        if (connection) connection.end();
    }
});


// --- START SERVER ---
app.listen(port, () => {
    console.log(`Backend API berjalan di http://localhost:${port}`);
    console.log(`Endpoint Login: POST http://localhost:${port}/api/login`);
});