class Testing {
  final int id;
  final String kode;
  final String nama;

  Testing({required this.id, required this.kode, required this.nama});

  // Factory baru untuk mengonversi dari JSON (Map<String, dynamic>)
  factory Testing.fromMap(Map<String, dynamic> json) {
    return Testing(
      // Kunci (key) harus sama dengan nama kolom di database
      id: json['id'] as int, 
      kode: json['kode'] as String,
      nama: json['nama'] as String,
    );
  }
}