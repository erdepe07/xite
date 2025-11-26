import 'package:flut/login_screen.dart';
import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  // Terima nama pengguna dari halaman login
  final String userName;

  const DashboardScreen({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Utama'),
        automaticallyImplyLeading: false, // Hapus tombol back
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Icon(
              Icons.check_circle_outline,
              color: Colors.green,
              size: 80,
            ),
            const SizedBox(height: 20),
            const Text(
              'Selamat Datang',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            // Menampilkan nama pengguna yang berhasil login
            Text(
              userName,
              style: const TextStyle(fontSize: 36, color: Colors.blue),
            ),
            const SizedBox(height: 40),
            // Contoh tombol logout
            ElevatedButton(
              onPressed: () {
                // Navigasi kembali ke halaman login (untuk logout)
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
              child: const Text('Logout'),
            ),
          ],
        ),
      ),
    );
  }
}
