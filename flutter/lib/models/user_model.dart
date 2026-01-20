class User {
  final String username;
  final String nama;
  final String role;

  User({required this.username, required this.nama, required this.role});

  factory User.fromMap(Map<String, dynamic> json) {
    return User(
      username: json['NAMAPENGGUNA'] ?? '',
      nama: json['NAMA'] ?? '',
      role: json['HAKAKSESID'] ?? '',
    );
  }
}