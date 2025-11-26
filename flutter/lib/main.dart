import 'package:flutter/material.dart';
import 'login_screen.dart'; // Import halaman login

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
      // Set LoginScreen sebagai halaman utama
      home: const LoginScreen(), 
    );
  }
}