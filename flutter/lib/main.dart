// The original content is temporarily commented out to allow generating a self-contained demo - feel free to uncomment later.

import 'package:flutter/material.dart';
import 'login_screen.dart'; // Import halaman login
import 'package:flut/src/rust/api/simple.dart';
import 'package:flut/src/rust/frb_generated.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aplikasi Ramin',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // Set LoginoScreen sebagai halaman utama
      home: const LoginScreen(),
    );
  }
}

// import 'package:flutter/material.dart';
// import 'package:flut/src/rust/api/simple.dart';
// import 'package:flut/src/rust/frb_generated.dart';
//
// Future<void> main() async {
//   await RustLib.init();
//   runApp(const MyApp());
// }
//
// class MyApp extends StatelessWidget {
//   const MyApp({super.key});
//
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       home: Scaffold(
//         appBar: AppBar(title: const Text('flutter_rust_bridge quickstart')),
//         body: Center(
//           child: Text(
//             'Action: Call Rust `greet("Tom")`\nResult: `${greet(name: "Tom")}`',
//           ),
//         ),
//       ),
//     );
//   }
// }
