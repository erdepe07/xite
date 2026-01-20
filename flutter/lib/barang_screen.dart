import 'package:flutter/material.dart';
import 'package:dio/dio.dart';

class BarangScreen extends StatefulWidget {
  const BarangScreen({super.key});

  @override
  State<BarangScreen> createState() => _BarangScreenState();
}

class _BarangScreenState extends State<BarangScreen> {
  List _listBarang = [];
  bool _isLoading = true;
  final Dio _dio = Dio();

  @override
  void initState() {
    super.initState();
    _fetchBarang();
  }

  Future<void> _fetchBarang() async {
    try {
      // Di Dio, kita langsung mendapatkan objek Map dari response.data
      final response = await _dio.get('http://localhost:3000/api/barang');

      setState(() {
        _listBarang = response.data['data']; // 'data' sesuai field di server.js Anda
        _isLoading = false;
      });
    } catch (e) {
      print("Error fetching barang: $e");
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Master Barang')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _listBarang.length,
              itemBuilder: (context, index) {
                final item = _listBarang[index];
                return ListTile(
                  title: Text(item['NAMA'] ?? '-'),
                  subtitle: Text("Stok: ${item['STOK']}"),
                );
              },
            ),
    );
  }
}