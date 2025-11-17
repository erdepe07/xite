document.addEventListener('mousedown', function(event) { if (event.detail > 1) { event.preventDefault(); } }, false);
document.addEventListener("keydown", function(e) {
    if (e.key === "F1") {
        e.preventDefault();
        setTimeout(function () { 
            $("#daftaritem_katakunci_panggil").focus();
        }, 1000);
        $('#modal6').modal('show');
    }else if (e.key === "F5") {
        e.preventDefault();
        swal.fire({
            title: "Halaman akan disegarkan [resfresh] ?",
            text: "Apakah anda ingin mensegarkan [refresh] halaman ini. Pastikan anda menyimpan pekerjaan sebelumnya dikarenakan progress akan tereset",
            icon:"warning",
            showCancelButton:true,
            confirmButtonText: "Oke, Segarkan [Refresh] Halaman Ini!",
            cancelButtonText: "Gak Jadi Ah!",
        }).then(function(result){
            if(result.isConfirmed){
                window.location.reload();
            }
        })
    }else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        simpantransaksiopname();
    }
});
function loadnotranskasi(){
    getCsrfTokenCallback(function() {
        $.ajax({
            url: baseurljavascript + 'penjualan/notamenupenjualan',
            method: 'POST',
            dataType: 'json',
            data: {
                [csrfName]:csrfTokenGlobal,
                AWALANOTA : "OP",
                OUTLET: session_outlet,
                KODEKUMPUTERLOKAL: localStorage.getItem("KODEKASA"),
                TANGGALSEKARANG: moment().format('YYYYMMDD'),
                KODEUNIKMEMBER: session_kodeunikmember,
            },
            success: function (response) {
                $('#notransaksiopname').val(response.nomornota);
            }
        });
    });
}
function panggilinformasibarang(){
    getCsrfTokenCallback(function() {
        $.ajax({
            url: baseurljavascript + 'pembelian/pilihbarangpembelian',
            method: 'POST',
            dataType: 'json',
            data: {
                [csrfName]:csrfTokenGlobal,
                KATAKUNCI : $('#katakuncipencariankasir').val(),
            },
            success: function (response) {
                if(response[0].success == "true"){
                    if (response[0].totaldata > 1){
                        setTimeout(function () { 
                            $("#daftaritem_katakunci_panggil").focus();
                            $("#daftaritem_katakunci_panggil").val($('#katakuncibarang').val());
                            $('#pangil_daftarabarang').DataTable().ajax.reload();
                        }, 500);
                        $("#modal6").modal('show');
                    }else{
                        tambahkeranjang(
                            response[0].dataquery[0].BARANG_ID,
                            response[0].dataquery[0].NAMABARANG,
                            $("#lokasioutlet").val(),
                            $("#lokasioutlet").val() == "D" ? response[0].dataquery[0].DISPLAY : response[0].dataquery[0].GUDANG,
                            $("#qtykeluarkasir").val(),
                            $("#kondisipenyesuaian").val(),
                            session_outlet,
                            session_kodeunikmember,
                            response[0].dataquery[0].HARGABELI,
                            ""
                        );
                    }
                }else{
                    Swal.fire({
                        title: "Informasi Tidak Ditemukan",
                        text: "Waduh... Loo Loo Loo informasi yang anda masukan sama sekali tidak ditemukakn di database kami. Silahkan cek kembali",
                        icon: 'warning',
                    }); 
                }
            }
        });
    });
}
function tambahItemOpname(item) {
    let daftarStok = JSON.parse(localStorage.getItem('daftarStokOpname')) || [];
    const index = daftarStok.findIndex(i => i.KODEBARANG === item.KODEBARANG && i.OUTLET === item.OUTLET && i.KODEUNIKMEMBER === item.KODEUNIKMEMBER);

    if (index > -1) {
        // Update stok opname & info jika sudah ada
        daftarStok[index] = { ...daftarStok[index], ...item };
    } else {
        daftarStok.push(item);
    }

    localStorage.setItem('daftarStokOpname', JSON.stringify(daftarStok));
}

// 2. Ambil semua item dari localStorage
function getDaftarStokOpname() {
    return JSON.parse(localStorage.getItem('daftarStokOpname')) || [];
}
// Fungsi hitung total plus/minus dan total barang
function hitungTotal() {
    const daftarStok = getDaftarStokOpname();
    let totalminus = 0, totalsurplus = 0, totalbarang = 0;

    $('#keranjangopname tbody tr').each(function(index, row) {
        const stokKomputer = AutoNumeric.getAutoNumericElement($(row).find('.stok-komputer')[0])?.getNumber() || 0;
        const stokFisik = AutoNumeric.getAutoNumericElement($(row).find('.stok-fisik')[0])?.getNumber() || 0;
        const harga = AutoNumeric.getAutoNumericElement($(row).find('.harga-item')[0])?.getNumber() || 0;

        const selisih = stokKomputer - stokFisik;
        if (selisih > 0) {
            totalminus += (harga * selisih) * -1;
        } else if (selisih < 0) {
            totalsurplus += (harga * selisih) * -1;
        }

        totalbarang += stokFisik;
    });

    // Update DOM
    $('#totalminus').html(formatuang(Math.abs(totalminus), 'id-ID', 'IDR'));
    $('#totalplus').html(formatuang(Math.abs(totalsurplus), 'id-ID', 'IDR'));
    $('#totalnominal').html(formatuang(totalsurplus + totalminus, 'id-ID', 'IDR'));
}

// Event listener untuk input berubah
function attachInputEvents() {
    $('#keranjangopname tbody').off('input').on('input', '.stok-komputer, .stok-fisik, .harga-item', function() {
        // Simpan perubahan ke localStorage
        const row = $(this).closest('tr');
        const index = row.index();
        let daftarStok = getDaftarStokOpname();

        daftarStok[index].STOKKOMPUTER = AutoNumeric.getAutoNumericElement(row.find('.stok-komputer')[0]).getNumber();
        daftarStok[index].STOKOPNAME = AutoNumeric.getAutoNumericElement(row.find('.stok-fisik')[0]).getNumber();
        daftarStok[index].HPP = AutoNumeric.getAutoNumericElement(row.find('.harga-item')[0]).getNumber();

        localStorage.setItem('daftarStokOpname', JSON.stringify(daftarStok));

        // Hitung ulang total
        hitungTotal();
    });
}

function renderKeranjangOpname() {
    const daftarStok = getDaftarStokOpname();

    // Hapus DataTable lama jika ada
    if ($.fn.DataTable.isDataTable('#keranjangopname')) {
        $('#keranjangopname').DataTable().destroy();
        $('#keranjangopname tbody').empty();
    }

    // Array global untuk AutoNumeric
    window.anstokkom = [];
    window.anstokfiskik = [];
    window.anharga = [];

    const daftarkeranjang = $('#keranjangopname').DataTable({
        language: {"url":"https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"},
        scrollY: "60vh",
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        ordering: false,
        data: daftarStok,
        keys: true,
        columns: [
            { 
                data: null, 
                title: 'Aksi',
                render: function(data, type, row, meta) {
                    return `<button class="hapus-item btn btn-danger" data-index="${meta.row}"><i class="fa fa-trash"></i></button>`;
                }
            },
            { data: 'KODEBARANG', title: 'Kode Item' },
            { data: 'NAMABARANG', title: 'Nama Barang' },
            { data: 'LOKASIOPNAME', title: 'Lokasi'},
            { 
                data: 'STOKKOMPUTER', 
                title: 'Stok Digital', 
                render: function(d, type, row, meta) { 
                    return `<input type="text" id="stokkom-${meta.row}" class="stok-komputer form-control" value="${d}">`; 
                } 
            },
            { 
                data: 'STOKOPNAME', 
                title: 'Stok Fisik', 
                render: function(d, type, row, meta) { 
                    return `<input type="text" id="stokfisik-${meta.row}" class="stok-fisik form-control" value="${d}">`; 
                } 
            },
            { data: 'KONDISIOPNAME', title: 'Kondisi' },
            { 
                data: 'HPP', 
                title: 'Harga', 
                render: function(d, type, row, meta) { 
                    return `<input type="text" id="harga-${meta.row}" class="harga-item form-control text-right" value="${d}">`; 
                } 
            },
            { data: 'INFORMASI', title: 'Keterangan', render: function(d){ return `<input type="text" class="informasi-item form-control" value="${d}">`; } }
        ],
        drawCallback: function() {
            const data = daftarkeranjang.rows().data();
            data.each(function(value, index) {
                // Inisialisasi AutoNumeric untuk setiap input
                if (!AutoNumeric.getAutoNumericElement(`#stokkom-${index}`)) {
                    anstokkom[index] = new AutoNumeric(`#stokkom-${index}`, {decimalCharacter: ',', digitGroupSeparator: '.'});
                }
                if (!AutoNumeric.getAutoNumericElement(`#stokfisik-${index}`)) {
                    anstokfiskik[index] = new AutoNumeric(`#stokfisik-${index}`, {decimalCharacter: ',', digitGroupSeparator: '.'});
                }
                if (!AutoNumeric.getAutoNumericElement(`#harga-${index}`)) {
                    anharga[index] = new AutoNumeric(`#harga-${index}`, {decimalCharacter: ',', digitGroupSeparator: '.'});
                }
            });
        },
        initComplete: function(settings, json) {
            const data = daftarkeranjang.rows().data();
            let totalopname = 0, totalminus = 0, totalsurplus = 0, totalbarang = 0;

            data.each(function(value, index) {
                const selisih = anstokkom[index].getNumber() - anstokfiskik[index].getNumber();
                if (selisih > 0){
                    totalminus += (anharga[index].getNumber() * selisih) * -1;
                } else if (selisih < 0){
                    totalsurplus += (anharga[index].getNumber() * selisih) * -1;
                }
                totalbarang += anstokfiskik[index].getNumber();
            });

            $('#totalminus').html(formatuang(totalminus, 'id-ID', 'IDR').replaceAll('-', '').trim());
            $('#totalplus').html(formatuang(totalsurplus, 'id-ID', 'IDR').replaceAll('-', '').trim());
            $('#totalnominal').html(formatuang(totalsurplus + totalminus, 'id-ID', 'IDR'));
        }
    });

    // Fokus otomatis saat klik input
    daftarkeranjang.on('key-focus', function (e, datatable, cell, originalEvent) {
        $('input', cell.node()).focus();
    }).on('focus', 'td input', function() {
        $(this).select();
    });

    // Tangani Enter untuk pindah ke baris bawah
    daftarkeranjang.on('key', function(e, dt, key, cell, originalEvent) {
        if (key === 13) { // Enter
            dt.keys.move('down');
        }
    });

    // Event hapus item
    $('#keranjangopname tbody').off('click').on('click', '.hapus-item', function(){
        const index = $(this).data('index');
        let data = getDaftarStokOpname();
        data.splice(index, 1);
        localStorage.setItem('daftarStokOpname', JSON.stringify(data));
        renderKeranjangOpname(); // reload table
    });
}


function tambahkeranjang(KODEBARANG,NAMABARANG,LOKASIOPNAME,STOKKOMPUTER,STOKOPNAME,KONDISIOPNAME,OUTLET,KODEUNIKMEMBER,HPP,INFORMASI){
    const item = { KODEBARANG, NAMABARANG, LOKASIOPNAME, STOKKOMPUTER, STOKOPNAME, KONDISIOPNAME, OUTLET, KODEUNIKMEMBER, HPP, INFORMASI };
    tambahItemOpname(item);
    renderKeranjangOpname();
    $('#katakuncipencariankasir').val('');
    $('#qtykeluarkasir').val('1');
}

var catchEnter = debounce(function(index) {
    hitungkeranjangbeli(index)
}, 500);
function hapusperbarang(kodebarang,namabarang){
    swal.fire({
        title: "Apakah Yakin ?",
        text: "Apakah yakin ingin menghapus barang "+namabarang+" pada keranjang ini.",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText: "Oke, Hapus Ini!",
        cancelButtonText: "Gak Jadi Ah!",
    }).then(function(result){
        if(result.isConfirmed){
            getCsrfTokenCallback(function() {
                $.ajax({
                    url: baseurljavascript + 'penyesuaian/hapusperbarang',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        [csrfName]:csrfTokenGlobal,
                        KODEBARANG: kodebarang,
                    },
                    success: function (response) {
                        var obj = JSON.parse(response);
                        if (obj.status == "true"){
                            $('#keranjangopname').DataTable().ajax.reload();
                        }else{
                            Swal.fire({
                                title: "Gagal... Cek Koneksi Local DB Kasir",
                                text: "Silahkan Hubungi Teknisi Untuk Permasalahan Ini",
                                icon: 'warning',
                            });
                        }
                    }
                });
            });
        }
    })
}
function ajaxkosongkan(){
    localStorage.removeItem('daftarStokOpname');
    if ($.fn.DataTable.isDataTable('#keranjangopname')) {
        const table = $('#keranjangopname').DataTable();
        table.clear().draw();
    }
    $('#totalminus').html('0');
    $('#totalplus').html('0');
    $('#totalnominal').html('0');
}
function hapuskeranjang(){
    swal.fire({
        title: "Apakah Yakin ?",
        text: "Apakah yakin ingin membersihkan keranjang sementara opname ini. Jika terhapus maka anda harus mengulang dari barang awal lagi",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText: "Oke, Bersihkan Dong!",
        cancelButtonText: "Gak Jadi Ah!",
    }).then(function(result){
        if(result.isConfirmed){
            ajaxkosongkan();
        }
    })
}
function simpantransaksiopname(){
    hitungTotal();
    swal.fire({
        title: "Apakah Yakin ?",
        text: "Stok akan diubah sesuai dengan kondisi dan lokasi outlet yang anda pilih sebelum memasukkan keranjang. Penyesuaian stok yang terproses tidak dapat diubah tetapi dapat dihapus",
        icon:"question",
        showCancelButton:true,
        confirmButtonText: "Siap, Transaksikan!",
        cancelButtonText: "Batalkan Aksi!",
    }).then(function(result){
        if(result.isConfirmed){
            let arraydetailpenyesuaian = [];
            let daftarkeranjang = JSON.parse(localStorage.getItem('daftarStokOpname')) || [];
            daftarkeranjang.forEach(function(item, index) {
                const temp = [
                    item.KODEBARANG,
                    item.NAMABARANG,
                    item.LOKASIOPNAME,
                    anstokkom[index].getNumber(),
                    anstokfiskik[index].getNumber(),
                    item.KONDISIOPNAME,
                    session_outlet,
                    session_kodeunikmember,
                    anharga[index].getNumber(),
                    item.INFORMASI || ""
                ];
                arraydetailpenyesuaian.push(temp);
            });

            $.ajax({
                url: baseurljavascript + 'penyesuaian/simpantransaksiopname',
                method: 'POST',
                dataType: 'json',
                data: {
                    DETAILOPNAME :arraydetailpenyesuaian,
                    NOTAOPNAME : $('#notransaksiopname').val(),
                    TOTALBARANG : arraydetailpenyesuaian.length,
                    TOTALSURPLUS :  $('#totalplus').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim(),
                    TOTALMINUS :  $('#totalminus').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim(),
                    TOTALOPANAME :  $('#totalnominal').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim(),
                    NOMOR : $('#notransaksiopname').val().split('#')[1],
                    KETERANGAN : $('#keteranganopname').val(),
                    TANGGALTRS : $("#tanggaltransaksiopname").val().split("-").reverse().join("-"),
                },
                success: function (response) {
                    ajaxkosongkan();
                    if (response[0].success){
                        swal.fire({
                            title: "Apakah Yakin ?",
                            text: response[0].msg,
                            icon:"success",
                            showCancelButton:true,
                            confirmButtonText: "Lanjutkan Opanem Lagi!",
                            cancelButtonText: "Kembali Ke Daftar!",
                        }).then(function(result){
                            if(result.isConfirmed){           
                                location.href = baseurljavascript+"penyesuaian/formpenyesuianstok";
                            }else{
                                location.href = baseurljavascript+"penyesuaian/stokopname";
                            }
                        })
                    }else{
                        Swal.fire(
                            'Gagal Dalam Transaksi Alias Error!',
                            response[0].msg,
                            'warning'
                        ) 
                    }
                }
            });
        }
    })
}

$('#katakuncipencariankasir').keypress(function (e) {
    let key = e.which;
    if (key == 13 && $('#katakuncipencariankasir').val() == "") {
        $('#qtykeluarkasir').focus(); return false;
    } else if (key == 13 && $('#katakuncipencariankasir').val() != "") {
        panggilbarangglobal();
    }
}); 
function panggilbarangglobal(){
    $("#daftaritem_katakunci_panggil").val($("#katakuncipencariankasir").val());
     kondisipilihbarang = "d";
    $('#stokhanyadisplay').prop('checked', true).trigger('change');
    setTimeout(function () { 
        $('#pangil_daftarabarang').DataTable().ajax.reload();
    }, 500);
    $('#modal6').modal('show');
}
$("#panggilbarangglobalpenyesuaian").on("click", function () {
    panggilbarangglobal();
});
