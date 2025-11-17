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
        simpantransaksimutasiitem();
    }
});
let daftarkeranjang = "";
var stokmutasi = [];
var totalbarangg = 0;
function loadKeranjangMutasiLocal() {
    let data = JSON.parse(localStorage.getItem('keranjangTransaksiMutasi')) || [];
    if ($.fn.DataTable.isDataTable('#keranjangmutasi')) {
        $('#keranjangmutasi').DataTable().clear().destroy();
    }
    daftarkeranjang = $('#keranjangmutasi').DataTable({
        language: { url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"},
        scrollY: "100vh",
        keys: true,
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        ordering: false,
        data: data,
        columns: [
            { 
                data: null, 
                title: "Aksi",
                render: function(data, type, row, meta) {
                    return `
                        <button 
                            class="btn btn-danger" 
                            onclick="hapusperbarang('${row.KODEBARANG}', '${row.NAMABARANG}', '${row.AI || ''}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                }
            },
            { 
                data: "KODEBARANG", 
                title: "Kode Barang",
                render: function(data, type, row) {
                    return `<input readonly id="kodeitem${row.KODEBARANG}" type="text" value="${data}" class="form-control-plaintext">`;
                }
            },
            { 
                data: "NAMABARANG", 
                title: "Nama Barang",
                render: function(data, type, row) {
                    return `<input readonly id="namabarang${row.KODEBARANG}" type="text" value="${data}" class="form-control-plaintext">`;
                }
            },
            { 
                data: "UNIT", 
                title: "Unit",
                render: (data, type, row) => `<input readonly id="unit${row.KODEBARANG}" type="text" value="${data}" class="form-control-plaintext">`
            },
            { 
                data: "STOKAWAL", 
                title: "Stok Awal",
                render: (data, type, row) => `<input readonly id="stokawal${row.KODEBARANG}" type="text" value="${data}" class="form-control-plaintext">`
            },
            { 
                data: "STOKMUTASI", 
                title: "Stok Mutasi",
                render: function(data, type, row, meta) {
                    return `<input onkeyup="updatekeranjangmutasi('${meta.row}')" id="stokmutasi${row.KODEBARANG}${meta.row}" type="text" value="${data}" class="form-control">`;
                }
            },
            { 
                data: "NOMINAL", 
                title: "Nominal",
                render: (data, type, row) => `<input readonly id="nominal${row.KODEBARANG}" type="text" value="${data}" class="form-control-plaintext">`
            },
            { 
                data: "ASALOUTLET", 
                title: "Outlet Asal",
                render: (data, type, row) => `<input readonly id="asaloutlet${row.KODEBARANG}" type="text" value="${data}" class="form-control-plaintext">`
            },
            { 
                data: "TUJUANOUTLET", 
                title: "Outlet Tujuan",
                render: (data, type, row) => `<input readonly id="tujuanoutlet${row.KODEBARANG}" type="text" value="${data}" class="form-control-plaintext">`
            },
            { 
                data: "ASALLOKASIITEM", 
                title: "Lokasi Asal",
                render: (data, type, row) => `<input readonly id="asallokasi${row.KODEBARANG}" type="text" value="${data}" class="form-control-plaintext">`
            },
            { 
                data: "TUJUANLOKASIITEM", 
                title: "Lokasi Tujuan",
                render: (data, type, row) => `<input readonly id="tujuanlokasi${row.KODEBARANG}" type="text" value="${data}" class="form-control-plaintext">`
            }
        ],
        drawCallback: function () {
            let data = daftarkeranjang.rows().data();
            data.each(function (value, index) {
                const inputId = daftarkeranjang.cell(index, 5).nodes().to$().find('input').prop('id');
                if (inputId && !AutoNumeric.getAutoNumericElement("#" + inputId)) {
                    stokmutasi[index] = new AutoNumeric("#" + inputId, {
                        decimalCharacter: ',',
                        digitGroupSeparator: '.',
                    });
                }
            });
        },
    })
    .on('key-focus', function (e, datatable, cell, originalEvent) {
        $('input', cell.node()).focus();
    })
    .on("focus", "td input", function(){
        $(this).select();
    });

    daftarkeranjang.on('key', function (e, dt, code) {
        if (code === 13) {
            daftarkeranjang.keys.move('down');
        }
    });
}
$(document).ready(function () {
loadnotranskasi()
$('#tanggaltransaksiopname').val(moment().format('DD-MM-YYYY'));
$("#tanggaltransaksiopname").datepicker({todayHighlight: true,format:'dd-mm-yyyy',orientation: "bottom",});
loadKeranjangMutasiLocal();
$('#cmblokasioutletasal').select2({
    allowClear: true,
    placeholder: 'Tentukan Asal Outlet ?',
    ajax: {
        url: baseurljavascript + 'auth/outlet',
        method: 'POST',
        dataType: 'json',
        delay: 500,
        data: function (params) {
            return {
                KATAKUNCIPENCARIAN: "",
                KODEUNIKMEMBER: session_kodeunikmember,
            }
        },
        processResults: function (data) {
            parseJSON = JSON.parse(data);
            return {
                results: $.map(parseJSON, function (item) {
                    return {
                        text: "OUTLET : " + item.group+" ["+item.namaoutlet+"] ",
                        id: item.group,
                    }
                })
            }
        },
        error: function(xhr, status, error) {
            toastr["error"](xhr.responseJSON.message);
        }

    },
});
const option = new Option('OUTLET : GDPST [Kotak Cantik Store]', 'GDPST', true, true);
$('#cmblokasioutletasal').append(option).trigger('change');
$('#cmblokasioutlettujuan').select2({
    allowClear: true,
    placeholder: 'Tentukan Tujuan Outlet ?',
    ajax: {
        url: baseurljavascript + 'auth/outlet',
        method: 'POST',
        dataType: 'json',
        delay: 500,
        data: function (params) {
            return {
                KATAKUNCIPENCARIAN: (typeof params.term === "undefined" ? "" : params.term),
                KODEUNIKMEMBER: session_kodeunikmember,
            }
        },
        processResults: function (data) {
            parseJSON = JSON.parse(data);
            return {
                results: $.map(parseJSON, function (item) {
                    return {
                        text: "OUTLET : " + item.group+" ["+item.namaoutlet+"] ",
                        id: item.group,
                    }
                })
            }
        },
        error: function(xhr, status, error) {
            toastr["error"](xhr.responseJSON.message);
        }
    },
});
const optiontujuan = new Option('OUTLET : GDPST [Kotak Cantik Store]', 'GDPST', true, true);
$('#cmblokasioutlettujuan').append(optiontujuan).trigger('change');
});
function loadnotranskasi(){
    $.ajax({
        url: baseurljavascript + 'penjualan/notamenupenjualan',
        method: 'POST',
        dataType: 'json',
        data: {
            AWALANOTA : "MT",
            OUTLET: session_outlet,
            KODEKUMPUTERLOKAL: localStorage.getItem("KODEKASA"),
            TANGGALSEKARANG: moment().format('YYYYMMDD'),
            KODEUNIKMEMBER: session_kodeunikmember,
        },
        success: function (response) {
            $('#notrxmutasi').val(response.nomornota);
        }
    });
}
function panggilinformasibarangmutasi(){
    let stokawalmutasi = 0;
    if ($("#cmblokasioutletasal").val() == null || $("#cmblokasioutlettujuan").val() == null){
        return Swal.fire(
            'Penentuan Informasi Mutasi!',
            'Silahkan tentukan ASAL outlet dan lokasi stok sebelum dimasukkan keranjang',
            'warning'
        ) 
    }
    $.ajax({
        url: baseurljavascript + 'pembelian/pilihbarangpembelian',
        method: 'POST',
        dataType: 'json',
        data: {
            KATAKUNCI : $('#katakuncipencariankasir').val(),
        },
        success: function (response) {
            if(response[0].success == "true"){
                if (response[0].totaldata > 1){
                    setTimeout(function () { 
                        $("#daftaritem_katakunci_panggil").focus();
                        $("#daftaritem_katakunci_panggil").val($('#katakuncipencariankasir').val());
                        $('#keranjangmutasi').DataTable().ajax.reload();
                    }, 1000);
                    $("#modal6").modal('show');
                }else{
                    if ($("#lokasiitemasal").val() == "D"){
                        stokawalmutasi = response[0].dataquery[0].DISPLAY;
                    }else if ($("#lokasiitemasal").val() == "G"){
                        stokawalmutasi = response[0].dataquery[0].GUDANG;
                    }else if ($("#lokasiitemasal").val() == "R"){
                        stokawalmutasi = response[0].dataquery[0].RETUR;
                    }
                    tambahkeranjangmutasi(
                        $('#notrxmutasi').val(),
                        response[0].dataquery[0].BARANG_ID,
                        response[0].dataquery[0].NAMABARANG,
                        response[0].dataquery[0].SATUAN,
                        stokawalmutasi,
                        $("#qtykeluarkasir").val(),
                        response[0].dataquery[0].HARGABELI,
                        $("#cmblokasioutletasal").val(),
                        $("#cmblokasioutlettujuan").val(),
                        $("#lokasiitemasal").val(),
                        $("#lokasiitemtujuan").val(),
                        session_outlet,
                        session_kodeunikmember,
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
}
function tambahkeranjangmutasi(NOMORMUTASI, KODEBARANG, NAMABARANG, UNIT, STOKAWAL, STOKMUTASI,NOMINAL, ASALOUTLET, TUJUANOUTLET, ASALLOKASIITEM, TUJUANLOKASIITEM,OUTLET, KODEUNIKMEMBER) {
try {
    let keranjang = JSON.parse(localStorage.getItem('keranjangTransaksiMutasi')) || [];
    let existingIndex = keranjang.findIndex(item =>
      item.KODEBARANG === KODEBARANG && item.NOMORMUTASI === NOMORMUTASI
    );
    if (existingIndex >= 0) {
        keranjang[existingIndex].STOKMUTASI = parseFloat(keranjang[existingIndex].STOKMUTASI) + parseFloat(STOKMUTASI);
        keranjang[existingIndex].NOMINAL = parseFloat(keranjang[existingIndex].NOMINAL) + parseFloat(NOMINAL);
    } else {
        keranjang.push({
            NOMORMUTASI,
            KODEBARANG,
            NAMABARANG,
            UNIT,
            STOKAWAL,
            STOKMUTASI,
            NOMINAL,
            ASALOUTLET,
            TUJUANOUTLET,
            ASALLOKASIITEM,
            TUJUANLOKASIITEM,
            OUTLET,
            KODEUNIKMEMBER
        });
    }
    localStorage.setItem('keranjangTransaksiMutasi', JSON.stringify(keranjang));
    $('#katakuncipencariankasir').val('');
    $('#qtypemasukan').val('1');
    refreshKeranjangMutasi();
} catch (err) {
    Swal.fire({
      title: "Gagal Menyimpan!",
      text: "Terjadi kesalahan saat menyimpan data ke local storage.",
      icon: "error"
    });
  }
}
function refreshKeranjangMutasi() {
    const dataLocal = JSON.parse(localStorage.getItem('keranjangTransaksiMutasi')) || [];
    const table = $('#keranjangmutasi').DataTable();
    table.clear();
    table.rows.add(dataLocal);
    table.draw(false);
}
function hapusperbarang(kodebarang,namabarang,ai){
    swal.fire({
        title: "Apakah Yakin ?",
        text: "Apakah yakin ingin menghapus barang "+namabarang+" pada keranjang ini.",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText: "Oke, Hapus Ini!",
        cancelButtonText: "Gak Jadi Ah!",
    }).then(function(result){
        if(result.isConfirmed){
            let keranjang = JSON.parse(localStorage.getItem('keranjangTransaksiMutasi')) || [];
            let index = keranjang.findIndex(item => 
                item.KODEBARANG === kodebarang || item.AI === ai
            );
            if (index >= 0) {
                keranjang.splice(index, 1);
                localStorage.setItem('keranjangTransaksiMutasi', JSON.stringify(keranjang));
                refreshKeranjangMutasi();
                Swal.fire({
                    title: "Terhapus!",
                    text: namabarang + " berhasil dihapus dari keranjang.",
                    icon: "success",
                    timer: 800,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: "Barang Tidak Ditemukan!",
                    text: "Data tidak ditemukan di local storage.",
                    icon: "warning",
                });
            }
        }
    });
}
function kosongkankeranjanglokal(){
    localStorage.removeItem('keranjangTransaksiMutasi');
    $('#katakuncibarang').val('');
    $('#qtypemasukan').val('1');
    if ($.fn.DataTable.isDataTable('#keranjangmutasi')) {
        let table = $('#keranjangmutasi').DataTable();
        table.clear().draw();
    }
    Swal.fire({
        title: "Berhasil!",
        text: "Keranjang mutasi item telah dikosongkan.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
    });
}
$("#bersihkanform").on("click", function () {
    swal.fire({
        title: "Apakah Yakin ?",
        text: "Apakah yakin ingin menghapus seluruh pada keranjang mutasi ini ?. Jika anda ingin mensegarkan tampilan ini silahkan tekan F5",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText: "Oke, Hapus Ini!",
        cancelButtonText: "Gak Jadi Ah!",
    }).then(function(result){
        if(result.isConfirmed){
            kosongkankeranjanglokal()
        }
    })
});
function simpantransaksimutasiitem(){
if (daftarkeranjang.rows().count() <= 0){
    return swal.fire({
        title: "Ooops.... Yakin ?",
        text: "Anda masih belum memilih satupun item yang akan dimutasi. Silahkan pilih minimal 1 barang untuk dimutasi ke tujuan",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText: "Oke, Paham!",
        cancelButtonText: "Yupss.. Maaf!",
    })
}
swal.fire({
    title: "Transaksi Mutasi Ke Tujuan",
    text: "Apakah anda yakin untuk memutasi informasi item yang ada di keranjang diatas ? Mutasi tidak dapat dihapus atau diubah jika sudah di transaksi demi keamanan data",
    icon:"question",
    showCancelButton:true,
    confirmButtonText: "Oke, Cus Mutasikan!",
    cancelButtonText: "Gak Jadi Ah!",
}).then(function(result){
    if(result.isConfirmed){           
        let arraydetailmutasi = [];
        let keranjang = JSON.parse(localStorage.getItem('keranjangTransaksiMutasi')) || [];
        keranjang.forEach((item) => {
            let temp = [
                '',
                $('#notrxmutasi').val(),
                item.KODEBARANG,
                item.NAMABARANG,
                item.UNIT,
                item.STOKAWAL,
                item.STOKMUTASI,
                item.NOMINAL,
                item.ASALOUTLET,
                item.TUJUANOUTLET,
                item.ASALLOKASIITEM,
                item.TUJUANLOKASIITEM,
                item.OUTLET,
                item.KODEUNIKMEMBER
            ];
            arraydetailmutasi.push(temp);
        });
        $.ajax({
            url: baseurljavascript + 'penyesuaian/simpanmutasi',
            method: 'POST',
            dataType: 'json',
            data: {
                DETAILMUTASI: arraydetailmutasi,
                NOMORMUTASI: $('#notrxmutasi').val(),
                TANGGALTRS: $('#tanggaltransaksiopname').val().split("-").reverse().join("-"),
                NOMOR: $('#notrxmutasi').val().split('#')[1],
                KETERANGAN: $('#keteranganmutasi').val(),
            },
            success: function (response) {
                if (response[0].success == "true"){
                    kosongkankeranjanglokal();
                    swal.fire({
                        title: "Transaksi Mutasi Berhasil",
                        text: "Transaksi mutasi berhasil dengan NO NOTA MUTASI : "+$('#notrxmutasi').val()+". Proses mutasi dicatata dalam kartu stok. Silahkan cek kartu stok jika ingin melihat histori mutasi lainnya",
                        icon: 'success',
                        showCancelButton:true,
                        confirmButtonText: "Oke, Lanjut Transaksi!",
                        cancelButtonText: "Tidak, Kembali Ke Daftar!",
                    }).then(function(result){
                        if(result.isConfirmed){           
                            location.href = baseurljavascript+"penyesuaian/formmutasiitem";
                        }else{
                            location.href = baseurljavascript+"penyesuaian/mutasibarang";
                        }
                    })
                }else{
                    Swal.fire({
                        title: "Gagal... Melakukan Transaksi, Silahkan tekan F5",
                        text: response.msg,
                        icon: 'warning',
                    });
                }
            }
        });
    }
})
}
function updatekeranjangmutasi(index){
    let keranjang = JSON.parse(localStorage.getItem('keranjangTransaksiMutasi')) || [];
    let kodeBarang = daftarkeranjang.cell(index, 1).nodes().to$().find('input').val();
    let stoklama = parseFloat(daftarkeranjang.cell(index, 4).nodes().to$().find('input').val());
    let stokBaru = stokmutasi[index].getNumber()
    let existingIndex = keranjang.findIndex(item => item.KODEBARANG === kodeBarang);
    if (stokBaru > stoklama) {
        stokmutasi[index].set(stoklama);
        return Swal.fire({
            title: "Stok Mutasi Melebihi Stok Awal!",
            text: "Stok mutasi tidak boleh melebihi stok awal. Silahkan cek kembali. Stok akan diubah ke STOK MAKSIMAL yaitu " + stoklama,
            icon: "warning",
        });
    }
    if (existingIndex >= 0) {
        keranjang[existingIndex].STOKMUTASI = stokBaru;
        localStorage.setItem('keranjangTransaksiMutasi', JSON.stringify(keranjang));
    } else {
        Swal.fire({
            title: "Barang Tidak Ditemukan!",
            text: "Data tidak ditemukan di keranjang lokal.",
            icon: "warning",
        });
    }
}
function panggilbarangglobal(){
    $("#daftaritem_katakunci_panggil").val($("#katakuncipencariankasir").val());
    if ($("#lokasiitemasal").val() == "D"){
        kondisipilihbarang = "d";
        $('#stokhanyadisplay').prop('checked', true).trigger('change');
    }else if ($("#lokasiitemasal").val() == "G"){
        kondisipilihbarang = "g";
        $('#stokhanyagudang').prop('checked', true).trigger('change');
    }else if ($("#lokasiitemasal").val() == "R"){
        kondisipilihbarang = "r";
        $('#stokhanyaretur').prop('checked', true).trigger('change');
    }
    setTimeout(function () { 
        $('#pangil_daftarabarang').DataTable().ajax.reload();
    }, 500);
    $('#modal6').modal('show');
}
$("#panggilbarangglobalmutasi").on("click", function () {
    panggilbarangglobal();
});
$('#katakuncipencariankasir').keypress(function (e) {
    let key = e.which;
    if (key == 13 && $('#katakuncipencariankasir').val() == "") {
        $('#qtykeluarkasir').focus(); return false;
    } else if (key == 13 && $('#katakuncipencariankasir').val() != "") {
        panggilbarangglobal();
    }
}); 
$('#qtykeluarkasir').keypress(function (e) {let key = e.which; if(key == 13){$('#katakuncipencariankasir').focus();return false;}});
$('#katakuncipencariankasir').keypress(function (e) {let key = e.which; if(key == 13 && $('#katakuncipencariankasir').val() == ""){$('#qtykeluarkasir').focus();return false;}});