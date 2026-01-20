import 'package:flutter/material.dart';
import 'user_management_screen.dart';

class PengaturanScreen extends StatelessWidget {
  final String role;
  final List<String> allowedMenus; // Tambahkan ini

  const PengaturanScreen({
    super.key, 
    required this.role, 
    required this.allowedMenus, // Tambahkan ke constructor
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pengaturan')),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Edit Profil'),
            onTap: () {},
          ),

          // SEKARANG JADI DINAMIS:
          // Tidak lagi cek role == 'OWNER', tapi cek daftar menu dari DB
          if (allowedMenus.contains('manajemen_user'))
            ListTile(
              leading: const Icon(Icons.people_alt, color: Colors.blue),
              title: const Text('Manajemen Semua Pengguna'),
              subtitle: const Text('Tambah atau hapus akun karyawan'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const UserManagementScreen()),
                );
              },
            ),

          ListTile(
            leading: const Icon(Icons.info_outline),
            title: const Text('Tentang Aplikasi'),
            onTap: () {},
          ),
        ],
      ),
    );
  }
}