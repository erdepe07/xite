# Xite

ERP Management System – Tauri + React + PHP-to-React Bridging Compiler

Selamat datang di proyek ERP Management System yang dibangun dengan arsitektur modern dan performa tinggi. Proyek ini memanfaatkan Tauri sebagai platform desktop-native, React sebagai antarmuka frontend, serta sebuah bridging compiler yang berfungsi menerjemahkan logika atau konfigurasi dari PHP source code ke React-compatible source code.


# 🚀 Fitur Utama
1. Desktop App Berbasis Tauri

Performa cepat (lebih ringan dari Electron)
Ukuran build kecil
Native API access (filesystem, OS integration)
Aman dan mudah di-deploy

2. Frontend Modern Menggunakan React

UI deklaratif dan modular
State management fleksibel (Redux / Zustand / Recoil — dapat diganti sesuai kebutuhan)
Komponen-komponen dapat diperluas untuk modul ERP lainnya

3. Bridging Compiler: PHP → React Source Translator

- Salah satu komponen utama dari proyek ini adalah bridging compiler internal yang berfungsi:
- Membaca struktur atau definisi modul ERP dari file PHP (misalnya model, controller, schema, rules)
- Menganalisis kode (AST parsing)
- Menerjemahkan struktur tersebut menjadi:

    - React component
    - Hook logic
    - API interface
    - Validation schema
    - Dynamic form / table configuration

Tujuan utamanya adalah mempercepat migrasi ERP lama yang masih berbasis PHP ke aplikasi modern tanpa harus menulis ulang dari nol.