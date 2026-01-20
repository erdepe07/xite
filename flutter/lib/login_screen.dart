import 'package:flutter/material.dart';
import 'services/db_service.dart';
import 'dashboard_screen.dart'; // Pastikan sudah diimport

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // ... (Controllers, _isLoading, _message tetap sama) ...
  final TextEditingController _usernameController = TextEditingController(
    text: 'erayadigital',
  );
  final TextEditingController _passwordController = TextEditingController(
    text: 'yourpassword',
  );
  bool _isLoading = false;
  String _message = '';

  // --- METHOD LOGIN TETAP SAMA ---
  Future<void> _handleLogin() async {
    setState(() {
      _isLoading = true;
      _message = '';
    });

    final username = _usernameController.text;
    final password = _passwordController.text;

    final result = await AuthService().login(username, password);

    setState(() {
      _isLoading = false;
    });

    if (result['success'] == true) {
      // PERBAIKAN DI SINI:
      // 1. Gunakan key 'hakAksesId' sesuai response dari server.js Anda
      // 2. Gunakan ?.toString() ?? "" untuk menghindari error 'Null is not subtype of String'
      //final userName = result['user']['nama']?.toString() ?? "User";
      //final role = result['user']['hakAksesId']?.toString() ?? "GUEST";
      print("HAK AKSES DARI DB: ${result['user']['hakAksesId']}");
      print("MENU YANG DITERIMA: ${result['user']['allowedMenus']}");
      final List<String> menus = List<String>.from(result['user']['allowedMenus'] ?? []);

      if (!mounted) return;

      print("DEBUG DATA USER: ${result['user']}"); // Tambahkan ini untuk cek terminal
      print("DEBUG MENUS: $menus");

      // Navigasi ke Dashboard
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => DashboardScreen(
            userName: result['user']['nama'] ?? "User",
            role: result['user']['hakAksesId'] ?? "GUEST",
            allowedMenus: menus, // Kirim list menu dinamis
          ),
        ),
      );
    } else {
      setState(() {
        _message = result['message'];
      });
    }
  }

  // --- BUILD METHOD DENGAN DUA KOLOM ---
  @override
  Widget build(BuildContext context) {
    // Scaffold tidak memerlukan AppBar karena kita ingin tampilan penuh (Full View)
    return Scaffold(
      body: Row(
        children: <Widget>[
          // 1. KOLOM KIRI (Visual & Branding) - Lebar 40%
          const Expanded(flex: 4, child: LeftBrandingColumn()),

          // 2. KOLOM KANAN (Form Input Login) - Lebar 60%
          Expanded(
            flex: 6,
            child: RightLoginColumn(
              usernameController: _usernameController,
              passwordController: _passwordController,
              isLoading: _isLoading,
              message: _message,
              onLoginPressed: _handleLogin,
            ),
          ),
        ],
      ),
    );
  }
}

// --- WIDGET BARU: KOLOM KIRI (BRANDING) ---
class LeftBrandingColumn extends StatelessWidget {
  const LeftBrandingColumn({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      // Mengganti properti color langsung dengan decoration
      decoration: BoxDecoration(
        // LinearGradient untuk efek gradasi
        gradient: LinearGradient(
          // Sudut awal gradasi (mulai dari kiri atas)
          begin: Alignment.topLeft,
          // Sudut akhir gradasi (berakhir di kanan bawah)
          end: Alignment.bottomRight,
          // Daftar warna yang akan digunakan (dari biru tua ke biru muda)
          colors: [
            Colors.blue.shade900, // Biru sangat tua
            Colors.blue.shade500, // Biru sedang
          ],
        ),
      ),
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // Icon sebagai pengganti Logo POS
            Icon(Icons.point_of_sale, color: Colors.white, size: 100),
            SizedBox(height: 20),
            Text(
              'Eraya Minimalist POS System',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            Text(
              'Silakan masukkan kredensial Anda.',
              style: TextStyle(color: Colors.white70, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}

// --- WIDGET BARU: KOLOM KANAN (LOGIN FORM) ---
// --- WIDGET DIPERBARUI: KOLOM KANAN (LOGIN FORM) ---
class RightLoginColumn extends StatefulWidget {
  final TextEditingController usernameController;
  final TextEditingController passwordController;
  final bool isLoading;
  final String message;
  final VoidCallback onLoginPressed;

  const RightLoginColumn({
    super.key,
    required this.usernameController,
    required this.passwordController,
    required this.isLoading,
    required this.message,
    required this.onLoginPressed,
  });

  @override
  State<RightLoginColumn> createState() => _RightLoginColumnState();
}

class _RightLoginColumnState extends State<RightLoginColumn> {
  // Variabel lokal untuk mengatur sembunyi/tampil password
  bool _isPasswordObscured = true;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        padding: const EdgeInsets.all(40.0),
        constraints: const BoxConstraints(maxWidth: 450),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            const Text(
              'Akses Terminal',
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),

            // --- Username Field ---
            TextField(
              controller: widget.usernameController,
              decoration: const InputDecoration(
                labelText: 'Nama Pengguna',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.person),
              ),
            ),
            const SizedBox(height: 20.0),

            // --- Password Field (DENGAN HIDE/SHOW) ---
            TextField(
              controller: widget.passwordController,
              obscureText: _isPasswordObscured, // Menggunakan variabel state
              decoration: InputDecoration(
                labelText: 'Password',
                border: const OutlineInputBorder(),
                prefixIcon: const Icon(Icons.lock),
                // Menambahkan Icon di sebelah kanan
                suffixIcon: IconButton(
                  icon: Icon(
                    _isPasswordObscured 
                        ? Icons.visibility_off 
                        : Icons.visibility,
                  ),
                  onPressed: () {
                    // Toggle status obscureText
                    setState(() {
                      _isPasswordObscured = !_isPasswordObscured;
                    });
                  },
                ),
              ),
            ),
            const SizedBox(height: 30.0),

            // --- Login Button ---
            ElevatedButton(
              onPressed: widget.isLoading ? null : widget.onLoginPressed,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue.shade800,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: widget.isLoading
                  ? const SizedBox(
                      height: 24,
                      width: 24,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : const Text(
                      'MASUK',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
            ),
            const SizedBox(height: 20.0),

            // --- Message Display ---
            Text(
              widget.message,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: widget.message.contains('Berhasil') ? Colors.green : Colors.red,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
