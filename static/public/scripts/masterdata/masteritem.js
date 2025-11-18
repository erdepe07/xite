/* algoritma dashboard master item */
function onclickdisableitem(kodeitem, namaitem, kondisiitem) {
    $('#prosesneracasaldo').html('<i class="fa fa-spin fa-spinner"></i> Proses Perhitungan');
    Swal.fire({
        title: kondisiitem == "0" ? "Aktifkan Item" : "Tidak Aktif Item",
        text: kondisiitem == "0" ? "Apakah anda ingin mengaktifkan " + kodeitem + " [" + namaitem + "] ini kembali" : "Apakah anda ingin mengubah " + kodeitem + " [" + namaitem + "] ini menjadi tidak aktif, hal ini menjadikan item ini tidak dapat dicari tetapi dapat muncul di laporan",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: kondisiitem == "0" ? "Aktifkan item sekarang" : "Oke, Jadikan tidak aktif"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: baseurljavascript + 'masterdata/rebuildstok',
                method: 'POST',
                dataType: 'json',
                data: {
                    KONDISI: kondisiitem,
                    KODEITEM: kodeitem,
                    NAMAITEM: namaitem,
                },
                success: function (response) {
                    var obj = $.parseJSON(response);
                    if (obj.status == "true") {
                        $('#masteritem_daftaritem').DataTable().ajax.reload();
                        Swal.fire(
                            'Berhasil.. Horee!',
                            'Informasi perubahan status ' + kodeitem + ' [' + namaitem + '] berhasil diperbarui.',
                            'success'
                        )
                    } else {
                        Swal.fire(
                            'Gagal.. Uhhhhh!',
                            'Informasi gagal di re-build.',
                            'success'
                        )
                    }
                },
                error: function (xhr, status, error) {
                    toastr["error"](xhr.responseJSON.message);
                }
            });
        }
    });
}
/* pecah satuan simpan */
$("#simpanpecahsatuan").on("click", function () {
    if ($('#kodebarangpecahsatuan').val() == "" || $('#potongstokpecahsatuan').val() == "" || $('#konversistokpecahsatuan').val() == "" || $('#hargajualbaru').val() == "" || $('#hppprodukbaru').val() == "") {
        return Swal.fire({
            position: 'bottom-end',
            target: '#modalPecahsatuan',
            icon: 'warning',
            title: 'Pastikan KODEITEM, POTONG & KONVERSI STOK, HARGA JUAL dan HPP sudah diisi',
            showConfirmButton: false,
            toast: true,
            timer: 1500
        })
    }
    Swal.fire({
        title: "Pecaha Satuan Barang " + $('#namabarang').val(),
        target: '#modalPecahsatuan',
        text: "Stok akan ditambahkan ke barang " + $('#namabarangpecahsatuan').val() + " dengan stok sebanyak " + $('#konversistokpecahsatuan').val() + "[" + $('#pilihsatuansatuannya').val() + "]",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oke, Konversi Sekarang!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: baseurljavascript + 'masterdata/tambahpecahstokjax',
                method: 'POST',
                dataType: 'json',
                data: {
                    AI: '',
                    IDBARANGASAL: $('#kodebarang').val(),
                    IDBARANGBARU: $('#kodebarangpecahsatuan').val(),
                    ASALPECAH: $('#potongstokpecahsatuan').val(),
                    MENJADI: $('#konversistokpecahsatuan').val(),
                    HARGAJUAL: $('#hargajualbaru').val(),
                    HARGABELI: $('#hppprodukbaru').val(),
                    OUTLET: session_outlet,
                    KODEUNIKMEMBER: session_kodeunikmember,
                    KASIR: session_namapengguna,
                    NAMABARANGSEBELUM: $('#namabarang').val(),
                    NAMABARANGSESUDAH: $('#namabarangpecahsatuan').val(),
                },
                success: function (response) {
                    if (response.success == "true") {
                        Swal.fire({
                            title: "Berhasil Horeee!!!",
                            target: '#modalPecahsatuan',
                            text: response.msg,
                            icon: 'success',
                        });
                        $('#kodebarangpecahsatuan').val("");
                        $('#namabarangpecahsatuan').val("");
                        $('#potongstokpecahsatuan').val("");
                        $('#konversistokpecahsatuan').val("");
                        $('#hargajualbaru').val("");
                        $('#hppprodukbaru').val("");
                    } else {
                        Swal.fire({
                            title: "Gagal... Uhhh",
                            target: '#modalPecahsatuan',
                            text: response.msg,
                            icon: 'warning',
                        });
                    }
                }
            });
        }
    });
});
$("#statusbarang").click(function () {
    if ($('input[name="rb_statusbarang"]:checked').val() == 1) { statusbarang = 0; } else { statusbarang = 1; }
    $('#masteritem_daftaritem').DataTable().ajax.reload();
});
$('#daftaritem_katakunci').on('input', debounce(function (e) {
    $('#masteritem_daftaritem').DataTable().ajax.reload();
}, 500));
$("#daftaritem_parameterpencarian").change(function () {
    $('#masteritem_daftaritem').DataTable().ajax.reload();
});

$("#bulkinsert").click(function () {
    $('#modalbulkinsert').modal('show');
});
$("#simpanbulk").click(function () {
    let table = $('#bulkinsert_tabel').DataTable(); let numRows = table.rows().count();
    if (numRows == 0) {
        return toastr["error"]("Informasi tabel pada penambahan bulk masih kosong. Silahkan isi tabel minimal 1 informasi");
    }
    Swal.fire({
        title: 'Konfirmasi Tambah Item Bersamaan',
        text: 'Apakah anda yakin dengan semua barang yang berada di keranjang bulk insert ini ? Jika terdapat kesalahan maka anda tinggal menonaktifkan pada daftar item yang tersedia',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Okey docky, Tambahkan',
        cancelButtonText: 'Hmmm.. Gak jadi!',
    }).then((result) => {
        if (result.isConfirmed) {
            let arraymasteritembulk = [];
            let datamasteritembulk = $('#bulkinsert_tabel').DataTable().rows().data();
            datamasteritembulk.each(function (isidatatable, index) {
                var temp = new Array();
                temp.push(
                    datamasteritembulk.cell(index, 1).nodes().to$().find('input').val(),
                    datamasteritembulk.cell(index, 2).nodes().to$().find('input').val(),
                    datamasteritembulk.cell(index, 3).nodes().to$().find('input').val(),
                    datamasteritembulk.cell(index, 4).nodes().to$().find('input').val(),
                    datamasteritembulk.cell(index, 5).nodes().to$().find('input').val(),
                    datamasteritembulk.cell(index, 7).nodes().to$().find('input').val(),
                    datamasteritembulk.cell(index, 11).nodes().to$().find('input').val(),
                    datamasteritembulk.cell(index, 9).nodes().to$().find('input').val(),
                    " ",
                    "0",
                    "0",
                    datamasteritembulk.cell(index, 13).nodes().to$().find('input').val(),
                    "1",
                    session_kodeunikmember,
                    datamasteritembulk.cell(index, 16).nodes().to$().find('input').val() == "true" ? "AKTIF" : "TIDAK AKTIF",
                    datamasteritembulk.cell(index, 18).nodes().to$().find('input').val() == "true" ? "DAPAT MINUS" : "TIDAK DAPAT MINUS",
                    datamasteritembulk.cell(index, 17).nodes().to$().find('input').val() == "true" ? "JASA" : "BUKAN JASA",
                    datamasteritembulk.cell(index, 14).nodes().to$().find('input').val()
                );
                arraymasteritembulk.push(temp)
            });
            $.ajax({
                url: baseurljavascript + 'masterdata/tambahitemajaxbulk',
                method: 'POST',
                dataType: 'json',
                data: {
                    INFORMASIBARANG: arraymasteritembulk,
                    JUMLAHDATA: numRows,
                },
                success: function (response) {
                    var obj = $.parseJSON(response);
                    if (obj.status == "true") {
                        $('#bulkinsert_tabel').dataTable().fnClearTable();
                        Swal.fire(
                            'Berhasil.. Horee!',
                            'Seluruh informasi item pada keranjang sudah ditambahkan pada database. Silahkan cek pada daftar item.',
                            'success'
                        )
                    } else {
                        Swal.fire(
                            'Gagal.. Uhhhhh!',
                            'Informasi berhasil disimpan di database.',
                            'success'
                        )
                    }
                },
                error: function (xhr, status, error) {
                    toastr["error"](xhr.responseJSON.message);
                }
            });
        }
    })
});