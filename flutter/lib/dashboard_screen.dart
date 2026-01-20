import 'package:flut/login_screen.dart';
import 'package:flutter/material.dart';
import 'barang_screen.dart';
import 'pengaturan_screen.dart';

class DashboardScreen extends StatelessWidget {
  final String userName;
  final String role;
  final List<String> allowedMenus; // Tambahkan ini

  const DashboardScreen({
    super.key, 
    required this.userName, 
    required this.role,
    required this.allowedMenus, // Tambahkan ke constructor
  });

  // Fungsi Logout
  void _handleLogout(BuildContext context) {
    // Menampilkan dialog konfirmasi
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Apakah Anda yakin ingin keluar?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context), // Tutup dialog
            child: const Text('Batal'),
          ),
          TextButton(
            onPressed: () {
              // Hapus semua rute dan balik ke LoginScreen
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const LoginScreen()),
                (route) => false,
              );
            },
            child: const Text('Logout', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Dashboard - $userName'),
        actions: [ // Tambahkan ini agar tombol logout muncul kembali
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _handleLogout(context),
          ),
        ],
      ),
      body: GridView.count(
        crossAxisCount: 4,
        padding: const EdgeInsets.all(20),
        children: [
          // Cek apakah 'transaksi' ada dalam daftar dari database
          if (allowedMenus.contains('transaksi'))
            _buildMenuItem(Icons.shopping_cart, 'Transaksi', Colors.green, () {}),

          // Cek apakah 'master_barang' ada
          if (allowedMenus.contains('master_barang'))
            _buildMenuItem(Icons.inventory_2, 'Master Barang', Colors.orange, () {
               Navigator.push(context, MaterialPageRoute(builder: (context) => const BarangScreen()));
            }),

          // Cek apakah 'laporan_keuangan' ada
          if (allowedMenus.contains('laporan_keuangan'))
            _buildMenuItem(Icons.bar_chart, 'Laporan Keuangan', Colors.blue, () {}),
            
          if (allowedMenus.contains('pengaturan'))
            _buildMenuItem(Icons.settings, 'Pengaturan', Colors.grey, () {
            Navigator.push(
              context, 
              MaterialPageRoute(
                builder: (context) => PengaturanScreen(
                  role: role, 
                  allowedMenus: allowedMenus, // Tambahkan ini!
                ) 
              )
            );
          }),
        ],
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String label, Color color, VoidCallback onTap) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 50, color: color),
            const SizedBox(height: 10),
            Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
