import 'package:dio/dio.dart';

const String API_BASE_URL = 'http://localhost:3000/api';

class AuthService {
  // Ubah nama class menjadi AuthService
  final Dio _dio = Dio();

  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await _dio.post(
        '$API_BASE_URL/login',
        data: {'username': username, 'password': password},
      );

      // Jika server merespon 200 (OK)
      if (response.statusCode == 200 && response.data['status'] == 'success') {
        return {
          'success': true,
          'user':
              response.data['user'], // Data pengguna yang kembali dari server
        };
      } else {
        // Jika server merespon 401 atau 500
        return {
          'success': false,
          'message': response.data['message'] ?? 'Login Gagal.',
        };
      }
    } on DioException catch (e) {
      // Tangani error jaringan atau server
      String msg = 'Gagal terhubung ke API. Pastikan node server.js berjalan.';
      if (e.response != null && e.response!.data != null) {
        msg = e.response!.data['message'] ?? msg;
      }
      return {'success': false, 'message': msg};
    } catch (e) {
      return {
        'success': false,
        'message': 'Terjadi kesalahan tidak terduga: $e',
      };
    }
  }
}
