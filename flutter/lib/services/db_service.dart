import 'package:dio/dio.dart';

class AuthService {
  // 1. Inisialisasi Dio dengan BaseOptions
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'http://localhost:3000/api', // Gunakan 10.0.2.2 untuk Emulator Android
      connectTimeout: const Duration(seconds: 5), // Maksimal 5 detik untuk konek
      receiveTimeout: const Duration(seconds: 3), // Maksimal 3 detik untuk terima data
    ),
  );

  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await _dio.post(
        '/login', // Cukup tulis endpoint-nya saja
        data: {
          'username': username,
          'password': password,
        },
      );

      // Dio secara otomatis mengonversi response body ke Map/List
      final data = response.data;

      if (response.statusCode == 200 && data['status'] == 'success') {
        return {
          'success': true,
          'user': data['user'], // Berisi 'nama' dan 'hakAksesId'
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Login Gagal.',
        };
      }
    } on DioException catch (e) {
      // Tangani error berdasarkan tipe DioException
      String msg = 'Gagal terhubung ke server.';
      
      if (e.type == DioExceptionType.connectionTimeout) {
        msg = 'Koneksi lambat, silakan coba lagi.';
      } else if (e.response != null) {
        // Jika server merespon dengan error (401, 500, dsb)
        msg = e.response?.data['message'] ?? 'Kesalahan Server.';
      }

      return {'success': false, 'message': msg};
    } catch (e) {
      return {'success': false, 'message': 'Terjadi kesalahan: $e'};
    }
  }
}