let keranjangarray = [],inforkartubarang = []
let timenow = moment().format('HH:mm:ss');
let indexsubarray = 0
let formatter = new Intl.NumberFormat('id-ID', {style: 'currency',currency: 'IDR',});
let hasilsubtotalkasir = 0;hasilhargabaru = 0;
let socketIo = io(baseurlsocket);
socketIo.on("connect", () => { console.log(socketIo.id); });
/*global listener browser keybind*/
function launchFullscreen(element) {
    var docElm = element;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    }
}

document.addEventListener('mousedown', function(event) { if (event.detail > 1) { event.preventDefault(); } }, false);
document.addEventListener("keydown", function(e) {
    if($('#modalkonfirmasipembayaran').hasClass('show') && (e.key == "F1")) {
        e.preventDefault();
        $("#tunai").prop("checked", true);
        $("#tunai").trigger("change");
    }else if($('#modalkonfirmasipembayaran').hasClass('show') && (e.key == "F2")) {
        e.preventDefault();
        $("#kredit").prop("checked", true);
        $("#kredit").trigger("change");
    }else if($('#modalkonfirmasipembayaran').hasClass('show') && (e.key == "F3")) {
        e.preventDefault();
        $("#kartu").prop("checked", true);
        $("#kartu").trigger("change");
    }else if($('#modalkonfirmasipembayaran').hasClass('show') && (e.key == "F4")) {
        e.preventDefault();
        $("#splitcash").prop("checked", true);
        $("#splitcash").trigger("change");
    }else if($('#modalkonfirmasipembayaran').hasClass('show') && (e.key == "F6")) {
        e.preventDefault();
        $("#qris").prop("checked", true);
        $("#qris").trigger("change");
    }else if($('#modalkonfirmasipembayaran').hasClass('show') && (e.key == "End")) {
        simpantransaksi();
    }
    if (e.key === "F9") {
        e.preventDefault();
        $('#katakuncipencariankasir').focus();
    }else if (e.key === "F8" || (e.ctrlKey && e.key === "s")) {
        e.preventDefault();
        cekkeranjang();
    }else if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        simpantransaksipending();
    }else if (e.key === "F1" && !$('#modalkonfirmasipembayaran').hasClass('show')) {
        e.preventDefault();
        panggilsalesman();
        $("#salesmandikasir").modal('show');
    }else if (e.key === "F2" && !$('#modalkonfirmasipembayaran').hasClass('show')) {
        e.preventDefault();
        panggilmemberkasir();
        $("#memberdikasir").modal('show');
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
    }else if (e.key === "F6" && !$('#modalkonfirmasipembayaran').hasClass('show')) {
        e.preventDefault();
        daftarpenjualan();
        $("#daftarpenjualan").modal('show');
    }else if (e.key === "F7" && !$('#modalkonfirmasipembayaran').hasClass('show')) {
        e.preventDefault();
        daftarnotapending();
    }
});
async function initializeDataTables() {
    try {
        let tokenarr = "";
        const promises = [
            initializeFirstDataTable(tokenarr[0]),
            initialize3rdDataTable(tokenarr[2]),
            initialize4thDataTable(tokenarr[3]),
            initialize5thDataTable(tokenarr[4])
        ];
        await Promise.all(promises);
        panggillantai();
    } catch(error) {
        toastr["error"]("Gagal mendapatkan token CSRF.");
    }
}
function initializeFirstDataTable(token1) {
    $("#tabel_pesanananmeja_kasir").DataTable({
        language: {
            "url": "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"
        },
        scrollCollapse: true,
        scrollY: "100vh",
        scrollX: true,
        bFilter: true,
        destroy: true,
        ajax: {
            "url": baseurljavascript + 'resto/ajaxdetailpesanan',
            "method": 'POST',
            "data": function (d) {
                d.KODEMEJA = "";
                d.PROSESDARI = 'kasir';
                d.TANGGALAWAL = $('#filtertanggalreservasiawal').val().split("-").reverse().join("-");
                d.TANGGALAKHIR = $('#filtertanggalreservasiakhir').val().split("-").reverse().join("-");
            },
        }
    });
}
function lanjutkanTransaksi(trx) {
    let keranjangPending = JSON.parse(localStorage.getItem('keranjangPending')) || [];
    let keranjangBelanja = JSON.parse(localStorage.getItem('keranjangbelanja')) || {};

    let itemsDipindah = keranjangPending.filter(item => item.KETERANGANTRX == trx);
    let sisaPending = keranjangPending.filter(item => item.KETERANGANTRX != trx);

    itemsDipindah.forEach(item => {
        keranjangBelanja[item.BARANG_ID] = {
            ...item,
            STATUS: "BELANJA",
            TANGGALPINDAH: undefined
        };
    });

    localStorage.setItem('keranjangbelanja', JSON.stringify(keranjangBelanja));
    localStorage.setItem('keranjangPending', JSON.stringify(sisaPending));
    window.location.reload(true);
}

function generatePendingSummary() {
    let keranjangPending = JSON.parse(localStorage.getItem('keranjangPending')) || [];
    let summary = {};

    keranjangPending.forEach(item => {
        let trx = item.KETERANGANTRX;

        if (!summary[trx]) {
            summary[trx] = {
                KETERANGANTRX: trx,
                JUMLAH_BARANG: 0,
                TOTAL_BELANJA: 0,
                AKSI: `<button class="btn btn-primary" onclick="lanjutkanTransaksi('${trx}')">Lanjutkan</button>`
            };
        }

        summary[trx].JUMLAH_BARANG += item.QTY;
        summary[trx].TOTAL_BELANJA += item.QTY * item.HARGA_JUAL;
    });

    // object → array
    return Object.values(summary);
}

let tablePending = $("#kasir_daftarnotapending").DataTable({
    retrieve: true,
    ordering: true,
    order: [[0, 'desc']],
    language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"
    },
    data: generatePendingSummary(), 
    scrollCollapse: true,
    scrollY: "50vh",
    scrollX: true,
    bFilter: false,
    columns: [
        { data: "KETERANGANTRX" },
        { 
            data: "JUMLAH_BARANG", 
            className: "text-right",
            render: function(data, type, row) {
                return data.toLocaleString('id-ID'); // format ribuan
            }
        },
        { 
            data: "TOTAL_BELANJA", 
            className: "text-right",
            render: function(data, type, row) {
                return data.toLocaleString('id-ID'); // format ribuan
            }
        },
        { data: "AKSI" }
    ]    
});
function initialize3rdDataTable(token3) {
    $("#kasir_daftarmember").DataTable({
        retrieve: true,
        language:{"url":"https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"},
        ajax: {
            "url": baseurljavascript + 'masterdata/ajaxdaftarmemberkasir',
            "type": "POST",
            "data": function (d) {
                d.KATAKUNCI = $("#textpencarianmemberkasir").val();
                d.KODEUNIKMEMBER = session_kodeunikmember;
                d.DATAKE = 0;
                d.LIMIT = 50;
            }
        },
        scrollCollapse: true,
        scrollY: "50vh",
        scrollX: true,
        bFilter: false
    });
} 
function initialize4thDataTable(token4) {
    $("#kasir_daftarsalesman").DataTable({
        retrieve: true,
        language:{"url":"https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"},
        ajax: {
            "url": baseurljavascript + 'masterdata/ajaxdaftarsalesman',
            "type": "POST",
            "data": function (d) {
                d.KATAKUNCI = $("#textpencariansuplierkasir").val();
                d.KODEUNIKMEMBER = session_kodeunikmember;
                d.DATAKE = 0;
                d.LIMIT = 50;
            }
        },
        scrollCollapse: true,
        scrollY: "50vh",
        scrollX: true,
        bFilter: false
    });
}
function initialize5thDataTable(token5) {
    $("#kasir_daftarpenjualan").DataTable({
        retrieve: true,
        ordering: true,
        order: [[0, 'desc']],
        language:{"url":"https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"},
        ajax: {
            "url": baseurljavascript + 'penjualan/ajaxdaftarpenjualankasir',
            "type": "POST",
            "data": function (d) {
                d.KATAKUNCIPENCARIAN = $("#txtpencariannota").val();
                d.TANGGALAWAL = $("#tanggalawalnota").val().split("-").reverse().join("-");
                d.TANGGALAKHIR = $("#tanggalakhirnota").val().split("-").reverse().join("-");
                d.DATAKE = 0;
                d.LIMIT = 50;
            },
            dataSrc: function(json) {
                let subtotal = Number(json.subtotal) || 0; 
                let label_tunai = Number(json.label_tunai) || 0;
                let label_kredit = Number(json.label_kredit) || 0;
                let label_transer = Number(json.label_transfer) || 0;
                let label_kartu_kredit = Number(json.label_kartu_kredit) || 0;
                let label_kartu_debit = Number(json.label_kartu_debit) || 0;
                let label_emoney = Number(json.label_emoney) || 0;
                $("#totalSubtotal").html('Rp ' + subtotal.toLocaleString('id-ID'));
                $("#tulisan_hari_ini_tunai").html('Rp ' + label_tunai.toLocaleString('id-ID'));
                $("#tulisan_hari_ini_kredit").html('Rp ' + label_kredit.toLocaleString('id-ID'));
                $("#tulisan_hari_ini_transfer").html('Rp ' + label_transer.toLocaleString('id-ID'));
                $("#tulisan_hari_ini_kartu_debit").html('Rp ' + label_kartu_debit.toLocaleString('id-ID'));
                $("#tulisan_hari_ini_kartu_kredit").html('Rp ' + label_kartu_kredit.toLocaleString('id-ID'));
                $("#tulisan_hari_ini_emoney").html('Rp ' + label_emoney.toLocaleString('id-ID'));
                return json.data;
            }
        },
        scrollCollapse: true,
        scrollY: "50vh",
        scrollX: true,
        bFilter: false,
        pageLength: 100, 
        lengthMenu: [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        columnDefs: [
            {className: "text-right",targets: [3]},
            {targets: [0],visible: false
            },
        ]
    }); 
}
function daftartempatdisewakan(){
    $.ajax({
        url: baseurljavascript + 'resto/ajaxpanggillantai',
        method: 'POST',
        dataType: 'json',
        data: {},
        success: function (response) {
            if (response.success == "true"){
                let htmlnya = "";
                htmlnya = "<div class=\"nav nav-lines portlet-nav\" id=\"portlet1-tab\">";
                for (let i = 0; i < response.totaldata; i++) {
                    if (i == 0){
                        panggilmeja(response.dataquery[i].LANTAI, $("#kontendaftarmejad").attr('id'),'list')
                    }
                    htmlnya += "<a class=\"nav-item nav-link\" onclick=\"panggilmeja('"+response.dataquery[i].LANTAI+"',"+$("#kontendaftarmejad").attr('id')+",'list')\" id=\"portlet1-home-tab\" data-toggle=\"tab\" href=\"javascript:void(0)\">"+response.dataquery[i].LANTAI+"</a>";
                }    
                htmlnya += "</div>";
                $('#daftarlantaitersediad').html("");
                $('#daftarlantaitersediad').html(htmlnya);
            }else{
                Swal.fire({
                    title: "Informasi Reservasi",
                    text: response.msg,
                    icon: 'error',
                });
            }
        }
    });
    $("#daftartempatdisewakan").modal('show');
}
function panggilmeja(lantai,idElement,dari){ 
    $.ajax({
        url: baseurljavascript + 'resto/ajaxpanggilmeja',
        method: 'POST',
        dataType: 'json',
        data: {
            LANTAI : lantai,
        },
        success: function (response) {
            if (response.success == "true"){
                let htmlnya = "";
                htmlnya = "<div class=\"row\">";
                for (let i = 0; i < response.totaldata; i++) {
                    let nameArr = response.dataquery[i].INFORMASIPESANAN.split('::'), pesan = "KOSONG", posisi = 0;
                    if (nameArr[0] > 0) {
                        posisi = "color:red";
                        pesan = "TERPESAN";
                    }
                    htmlnya += ""
    +"<div class=\"col-md-3 card>"
        +"<div class=\"card-body\">"
        +"<img style=\"object-fit: cover; height:250px\"  src=\""+(response.dataquery[i].GAMBAR == "" ? "https://i.ibb.co/d6FsfBx/arti-reservasi-jenis-jenis-manfaat-leng-867483.jpg"  : response.dataquery[i].GAMBAR)+"\" class=\"mb-2 card-img-top mt-2 rounded img-responsive\" alt=\""+response.dataquery[i].KODEMEJA+"\">"
            +"<h5 class=\"card-title\">MEJA : "+response.dataquery[i].NAMAMEJA+" ["+response.dataquery[i].KODEMEJA+"]</h5>"
            +"<p class=\"card-text\">"
            +"Status Meja : <span style=\""+posisi+"\">"+pesan+"</span><br>"
            +"Status Jam Kosong : <span style=\""+posisi+"\">"+time_convert(response.dataquery[i].TOTALJAM - nameArr[1])+"</span><br>"
            +"Total Jam Pesanan : <span style=\""+posisi+"\">"+time_convert(nameArr[1])+"</span><br>"
            +"Dipesan Untuk : <span style=\""+posisi+"\">"+nameArr[0]+" Orang</span><br>"
            +"<p class=\"card-text\">Informasi Meja : <span style=\"color:red\">"+response.dataquery[i].KETERANGAN+"</span></p>"
            +"</p>"
            +"<div class=\"btn-group btn-block\">"
                +"<button onclick=\"detailpesanan('"+response.dataquery[i].KODEMEJA+"','kasir')\" class=\"btn btn-primary\"><i class=\"fas fa-search\"></i> Lihat Detail </button>"
                +"<button "+(dari == "list" ? "hidden" : "" )+" onclick=\"pilihmejainikasir('"+response.dataquery[i].KODEMEJA+"')\" class=\"btn btn-success\"><i class=\"fas fa-add\"></i> Pilih Meja Ini </button>"
            +"</div>"
        +"</div>"
                }    
                htmlnya += "</div>";
                $(idElement).html("");
                $(idElement).append(htmlnya);
            }else{
                Swal.fire({
                    title: "Gagal... Membaca Database",
                    text: "Silahkan cek log database anda. Kali aja ada yang typo dalam penulisan QUERY",
                    icon: 'error',
                });
            }
        }
    });
}
function pilihmejainikasir(kodemeja){
    $("#kodemejaterpilih_rev").val(kodemeja)
}
function batalkanpesanantempat(prosesdari,kodepesanantempat,pemesan,tanggal){
    swal.fire({
        title: "Wah.. Pembatalan Kode Pesan : "+kodepesanantempat+" ?",
        text: "Yahh.. yakin nih mau dibatalkan pemesanan tempatnya TANGGAL "+tanggal+". Apa Kasir tidak diarahkan telebih dahulu gitu customernya dengan NAMA : "+pemesan+" ?",
        icon:"question",
        showCancelButton:true,
        confirmButtonText: "Ok.. Saya Yakin",
        cancelButtonText: "Ooops.. Gak Jadi!!",
    }).then(function(result){
        if(result.isConfirmed){
            $.ajax({
                url: baseurljavascript + 'resto/updatestatuspemesanan',
                method: 'POST',
                dataType: 'json',
                data: {
                    PROSESDARI : prosesdari,
                    KODEMEJA : kodepesanantempat,
                },
                success: function (response) {
                    $('#tabel_pesanananmeja_kasir').DataTable().ajax.reload();
                    Swal.fire({
                        title: "Pembatalan Berhasil",
                        text: "Pemesan dengan NAMA : "+pemesan+" telah dibatalkan oleh SISTEM. Batas waktu kursi pada TANGGAL "+tanggal+" telah berkurang dan dapat digunakan disi oleh pemesan lain",
                        icon: 'success',
                    });
                }
            });
        }
    })
}
function transaksibaru(){
    kosongkankeranjanglokal();
    setTimeout(function (){
        location.href = baseurljavascript+"penjualan/kasir/";
    }, 50);
}
function toastinformasidpkonfirmasi(){
    toastr.options = {newestOnTop: true,};
    toastr["info"]("Informasi yang disajikan adalah informasi pembantu guna KASIR dapat mengingatkan DP yang dibayarkan pelanggan saat reservasi");
}
$("#nominaltunai, #nominalkredit, #nomorkartudebit, #nomorkartukredit, #nominalemoney, #nominaltransfer").on('keyup change input propertychange paste onkeydown', function() { proseskonfirmasipembelian(); });
$("#nominaltunai, #nominalkredit, #nomorkartudebit, #nomorkartukredit, #nominalemoney, #nominaltransfer").on("click", function () { selectAllText($(this)) });
let kembalian = 0, ktotalbelanja = 0
function proseskonfirmasipembelian(daricallback){
    setTimeout(function (){
        ktotalbelanja = Number($('#totalbelanjakonfirmasi').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim())
        ktunai = (nominaltunai.getNumber() + nominaluangmukares.getNumber())
        kkredit = nominalkredit.getNumber()
        kkartudebit = nomorkartudebit.getNumber()
        kkartukredit = nomorkartukredit.getNumber()
        kktransfer = nominaltransfer.getNumber()
        kemoney = nominalemoney.getNumber()
        kembalian = (ktunai + kkredit + kkartudebit + kkartukredit + kemoney + kktransfer) - (ktotalbelanja)
        nominaltotalbayar.set((ktunai + kkredit + kkartudebit + kkartukredit + kemoney + kktransfer))
        nominalkembalian.set(kembalian)
        if (daricallback == 1){ simpantransaksi()}
      }, 100);
}
$("#btnsimpantransaksi").click(function() {
    simpantransaksi()
});
$("#btnsimpanpaygateway").click(function() {
    simpantranskasipaygateway()
});
function restorenotapending(keterangan){
    swal.fire({
        title: "Pilih Nota Pending",
        icon: 'warning',
        text: "Apakah anda ingin memilih nota ini dengan INFORMASI KETERANGAN: "+keterangan+" untuk dijadikan transaksi utama ?. TRANSAKSI PENDING INI AKAN DIHAPUS SETELAH ANDA MEMILIHNYA. Silahkan simpan transaksi pending ulang lagi jika ingin menyimpan lagi.",
        //imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzhiMTE3M2RjM2U1ZWI3OWFjMjVjYjUxZjI4NjZhYTk2NzZiNmNiZCZjdD1z/jn27S7H3ARZVHex8z6/giphy.gif',
        //imageHeight: 150,
        showCancelButton:true,
        confirmButtonText: "Oke Siap",
        cancelButtonText: "Skip. Tidak jadi!",
    }).then(function(result){
        if(result.isConfirmed){
            $.ajax({
                url: baseurljavascript + 'penjualan/pendingkekeranjang',
                method: 'POST',
                dataType: 'json',
                data: {
                    KETERANGAN :keterangan,
                },
                success: function (response) {
                    let obj = JSON.parse(response);
                    if (obj.status == "true"){
                        swal.fire({
                            title: "Transaksi Ke Keranjang",
                            icon: 'success',
                            text: "Oke, barang pada notapending sudah dialihkan ke keranjang utama, silahkan lanjutkan transaksi yang sempat tertunda",
                            //imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzhiMTE3M2RjM2U1ZWI3OWFjMjVjYjUxZjI4NjZhYTk2NzZiNmNiZCZjdD1z/jn27S7H3ARZVHex8z6/giphy.gif',
                            //imageHeight: 150,
                            showCancelButton:false,
                            confirmButtonText: "Ye... Lanjutkankan Transaksi",
                        }).then(function(result){
                            if(result.isConfirmed){
                                tampilkanKeranjangDariLocal();
                                $('#daftarnotapending').modal('toggle');
                            }
                        })   
                    }else{
                        Swal.fire({
                            title: "Gagal... Cek Koneksi Database Lokal",
                            text: "Silahkan Hubungi Teknisi Untuk Permasalahan Ini",
                            icon: 'warning',
                        });
                    }
                },
                error: function(xhr, status, error) {
                    toastr["error"](xhr.responseJSON.message);
                }
            });
        }
    })   
}
function daftarnotapending(){
    tablePending.clear().rows.add(generatePendingSummary()).draw();
    $("#daftarnotapending").on('shown.bs.modal', function(){
        setTimeout(function (){
            $("#txtpencariannotapending").focus();
        }, 150);
    }).modal('show');
}
function simpantransaksipending(){
    proseskonfirmasipembelian()
    if ($('#keterangantransaksi').val() == ""){
        $('#keterangantransaksi').focus();
        Swal.fire({
            title: "Terjadi Kesalahan",
            text: "Silahkan isikan keterangan sebagai penanda NOTA PENDING agar mudah dalam pencarian kembali",
            icon: 'warning',
        });
        return false
    }
    let keranjangBelanja = JSON.parse(localStorage.getItem('keranjangbelanja')) || {};
    let keranjangPending = JSON.parse(localStorage.getItem('keranjangPending')) || [];
    let trxVal = $('#keterangantransaksi').val();
    
    for (let key in keranjangBelanja) {
        let item = keranjangBelanja[key];
    
        keranjangPending.push({
            ...item,
            STATUS: "PENDING",
            TANGGALPINDAH: new Date().toISOString(),
            KETERANGANTRX: trxVal
        });
    
        delete keranjangBelanja[key];
    }
    
    localStorage.setItem('keranjangbelanja', JSON.stringify(keranjangBelanja));
    localStorage.setItem('keranjangPending', JSON.stringify(keranjangPending));    
    refreshpage();
}
function cetakulangnotapenjualan(nomortransaksi, kodeai){
    keranjangarray = []
    inforkartubarang = []
    swal.fire({
        title: "Mau Cetak Ulang Nota?",
        icon: 'question',
        text: "Apakah anda ingin mencatak ulang nota dengan NO TRANSAKSI "+nomortransaksi+" ini?",
        showCancelButton:true,
        confirmButtonText: "Cetak Nota ini",
        cancelButtonText: "Skip. Tidak cetak nota!",
    }).then(function(result){
        if(result.isConfirmed){
            $.ajax({
                url: baseurljavascript + 'penjualan/cetakulangtransaksikasir',
                method: 'POST',
                dataType: 'json',
                data: {
                    KODEAI : kodeai,
                },
                success: function (response) {
                    if (response.success === "true") {
                        let keranjangarray = [];
                        let inforkartubarang = [];
                        for (let i = 0; i < response.totaldata; i++) {
                            let data = response.dataquery[i];
                            inforkartubarang = [
                                data["NAMABARANG"] || "",
                                data["HARGAJUALKELUAR"] || "",
                                data["TOTALBELANJA"] || 0,
                                data["DARIPERUSAHAAN"] || 0,
                                data["FK_BARANG"] || "",
                                data["HARGABELI"] || "",
                                data["STOKBARANGKELUAR"] || "",
                                "GAK TAU 1" || "0",
                                "GAK TAU 2" || "0",
                                "DAPAT MINUS"|| "",
                                "SOCKET ID" || 0,
                                data["CATATANPERBARANG"] || "Tidak Ada Keterangan",
                                data["APAKAHVARIAN"] || "",
                                data["HARGAJUALSEMENTARA"] || "",
                                "GAK TAU 3" || "0",
                                data["JENISBARANG"] || "",
                                data["POTONGAN"] || 0,
                                data["SATUAN"] || ""
                            ];
                            keranjangarray.push(inforkartubarang);
                        }
                        $.ajax({
                            url: baseurljavascript + 'penjualan/cetaknota',
                            method: 'POST',
                            dataType: 'json',
                            data: {
                                INFORMASIBARANG: JSON.stringify(keranjangarray),
                                NOTAPENJUALAN: response.dataquery[0].PK_NOTAPENJUALAN,
                                NAMAMEMBER: response.dataquery[0].NAMAMEMBER,
                                NAMASALESMAN: response.dataquery[0].NAMASALESMAN,
                                TGLKELUAR: moment(response.dataquery[0].TGLKELUAR).format('DD-MM-YYYY'),
                                WAKTU: response.dataquery[0].WAKTUTRANSAKSI,
                                KETERANGANTRANSAKSI: response.dataquery[0].KETERANGAN,
                                NOMINALTUNAI: response.dataquery[0].NOMINALTUNAI,
                                NOMINALTRANSFER: response.dataquery[0].NOMINALTRANSFER,
                                NOMINALKREDIT: response.dataquery[0].NOMINALKREDIT,
                                NOMINALKARTUDEBIT: response.dataquery[0].NOMINALKARTUDEBIT,
                                NOMINALKARTUKREDIT: response.dataquery[0].NOMINALKARTUKREDIT,
                                NOMINALEMONEY: response.dataquery[0].NOMINALEMONEY,
                                NOMORKARTUDEBIT: response.dataquery[0].NOMORKARTUDEBIT,
                                NOMORKARTUKREDIT: response.dataquery[0].NOMORKARTUKREDIT,
                                BANKDEBIT: response.dataquery[0].BANKDEBIT,
                                BANKKREDIT: response.dataquery[0].BANKKREDIT,
                                BANKTRANSFER: response.dataquery[0].BANKTRANSFER,
                                NAMAEMONEY: response.dataquery[0].NAMAEMONEY,
                                NOMINALPOTONGAN: response.dataquery[0].NOMINALPOTONGAN,
                                NOMINALPAJAKKELUAR: response.dataquery[0].NOMINALPAJAKKELUAR,
                                KEMBALIAN: response.dataquery[0].KEMBALIAN,
                                TOTALBELANJA: response.dataquery[0].TOTALBELANJA,
                                PAJAKTOKO: response.dataquery[0].PAJAKTOKO,
                                PAJAKNEGARA: response.dataquery[0].PAJAKNEGARA,
                                POTONGANGLOBAL: response.dataquery[0].POTONGANGLOBAL,
                                NOMINALBAYAR: response.dataquery[0].NOMINALTUNAI,
                                NAMAPENGGUNA: response.dataquery[0].NAMAPENGGUNA,
                                KODESOCKETPRINT: localStorage.getItem("KODESOCKETPRINTER"),
                                ENUM_JENISTRANSAKSI: response.dataquery[0].ENUM_JENISTRANSAKSI,
                            },
                            success: function (res) {
                            },
                        });
                    }
                }
            });
        }
    })   
}

function ambilinformasikeranjang(){
    keranjangarray = [],inforkartubarang = []
    indexsubarray = 0
    timenow = moment().format('HH:mm:ss');
    testContainer = document.querySelector('#keranjangbelanja')
    fourChildNode = testContainer.querySelectorAll('.informasibarang, input')
    fourChildNode.forEach((element,index) => {
        if (element.firstChild != null){
            if (element.firstChild.nodeValue === "===="){
                keranjangarray.push(inforkartubarang);
                inforkartubarang = []
                indexsubarray = indexsubarray + 1
            }else{
                let regexjson = new RegExp(/[{\[]{1}([,:{}\[\]0-9.\-+A-zr-u \n\r\t]|".*:?")+[}\]]{1}/);
                    if (element.firstChild.nodeValue !== "===="){
                        if (regexjson.test(element.firstChild.nodeValue)){
                            inforkartubarang.push(element.nodeName == "INPUT" ? element.defaultValue : btoa(element.firstChild.nodeValue));
                        }else{
                            inforkartubarang.push(element.nodeName == "INPUT" ? element.defaultValue : element.firstChild.nodeValue.replace('Rp', '').replaceAll('.', '').replace(',', '.').trim());
                        }
                    }
                
            }       
        }
    });
}
function convertToItemDetails(pg,array) {
    return array.map(item => {
        if (pg == "duitku"){
            return {
                name: item[0],
                price: parseFloat(item[1]),
                quantity: parseInt(item[6])
            };
        }
    });
}
function simpantranskasipaygateway(){
    //ambilinformasikeranjang()
    $("#btnsimpanpaygateway").html("<i class=\"fa-solid fa-spinner fa-spin-pulse\" style=\"color: #ff0000;\"></i> [F6] Membuat QRIS");
    $("#btnsimpanpaygateway").prop('disabled', true);
    $.ajax({
        url: baseurljavascript + 'paymentgateway/qris',
        method: 'POST',
        dataType: 'json',
        data: {
            VENDOR: "duitku",
            NAMAMEMBER: $("#namamember").html(),
            EMAIL: $("#emailpelanggan").html(),
            NOKONTAK: $("#nokontakpelanggan").html(),
            ITEMS : /*convertToItemDetails("duitku",keranjangarray),*/"",
            ORDERID : $('#notakasirpenjualan').html(),
            TOTALBELANJA: Number($('#totalbelanjakonfirmasi').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim()),
        },
        success: function (response) {
            if (response.status != 200 ){
                if (response.statusCode !== "00"){
                    return toastr["error"]("Terdapat kesalahan dengan kode error : "+response.status+". Silahkan hubungi momod");
                }
            }
            var countdownElement = document.getElementById("durasiscanqris");
            countdownTimeStartMinutes(48, countdownElement);
            var options = { 
                text: response.qrString,
                correctLevel: QRCode.CorrectLevel.H
            };
            new QRCode(document.getElementById("qrcodeclosepayment"), options);
            $("#btncektransaksipayment").html('<i class="fas fa-vote-yea ms-2"></i> Cek Transaksi '+response.reference)
            $("#labelscanqris,#qrcodeclosepayment,#btncektransaksipayment,#durasiscanqris").show()
            $("#qrcodeclosepayment").css({ "display": "block", "margin": "0 auto" });
            $("#btnsimpanpaygateway").html("<i class=\"fa-solid fa-spinner fa-spin-pulse\" style=\"color: #ff0000;\"></i> [F6] Silahkan Scan QRIS");
        },
        error: function (request, status, error) {}
    });
}
function clearModalKonfirmasiPembayaran() {
    $("#tunai").prop("checked", true).trigger("change");
    $('#modalkonfirmasipembayaran').modal('toggle');
    // let modal = $('#modalkonfirmasipembayaran');

    // // Kosongkan semua input text
    // modal.find('input[type="text"]').val('');

    // // Reset khusus field tertentu
    // modal.find('#nominaltotalbayar').val('');
    // modal.find('#nominalkembalian').val('');
    // modal.find('#nominaluangmukares').val('');

    // // Reset span hidden value
    // modal.find('#idkartudebit').html('');
    // modal.find('#idkartukredit').html('');
    // modal.find('#idemoney').html('');

    // // Kosongkan daftar bank / emoney
    // modal.find('#daftarbankdebit').html('');
    // modal.find('#daftarbankkredit').html('');
    // modal.find('#daftaremoney').html('');

    // // Reset QRIS section
    // modal.find('#qrcodeclosepayment').html('');
    // modal.find('#durasiscanqris').html('').hide();
    // modal.find('#labelscanqris').hide();
    // modal.find('#btncektransaksipayment').hide();

    // // Reset total belanja label
    // modal.find('#totalbelanjakonfirmasi').html('Rp 0,00');

    // // PENTING: set radio button default ke TUNAI
    // modal.find('#jenistransaksi input[type=radio]').prop('checked', false);  
    // modal.find('#tunai').prop('checked', true);
    // jenistransaksienum = "TUNAI";
    // $("#kolomtunai").show();
    // $("#kolomkredit").hide();
    // $("#kolomkartudebit").hide();
    // $("#kolomkartukredit").hide();
    // $("#kolomemoney").hide();
    // $("#nominaltunai").focus();
    // $("#nominaltunai").select();
}

function simpantransaksi(){
    $("#btnsimpantransaksi").html("<i class=\"fa-solid fa-spinner fa-spin-pulse\" style=\"color: #ff0000;\"></i> [END] Sedang Proses");
    $("#btnsimpantransaksi").prop('disabled', true);
    if (tipeordernya == 1 && ($('#berapaorang_rev').val() == "" || $('#namapemesan_rev').val() == "" || $('#notelp_rev').val() == "" || $('#kodemejaterpilih_rev').val() == "")){
        $("#btnsimpantransaksi").html("<i class=\"fa fa-print ms-2\"></i> [End] Simpan + Cetak");
        $("#btnsimpantransaksi").prop('disabled', false);
        Swal.fire({
            title: "Terjadi Kesalahan",
            icon: 'error',
            text: "Formulir reservasi masih belum lengkap. Silahkan lengkapo formulir terlebih dahulu seperti NAMA PEMESAN, NO KONTAK , MEJA atau BANYAKNYA PERSONIL",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
                }, 1000)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        })
        return false
    }
    if ($("#kredit").is(':checked') && $('#idmember').html() == '1001' && tipeordernya != 1 && tipeordernya != 2){
        $("#btnsimpantransaksi").html("<i class=\"fa fa-print ms-2\"></i> [End] Simpan + Cetak");
        $("#btnsimpantransaksi").prop('disabled', false);
        Swal.fire({
            title: "Terjadi Kesalahan",
            icon: 'error',
            text: "Fitur pembayaran kredit hanya tersedia untuk MEMBER saja. Silahkan tawarkan menjadi MEMBER di toko anda untuk mendapatkan fitur ini",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
                }, 1000)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        })
        return false
    }
    if (nominalkembalian.getNumber() < 0 && !$("#kredit").is(':checked')){
        $("#btnsimpantransaksi").html("<i class=\"fa fa-print ms-2\"></i> [End] Simpan + Cetak");
        $("#btnsimpantransaksi").prop('disabled', false);
        return Swal.fire({
            title: "Terjadi Kesalahan",
            icon: 'error',
            text: "Nominal pembayaran masih kurang sebesar "+formatuang(nominalkembalian.getNumber(),'id-ID','IDR')+". Silahkan cek kembali nominal masukan anda",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
                }, 1000)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        })
    }
    ambilinformasikeranjang()
    let TOTALBELANJADATA = Number($('#totalbelanjakonfirmasi').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim());
    let TOTALBAYARBELANJA = (Number($('#totalbelanjakonfirmasi').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim()) + nominalkembalian.getNumber())
    let keterangantransaksi = $('#keterangantransaksi').val()
    let notapenjualantransaksi = $('#notakasirpenjualan').html()
    $.ajax({
        url: baseurljavascript + 'penjualan/simpantransaksi',
        method: 'POST',
        dataType: 'json',
        data: {
            INFORMASIBARANG : JSON.stringify(keranjangarray),
            ADADATA: indexsubarray,
            PK_NOTAPENJUALAN : $('#notakasirpenjualan').html(),
            FK_MEMBER : $('#idmember').html(),
            FK_SALESMAN : $('#idsalesman').html(),
            ENUM_JENISTRANSAKSI : jenistransaksienum,
            JATUHTEMPO : $('#lamajatuhtempo').html(),
            LOKASI : session_outlet,
            TGLKELUAR : $('#tanggaltrxfield').val().split("-").reverse().join("-"),
            WAKTU : timenow,
            KASIR : session_pengguna_id,
            NOMORNOTA : $('#notakasirpenjualan').html().split('#')[1],
            KETERANGAN : keterangantransaksi,
            KODEUNIKMEMBER : session_kodeunikmember,
            NOMINALTUNAI : nominaltunai.getNumber(),
            NOMINALKREDIT : nominalkredit.getNumber(),
            NOMINALKARTUDEBIT : nomorkartudebit.getNumber(),
            NOMORKARTUDEBIT : $('#nomorkartudebitdantrx').val(),
            BANKDEBIT : $('#idkartudebit').html(),
            NOMINALKARTUKREDIT : nomorkartukredit.getNumber(),
            NOMORKARTUKREDIT : $('#nomorkartukreditdantrx').val(),
            BANKKREDIT : $('#idkartukredit').html(),
            NOMINALEMONEY : nominalemoney.getNumber(),
            NAMAEMONEY : $('#idemoney').html(),
            NOMINALPOTONGAN : nominalpotongan.getNumber(),
            NOMINALPAJAKKELUAR : 0,
            KEMBALIAN: nominalkembalian.getNumber(),
            TOTALBELANJA: Number($('#totalbelanjakonfirmasi').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim()),
            ISEDITKASIR : iseditkasir,
            PAJAKTOKO : nominalpajaktoko.getNumber(),
            PAJAKNEGARA : nominalpajaknegara.getNumber(),
            POTONGANGLOBAL : nominalpotongan.getNumber(),
            TIPETRANSAKSI : tipeordernya,
            /*jika pesanan tipe oerder 1 */
            KODEPESAN : $('#kodepesan_rev').val(),
            KODEMENUPESANAN : $('#kodemenupesan_rev').val(),
            KODEMEJA : $('#kodemejaterpilih_rev').val(),
            PEMESAN : $('#namapemesan_rev').val(),
            NOTELEPON : $('#notelp_rev').val(),
            UNTUKBERAPAORANG : $('#berapaorang_rev').val(),
            TOTALBELANJA : Number($('#totalbelanjakonfirmasi').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim()),
            DP : dp_rev.getNumber(),
            TANGGAL : $('#tanggalawal_rev').val().split("-").reverse().join("-"),
            WAKTUAWAL : $('#waktuawal_rev').val(),
            TANGGALAKHIR : $('#tanggalakhir_rev').val().split("-").reverse().join("-"),
            WAKTUAKHIR : $('#waktuselesai_rev').val(),
            NOMOR : $('#notakasirpenjualan').html().split('#')[1],
            WARNAMEMO : $('#warnamemo_rev').val(),
            STATUSPESAN : 1 ,
            NOMINALTRANSFER : nominaltransfer.getNumber(),
            NOMORTRANSFER : $("#nomoridentitastransfer").val(),
            BANKTRANSFER : $("#idtransfer").html(),
        },
        success: function (response) {
            if (response.hasiljson[0].success == "true"){
                let refreshPromise = new Promise(function(resolve, reject) {refreshpage();resolve();});
                setTimeout(() => {
                    swal.fire({
                    title: "Hore.. Transaksi Berhasil!!",
                    icon: 'success',
                    text: response.hasiljson[0].msg,
                    //imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzhiMTE3M2RjM2U1ZWI3OWFjMjVjYjUxZjI4NjZhYTk2NzZiNmNiZCZjdD1z/jn27S7H3ARZVHex8z6/giphy.gif',
                    //imageHeight: 150,
                    showCancelButton: true,
                    showDenyButton: true,
                    allowOutsideClick: false,
                    confirmButtonText: "Cetak Nota ini",
                    cancelButtonText: "Skip. Tidak cetak nota!",
                    denyButtonText: "Cetak Lagi",
                    focusConfirm: true, 
                }).then(function(result){
                    $("#btnsimpantransaksi").html("<i class=\"fa fa-print ms-2\"></i> [End] Simpan + Cetak");
                    $("#btnsimpantransaksi").prop('disabled', false);
                    if(result.isConfirmed){
                        $.ajax({
                            url: baseurljavascript + 'penjualan/cetaknota',
                            method: 'POST',
                            dataType: 'json',
                            data: {
                                INFORMASIBARANG : JSON.stringify(keranjangarray),
                                NOTAPENJUALAN : notapenjualantransaksi,
                                NAMAMEMBER : $('#namamember').html(),
                                NAMASALESMAN : $('#namasalesman').html(),
                                TGLKELUAR : $('#tanggaltrxfield').val(),
                                WAKTU : timenow.replaceAll('.', ':'),
                                KETERANGANTRANSAKSI : keterangantransaksi,
                                NOMINALTUNAI : nominaltunai.getNumber(),
                                NOMINALTRANSFER : nominaltransfer.getNumber(),
                                NOMINALKREDIT : nominalkredit.getNumber(),
                                NOMINALKARTUDEBIT : nomorkartudebit.getNumber(),
                                NOMINALKARTUKREDIT : nomorkartukredit.getNumber(),
                                NOMINALEMONEY : nominalemoney.getNumber(),
                                NOMORKARTUDEBIT : $('#nomorkartudebitdantrx').val(),
                                NOMORKARTUKREDIT : $('#nomorkartukreditdantrx').val(),
                                BANKDEBIT : $('#idkartudebit').html(),
                                BANKKREDIT : $('#idkartukredit').html(),
                                BANKTRANSFER : $("#idtransfer").html(),
                                NAMAEMONEY : $('#idemoney').html(),
                                NOMINALPOTONGAN : nominalpotongan.getNumber(),
                                NOMINALPAJAKKELUAR : 0,
                                KEMBALIAN: nominalkembalian.getNumber(),
                                TOTALBELANJA: TOTALBELANJADATA,
                                PAJAKTOKO : nominalpajaktoko.getNumber(),
                                PAJAKNEGARA : nominalpajaknegara.getNumber(),
                                POTONGANGLOBAL : nominalpotongan.getNumber(),
                                NOMINALBAYAR: TOTALBAYARBELANJA,
                                NAMAPENGGUNA: session_namapengguna,
                                KODESOCKETPRINT : localStorage.getItem("KODESOCKETPRINTER"),
                                ENUM_JENISTRANSAKSI : jenistransaksienum,
                            },
                            success: function (response) {
                            }
                        });
                        if (iseditkasir == "true"){
                            refreshPromise.then(function() {location.href = baseurljavascript+"penjualan/kasir/";});
                        }   
                    }else{
                        if (iseditkasir == "true"){
                            refreshPromise.then(function() {location.href = baseurljavascript+"penjualan/kasir/";});
                        }
                    }
                })  
                }, 100);
                clearModalKonfirmasiPembayaran() 
            }else{
                Swal.fire({
                    title: "Terjadi Kesalahan Dalam Transaksi",
                    text: response.hasiljson[0].msg,
                    icon: 'error',
                });
                $("#btnsimpantransaksi").html("<i class=\"fa fa-print ms-2\"></i> [End] Simpan + Cetak");
                $("#btnsimpantransaksi").prop('disabled', false);
            }
        },
        error: function(xhr, status, error) {
            toastr["error"](xhr.responseJSON.message);
            $("#btnsimpantransaksi").html("<i class=\"fa fa-print ms-2\"></i> [End] Simpan + Cetak");
            $("#btnsimpantransaksi").prop('disabled', false);
        }
    });
}
function refreshpage(){
    bersihkanformmodal()
    kosongkankeranjanglokal();
    loadnotakasir();
    loaddaftarbarang();
    $('#katakuncipencariankasir').focus();
    $('#namamember').html("Member Umum");
    $('#idmember').html("1001");
    $('#namasalesman').html("Salesman Umum");
    $('#idsalesman').html("SLS1");
    $('#tanggaltrxfield').val(moment().format('DD-MM-YYYY'));
    $("#tanggaltrxfield").datepicker({todayHighlight: true,format:'dd-mm-yyyy',});
    $('#keterangantransaksi').val();
    nominalpotongan.set(0)
    nominalpajaktoko.set(0)
    nominalpajaknegara.set(0)
    nominaltotalbayar.set(0)
    tipeordernya = 0;
}
function keybindenterkonfirmasipembayaran(idtextfield){
    if($("#tunai").is(':checked')) {
        if(idtextfield == "nominaltunai"){ $('#btnsimpantransaksi').focus(); return false }
    }else if($("#kredit").is(':checked')){
        if(idtextfield == "nominalkredit"){ $('#btnsimpantransaksi').focus(); return false }
    }else if($("#kartu").is(':checked')) {
        if(idtextfield == "nominaltransfer"){ $('#nomorkartudebit').focus();$('#nomorkartudebit').select();return false }
        if(idtextfield == "nomorkartudebit"){ $('#nomorkartukredit').focus();$('#nomorkartukredit').select();return false }
        if(idtextfield == "nomorkartukredit"){ $('#nominalemoney').focus();$('#nominalemoney').select();return false }
        if(idtextfield == "nominalemoney"){ $('#btnsimpantransaksi').focus();return false }
    }else if($("#splitcash").is(':checked')) { 
        if(idtextfield == "nominaltunai"){ $('#nominaltransfer').focus();$('#nominaltransfer').select();return false }
        if(idtextfield == "nominaltransfer"){ $('#nomorkartudebit').focus();$('#nomorkartudebit').select();return false }
        if(idtextfield == "nomorkartudebit"){ $('#nomorkartukredit').focus();$('#nomorkartukredit').select();return false }
        if(idtextfield == "nomorkartukredit"){ $('#nominalemoney').focus();$('#nominalemoney').select();return false }
        if(idtextfield == "nominalemoney"){ $('#btnsimpantransaksi').focus();return false }
    }else if($("#qris").is(':checked')) { 
        if(idtextfield == "nominaltransfer"){ $('#btnsimpantransaksi').focus();$('#btnsimpantransaksi').select();return false }
    }
}
function loadnotakasir(){
    if (iseditkasir == "false"){
        $.ajax({
            url: baseurljavascript + 'penjualan/notamenupenjualan',
            method: 'POST',
            dataType: 'json',
            data: {
                AWALANOTA : "PJ",
                OUTLET: session_outlet,
                KODEKUMPUTERLOKAL: localStorage.getItem("KODEKASA"),
                TANGGALSEKARANG: moment().format('YYYYMMDD'),
                KODEUNIKMEMBER: session_kodeunikmember,
            },
            success: function (response) {
                $('#notakasirpenjualan').html(response.nomornota);
            }
        });
    }
}
function loadnotareservasi(){
    $.ajax({
        url: baseurljavascript + 'penjualan/notamenupenjualan',
        method: 'POST',
        dataType: 'json',
        data: {
            AWALANOTA : "MJ",
            OUTLET: session_outlet,
            KODEKUMPUTERLOKAL: localStorage.getItem("KODEKASA"),
            TANGGALSEKARANG: moment().format('YYYYMMDD'),
            KODEUNIKMEMBER: session_kodeunikmember,
        },
        success: function (response) {
            $('#kodepesan_rev').val(response.nomornota);
        }
    });
}

function loaddaftarbarang(){
    $('#kontenbarang').block();
    $.ajax({
        url: baseurljavascript + 'penjualan/ajaxdaftarbarang',
        method: 'POST',
        dataType: 'json',
        data: {
            DIMANA1 : $('#katakuncipencariankasir').val(),
            DIMANA2 : $('#katakuncikategori').val(),
            DIMANA19 : session_outlet,
        },
        success: function (response) {
            let stopinterval = 0
            let stringhtmldaftarabrang = "", urlgambar = "";
            $("#daftaritemkasir").html("");
            if (response[0].success == "false"){
                return Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    html: 'Informasi item / barang yang anda cari tidak ditemukan.<br>Silahkan gunakna katakunci yang lainnya',
                    showConfirmButton: false,
                    toast:true,
                    timer: 1500
                })
            }
            let jumlahkolom = 3;
            let w = $(window).width();
            if (w <= 1024) {
                jumlahkolom = 6;
            } else if (w <= 1400) {
                jumlahkolom = 4;
            }
            stringhtmldaftarabrang += "<div class=\"container\"><div class=\"row\">"
            for (datake = 0; datake < response[0].totaldata; datake++) { 
                let urlgambar = response[0].dataquery[datake].FILENAME == 'not_found' ? baseurljavascript + "images/defaultimage.webp" : baseurljavascript + "upload/citraitem/" + response[0].dataquery[datake].FILENAME;
                stringhtmldaftarabrang += ""
                    + "<div class=\"daftarkeranjangkatalog col-md-" + jumlahkolom + "\" onclick=\"pilihbarang('" + response[0].dataquery[datake].BARANG_ID + "','" + response[0].dataquery[datake].NAMABARANG + "','" + response[0].dataquery[datake].HARGAJUAL + "','" + response[0].dataquery[datake].HARGABELI + "','" + response[0].dataquery[datake].DISPLAY + "','" + response[0].dataquery[0].PEMILIK + "','" + response[0].dataquery[datake].APAKAHBONUS + "','" + response[0].dataquery[datake].STOKDAPATMINUS + "','" + response[0].dataquery[datake].BRAND_ID + "','" + response[0].dataquery[datake].PARETO_ID + "','TIDAK ADA KETERANGAN','" + response[0].dataquery[datake].HARGAJUAL + "','" + response[0].dataquery[datake].HARGAJUAL + "','" + response[0].dataquery[datake].JENISBARANG + "','"+response[0].dataquery[datake].SATUAN+"')\" style=\"cursor:pointer;padding: 0 !important;margin: 0 !important;\">"
                    + "<div style=\"padding:5px\">"
                    + "<div class=\"card\">"
                    + "<div class=\"row no-gutters\">"
                    + "<div class=\"col-md-5\">"
                    + "<div class=\"image-container\">"
                    + "<img src=\"" + baseurljavascript + "images/spinnerloading.svg" + "\" data-src=\"" + urlgambar + "\" alt=\"Gambar Produk\" loading=\"lazy\">"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"col-md-7\">"
                    + "<div class=\"card-body\">"
                    + "<h4 class=\"card-text\">" + response[0].dataquery[datake].NAMABARANG + "</h4>"
                    + "<h5 class=\"card-title\"><strong>Kode Item : " + response[0].dataquery[datake].BARANG_ID + "</strong></h5>"
                    + "<h5 class=\"card-title\"><strong>Stok : " + response[0].dataquery[datake].DISPLAY + "</strong></h5>"
                    + "<button style=\"position: absolute;bottom:0;left:5%;right:0\" class=\"btn btn-block btn-primary\"><i class=\"fa-solid fa-circle-info\"></i></i> Tambah Keranjang</button>"
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"card row no-gutters\">"
                    + "<div class=\"col-md-12\">"
                    + "<h4 style=\"font-size: 200%;font-family:'digital-clock-font'\" class=\"text-center\"><strong>Harga: " + formatter.format(response[0].dataquery[datake].HARGAJUAL) + "</strong></h4>"
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "</div>";
            } 
            stringhtmldaftarabrang += "</div></div>"
            if (response[0].totaldata == 1){
                pilihbarang(response[0].dataquery[0].BARANG_ID, response[0].dataquery[0].NAMABARANG, response[0].dataquery[0].HARGAJUAL, response[0].dataquery[0].HARGABELI, response[0].dataquery[0].DISPLAY, response[0].dataquery[0].PEMILIK, response[0].dataquery[0].APAKAHBONUS, response[0].dataquery[0].STOKDAPATMINUS,response[0].dataquery[0].BRAND_ID,response[0].dataquery[0].PARETO_ID,'TIDAK ADA KETERANGAN',response[0].dataquery[0].HARGAJUAL,response[0].dataquery[0].HARGAJUAL,response[0].dataquery[0].JENISBARANG,response[0].dataquery[0].SATUAN);
                $("#katakuncipencariankasir").val("");
                $("#katakuncipencariankasir").focus();
            }
            $("#daftaritemkasir").html(stringhtmldaftarabrang)
            let lazyImages = document.querySelectorAll('img[data-src]');
            let options = {
                threshold: 0.5
            };

            let lazyLoad = function(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let img = entry.target;
                        img.src = img.dataset.src;
                        img.onload = function() {
                            img.removeAttribute('data-src');
                        };
                        observer.unobserve(img);
                    }
                });
            };

            let observer = new IntersectionObserver(lazyLoad, options);
            lazyImages.forEach(image => {
                observer.observe(image);
            });
        },
        error: function(xhr, status, error) {
            toastr["error"](xhr.responseJSON.message);
        }
    });
    $('#kontenbarang').unblock()
}

let parse_obj;
function cekkeranjang(){
    if(Number($('#grandtotal').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim()) <= 0 && tipeordernya != 1){
        return Swal.fire({
            title: "Kesalahan Nominal",
            text: "Silahkan pilih minimal 1 barang untuk dilakukan transaksi keluar atau mungkin nominal anda dalam kondisi MINUS",
            icon: 'warning',
        });
    }else if (tipeordernya == 2 && $('#keterangantransaksi').val() == ""){
        $('#keterangantransaksi').focus();
        return Swal.fire({
            title: "Kesalahan DINE-IN",
            text: "Anda harus mengisi keterangan mengenai Tranaksi DINE-IN seperti NOMOR MEJA, dll",
            icon: 'warning',
        });
    }else if (tipeordernya == 3 && $('#idsalesman').html() == "SLS1"){
        return Swal.fire({
            title: "Kesalahan TAKE AWAY",
            text: "Salesman umum tidak diizinkan, silahkan tentukan nama salesman secara spesifik yang valid",
            icon: 'warning',
        });
    }else{
        $("#modalkonfirmasipembayaran").on('shown.bs.modal', function(){
            setTimeout(function (){
                $('#nominaltunai').focus();
                $('#nominaltunai').select();

                if (iseditkasir == "true"){
                    switch(jenistransaksi){
                        case "TUNAI":
                            $("#tunai").prop("checked", true).trigger("change");
                            break;
                        case "KREDIT":
                            $("#kredit").prop("checked", true).trigger("change");
                            break;
                        case "KARTU":
                            $("#kartu").prop("checked", true).trigger("change");
                            break;
                        case "SPLITCASH":
                            $("#splitcash").prop("checked", true).trigger("change");
                            break;
                        default:
                            $("#tunai").prop("checked", true);
                    }
                    $('#nominalpotongan').trigger('input');
                }

                if (iseditkasir == "false"){
                    nominaltunai.set(0);
                    nominalkredit.set(0);
                    nomorkartudebit.set(0);
                    nomorkartukredit.set(0);
                    nominalemoney.set(0);
                    nominaltransfer.set(0);
                    nominalkembalian.set(
                        Number($('#grandtotal').html()
                            .replace('Rp&nbsp;', '')
                            .replaceAll('.', '')
                            .replace(',', '.')
                            .trim()) * -1
                    );
                }
                $("#labelscanqris,#qrcodeclosepayment").hide();
                const imgElement = document.getElementById('qrcodeclosepayment');
                imgElement.src = "https://i.imgflip.com/6j0onv.png";
                proseskonfirmasipembelian();
                let totalbelanjakonfirmasi = formatuang(
                    Number($('#grandtotal').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim()),
                    'id-ID','IDR'
                );
                if (iseditkasir == "true") {
                    totalbelanjakonfirmasi = formatuang(Number($('#grandtotal').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim()), 'id-ID', 'IDR');
                    $("#btnpilihbankcssD" + idbankdebit).css({"background-color": "red"});
                    $("#btnpilihbankcssT" + idbanktransfer).css({"background-color": "red"});
                    $("#btnpilihbankcssK" + idbangkredit).css({"background-color": "red"});
                    $("#btnpilihbankcssE" + idbankemoney).css({"background-color": "red"});
                }
                $('#totalbelanjakonfirmasi').html(totalbelanjakonfirmasi);

            }, 100);
        }).modal('show');

}
    
}
function subpilihbarang(barangid, namabarang, hargajual, hargabeli, sisastokmaksimal, pemilik, apakahvarian, stokdapatminus, brandid, principalid, keterangantiapbarang, hargajualasli, hargajualaslisementara, jenisbarang, satuan){
    $('#keranjangkosong').html("");
    if ($("#statusprosesitem"+barangid).html() != 0 && typeof $("#statusprosesitem"+barangid).html() !== "undefined"){
        return Swal.fire({
            title: "Permintaan Proses Ditolak",
            text: "Kami mohon maaf untuk menolak permintaan anda. Karena item sudah dalam STATUS PROSES atau bahkan SUDAH SELESAI",
            icon: 'error',
        });
    }
    timestamp = Math.floor(Date.now() / 1000)
    let keranjang = JSON.parse(localStorage.getItem('keranjangbelanja')) || {};
    let qty = $("#barangkeluarqty" + barangid).length > 0
    ? Number($("#barangkeluarqty"+barangid).val()) + Number($("#qtykeluarkasir").val())
    : Number($("#qtykeluarkasir").val());

    let barang = keranjang[barangid] || {
        BARANG_ID: barangid,
        NAMA_BARANG: namabarang,
        QTY: 0,
        HARGA_JUAL: hargajual,
        HARGA_BELI: hargabeli,
        PPN: 0,
        DARIPERUSAHAAN: pemilik,
        ISEDIT: iseditkasir,
        APAKAHVARIAN: apakahvarian,
        STOKDAPATMINUS: stokdapatminus,
        JSONTAMBAHAN: jsonStrjenisvarian,
        BRAND_ID: brandid,
        PRINCIPAL_ID: principalid,
        KETERANGAN: keterangantiapbarang,
        HARGAASLI: hargajualasli,
        QTY_LABEL: qty,
        JENIS_BARANG: jenisbarang,
        POTONGAN:0,
        SATUAN: satuan,
    };
    barang.QTY = qty;

    keranjang[barangid] = barang;
    localStorage.setItem('keranjangbelanja', JSON.stringify(keranjang));
    tampilkanKeranjangDariLocal(1);
    $("#qtykeluarkasir").val('1');
    $("#katakuncipencariankasir").val("");

}

function tampilkanKeranjangDariLocal(daripilihbarang = 0) {
    let keranjang = JSON.parse(localStorage.getItem('keranjangbelanja')) || {};
    $("#keranjangbelanja").html("");

    // urutkan berdasarkan LAST_UPDATED (paling baru di atas)
    let sortedKeys = Object.keys(keranjang).sort((a, b) => {
        return (keranjang[b].LAST_UPDATED || 0) - (keranjang[a].LAST_UPDATED || 0);
    });

    sortedKeys.forEach(barangid => {
        let item = keranjang[barangid];
        let qty = item.QTY;
        let hargajual = item.HARGA_JUAL;
        let hargajualasli = item.HARGAASLI;
        let namabarang = item.NAMA_BARANG;
        let hargabeli = item.HARGA_BELI;
        let pemilik = item.DARIPERUSAHAAN;
        let isedit = item.ISEDIT;
        let apakahvarian = item.APAKAHVARIAN;
        let stokdapatminus = item.STOKDAPATMINUS;
        let brandid = item.BRAND_ID;
        let principalid = item.PRINCIPAL_ID;
        let keterangantiapbarang = item.KETERANGAN;
        let jsonStrjenisvarian = item.JSONTAMBAHAN;
        let hargajualaslisementara = item.HARGAASLI;
        let jenisbarang = item.JENIS_BARANG;
        let potongan = item.POTONGAN;
        let satuanbarang = item.SATUAN;

        // proses varian
        let namavariannya = "";
        try {
            let objjson = JSON.parse(jsonStrjenisvarian);
            Object.entries(objjson).forEach(([key, value]) => {
                value.forEach(v => {
                    namavariannya += v.namavarian + " (" + v.qty + "x), ";
                });
            });
        } catch (e) {}

        let prependHTML = ""
        +`<div id="barisbelanja${barangid}" class="portlet mb-1">`
        +`<div class="rich-list-item flex-column align-items-stretch"><div class="rich-list-item p-0">`
            +`<div class="rich-list-prepend">`
                +`<div class="avatar">`
                    +`<div class="avatar-display"><i class="fas fa-box"></i></div>`
                +`</div>`
            +`</div>`
        +`<div class="rich-list-content">`
            +`<h4 class="rich-list-title"><span class="informasibarang" id="namabarang${barangid}">${namabarang}</span></h4>`
            +`<span class="rich-list-subtitle">HJ @<span class="informasibarang" id="hargajual${barangid}">${formatter.format(hargajual)}</span>`
            +`<span style="display:none" id="hargajualasli${barangid}">${hargajualasli}</span>`
        +`</div>`
        +`<div class="rich-list-append">`
            +`<button onclick="modalinfobarang('${barangid}','${hargajualaslisementara}','${keterangantiapbarang}','${hargajualasli}','0','${namabarang}','${potongan}')" style="margin-right:5px" class="btn btn-label-success"><i class="fa fa-bars"></i>${(apakahvarian == "AKTIF" ? "<div class='btn-marker'><i class='marker marker-dot text-success'></i></div>" : "")}</button>`
            +`<button onclick="hapusBarangLocal('${barangid}','${namabarang}','')" class="btn btn-label-danger"><i class="fas fa-trash"></i></button>`
        +`</div>`
    +`</div>`
    +`<div class="form-group row pt-2">`
        +`<div class="col-md-5">`
            +`<input id="barangkeluarqty${barangid}" class="informasibarang qtyformat form-control form-control-lg" type="text" value="${qty}">`
        +`</div>`
        +`<div class="col-md-7 mt-0">`
            +`<strong> SUB TOTAL : </strong><br>`
            +`<span class="informasibarang" id="subtotalbarang${barangid}">${formatter.format(qty * hargajual - potongan)}</span>`
        +`</div>`
        +`<div class="ml-3">`
            +`<h4 class="rich-list-title">POTONGAN : <span id="potongan_${barangid}">${formatuang(potongan,'id-ID','IDR')}</span> <br>VARIAN : <span id="varian_${barangid}">${namavariannya}</span></h4>`
        +`</div>`
    +`</div>`
    +`<div id="informasibarangheader${barangid}" style="display:none" >`
        +`<div id="dariperusahaan${barangid}" class="informasibarang">${pemilik}</div>`
        +`<div id="kodebarang${barangid}" class="informasibarang">${barangid}</div>`
        +`<div id="hargabeli${barangid}" class="informasibarang">${hargabeli.toString().replace('.', ',')}</div>`
        +`<div id="qtylabel${barangid}" class="informasibarang">${qty}</div>`
        +`<div id="brandlabel${barangid}" class="informasibarang">${brandid}</div>`
        +`<div id="principallabel${barangid}" class="informasibarang">${principalid}</div>`
        +`<div id="stokdapatminuslabel${barangid}" class="informasibarang">${stokdapatminus}</div>`
        +`<div id="jsonjenisvarian${barangid}" class="informasibarang">${jsonStrjenisvarian}</div>`
        +`<div id="keterangantiapbarang${barangid}" class="informasibarang">${keterangantiapbarang}</div>`
        +`<div id="apakahvarian${barangid}" class="informasibarang">${apakahvarian}</div>`
        +`<div id="hargajualubah${barangid}" class="informasibarang">${hargajual.toString().replace('.', ',')}</div>`
        +`<div id="statusprosesitem${barangid}" class="informasibarang">0</div>`
        +`<div id="jenisbarang${barangid}" class="informasibarang">${jenisbarang}</div>`
        +`<div id="potongan${barangid}" class="informasibarang">${potongan}</div>`
        +`<div id="satuanbarang${barangid}" class="informasibarang">${satuanbarang}</div>`
        +`<div class="informasibarang">====</div>`
    +`</div>`;

        $("#keranjangbelanja").append(prependHTML);

        let inputTS = $(`#barangkeluarqty${barangid}`);
        inputTS.TouchSpin({
            min: 1,
            max: 999999,
            decimals: 0,
            forcestepdivisibility: 'none',
        }).on('change input', debounce(function () {
            const currentQty2 = Number(inputTS.val());
            updateBarangLocalQty(barangid, currentQty2, hargajual, 0);
        }, 300));
    });

    grandtotalkasir();
}

function updateBarangLocalQty(barangid, qty, hargajual, sisastokmaksimal) {
    if (qty == 0){
        return  toastr["error"]("Terjadi kesalahan dalam penghitungan total belanja. Masukan QTY tidak boleh kurang dari 1.");
    }
    $(`#barisbelanja${barangid}`).block()
    $.ajax({
        url: baseurljavascript + 'penjualan/updatekasirsementara',
        method: 'POST',
        dataType: 'json',
        data: {
            BARANG_ID: barangid,
            QTY: qty,
            HARGAJUAL: (iseditkasir == "true"
                ? Number($("#hargajual" + barangid).html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim())
                : hargajual),
            DARIUBAHHJDETAIL: "TIDAK",
            ISEDITKASIR: iseditkasir,
            EDITGROSIRAKTIF: $('#edithargagrosiraktif').is(':checked'),
            PAKSAUPDTE: 0,
        },
        success: function (response) {
            let obj = (typeof response === 'string') ? JSON.parse(response) : response;
            if (obj.status === "out_of_stok") {
                $("#barangkeluarqty" + barangid).val(sisastokmaksimal);
                grandtotalkasir();
                return toastr["error"](obj.msg);
            }

            if (obj.status === "true") {
                // Gunakan harga jual dari response jika iseditkasir !== true
                const hargaFix = (iseditkasir === "true") ? hargajual : Number(obj.hargajual);

                // Simpan ke localStorage
                let keranjang = JSON.parse(localStorage.getItem('keranjangbelanja')) || {};
                if (keranjang[barangid]) {
                    keranjang[barangid].QTY = Number(qty);
                    keranjang[barangid].QTY_LABEL = qty;
                    keranjang[barangid].HARGA_JUAL = hargaFix;
                    keranjang[barangid].LAST_UPDATED = Date.now();
                    keranjang[barangid].POTONGAN = 0;
                    localStorage.setItem('keranjangbelanja', JSON.stringify(keranjang));
                }

                // Update UI
                $("#barangkeluarqty" + barangid).val(qty);
                $("#qtylabel" + barangid).html(qty.toString().replace('.', ',').trim());
                $("#hargajual" + barangid).html(formatter.format(hargaFix));
                $("#subtotalbarang" + barangid).html(formatter.format(hargaFix * qty));

                grandtotalkasir();
                $(`#barisbelanja${barangid}`).unblock()

                // 🔥 refresh ulang list biar urutannya berubah
                tampilkanKeranjangDariLocal();

                return;
            }

            // Fallback error
            Swal.fire({
                title: "Kesalahan Respon",
                text: "Terjadi kesalahan respon API pada UPDATE QTY PENJUALAN",
                icon: 'warning',
            });
        }
    });
}

function hapusBarangLocal(barangid,namabarang, statusitem){
    if (statusitem != 0){
        return Swal.fire({
            title: "Permintaan Proses Ditolak",
            text: "Kami mohon maaf untuk menolak permintaan anda. Karena item sudah dalam STATUS PROSES atau mungkin SUDAH SELEAI",
            icon: 'error',
        });
    }
    swal.fire({
        title: "Apakah Yakin ?",
        text: "Apakah yakin ingin menghapus barang "+namabarang+" pada keranjang ini.",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText: "Oke, Hapus Ini!",
        cancelButtonText: "Gak Jadi Ah!",
    }).then(function(result){
        if(result.isConfirmed){
            let keranjang = JSON.parse(localStorage.getItem('keranjangbelanja')) || {};
            delete keranjang[barangid];
            localStorage.setItem('keranjangbelanja', JSON.stringify(keranjang));
            tampilkanKeranjangDariLocal();
        }
    })
    
}
const delayedUpdateQty = debounce(function (barangid, newQty, hargajual) {
    updateBarangLocalQty(barangid, newQty, hargajual, 0);
}, 300);
function pilihbarang(barangid, namabarang, hargajual, hargabeli, sisastokmaksimal, pemilik,apakahvarian, stokdapatminus, brandid, principalid, keterangantiapbarang, hargajualasli, hargajualaslisementara, jenisbarang, satuan){
    // if (Number(hargajual) < Number(hargabeli)){
    //     return Swal.fire({
    //         title: "Waduh Terjadi Kesalahan!!!",
    //         html: "Nama Barang : <b>"+namabarang+"</b> dengan Kodebarang : <b>"+barangid+"</b> harga jual tidak boleh kurang dari harga beli. Silahkan hubungi administrator",
    //         icon: 'error',
    //     })
    // }
    if (Number(sisastokmaksimal) <= 0 && stokdapatminus === "TIDAK DAPAT MINUS"){
        swal.fire({
            title: "Waduh Terjadi Kesalahan!!!",
            text: "Nama Barang : "+namabarang+" stok habis. Silahkan lakukan MUTASI, PENYESUAIAN STOK atau HUBUNGI ADMIN BARANG ?",
            imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzhiMTE3M2RjM2U1ZWI3OWFjMjVjYjUxZjI4NjZhYTk2NzZiNmNiZCZjdD1z/jn27S7H3ARZVHex8z6/giphy.gif',
            imageHeight: 150,
            confirmButtonText: "Oke. Saya Paham!",
        }).then(function(result){
            if(result.isConfirmed){
                $(`#barisbelanja${barangid}`).unblock()
                return false
            }
            $(`#barisbelanja${barangid}`).unblock()
        })   
    }else{
        subpilihbarang(barangid, namabarang, hargajual, hargabeli, sisastokmaksimal, pemilik, apakahvarian, stokdapatminus, brandid, principalid, keterangantiapbarang, hargajualasli, hargajualaslisementara, jenisbarang, satuan)
        let newQty = Number($(`#barangkeluarqty${barangid}`).val());
        delayedUpdateQty(barangid, newQty, hargajual);
    }
}
function grandtotalkasir() {
    let keranjang = JSON.parse(localStorage.getItem('keranjangbelanja')) || {};
    let totalbelanja = 0;

    for (let id in keranjang) {
        let item = keranjang[id];
        totalbelanja += parseFloat(item.HARGA_JUAL).toFixed(2) * parseFloat(item.QTY).toFixed(2) - parseFloat(item.POTONGAN).toFixed(2);
    }

    if (totalbelanja > 0) {
        $('#keranjangkosong').html("");
    } else {
        $('#keranjangkosong').html(`
            <div style="position: absolute;top: 8%; bottom: 0; left: 0; right: 0;margin: auto;" class="d-flex flex-column align-items-center justify-content-center">
                <h4 style="text-align:center;"> Oopss.. Keranjang Belanja Anda Masih Kosong Lo... Silahkan Pilih Item Untuk di Transkasi</h4>
                <div class="avatar avatar-label-primary avatar-circle widget12 mb-4">
                    <div class="avatar-display"><i class="fas fa-cart-arrow-down"></i></div>
                </div>
                <a href="javascript:void(0)" class="btn btn-primary btn-wider">Pilih Barang</a>
            </div>
        `);
    }

    // Format dan tampilkan total
    $('#totalbelanjaatas').html(formatter.format(totalbelanja));
    if (iseditkasir === "true") {
        nominalpotongan.set(vnominalpotongan);
        nominalpajaktoko.set(vpajaktoko);
        nominalpajaknegara.set(vpajaknegara);

        let grandtotal = (totalbelanja - Number(vnominalpotongan) + Number(vpajaktoko) + Number(vpajaknegara)).toFixed(2);
        $('#grandtotal').html(formatter.format(grandtotal));
    } else {
        $('#grandtotal').html(formatter.format(totalbelanja));
    }
}

function ajaxupdatebarangkeranjang(barangid, qty, hargajual, sisastokmaksimal) {
    $.ajax({
        url: baseurljavascript + 'penjualan/updatekasirsementara',
        method: 'POST',
        dataType: 'json',
        data: {
            BARANG_ID: barangid,
            QTY: qty,
            HARGAJUAL: (iseditkasir == "true"
                ? Number($("#hargajual" + barangid).html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim())
                : hargajual),
            DARIUBAHHJDETAIL: "TIDAK",
            ISEDITKASIR: iseditkasir,
            EDITGROSIRAKTIF: $('#edithargagrosiraktif').is(':checked'),
        },
        success: function (response) {
            var obj = JSON.parse(response);

            if (obj.status == "out_of_stok") {
                $("#barangkeluarqty" + barangid).val(sisastokmaksimal);
                grandtotalkasir();
                return toastr["error"](obj.msg);
            }

            if (obj.status == "true") {
                // Ambil harga final dari respon server
                let hargaFix = iseditkasir == "true" ? hargajual : obj.hargajual;

                // Update localStorage
                let keranjang = JSON.parse(localStorage.getItem('keranjangbelanja')) || {};
                if (keranjang[barangid]) {
                    keranjang[barangid].QTY = Number(qty);
                    keranjang[barangid].QTY_LABEL = qty;
                    keranjang[barangid].HARGA_JUAL = hargaFix;
                    localStorage.setItem('keranjangbelanja', JSON.stringify(keranjang));
                }

                // Update tampilan UI
                $("#barangkeluarqty" + barangid).val(qty);
                $("#qtylabel" + barangid).html(qty.toString().replace('.', ',').trim());
                $("#hargajual" + barangid).html(formatter.format(hargaFix));
                $("#subtotalbarang" + barangid).html(formatter.format(hargaFix * qty));
                grandtotalkasir();
                return;
            }

            return Swal.fire({
                title: "Kesalahan Respon",
                text: "Terjadi kesalahan respon API pada UPDATE QTY PENJUALAN",
                icon: 'warning',
            });
        }
    });
}

function updatebarangkerankang(barangid,qty,hargajual,sisastokmaksimal){
    if (iseditkasir == "true"){
        ajaxupdatebarangkeranjang(barangid,qty,hargajual,sisastokmaksimal)
    }else{
        ajaxupdatebarangkeranjang(barangid,qty,Number($("#hargajual"+barangid).html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim()),sisastokmaksimal)
    }
}


$("#katakuncipencariankasir").on("keydown", function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        if ($(this).val().trim() === "") {
            $("#qtykeluarkasir").val("");
            $("#qtykeluarkasir").focus();
            return;
        }
        loaddaftarbarang();
    }
});

function kosongkankeranjanglokal(){
    localStorage.removeItem('keranjangbelanja');
    tampilkanKeranjangDariLocal();
    grandtotalkasir();
}
$("#bersihkanform").on("click", function () {
    swal.fire({
        title: "Loo Loo.. Anda Yakin ?",
        text: "Apakah anda ingin membersihkan KERANJANG pada TRANSAKSI ini ?. Jangan galau kalau sampai kehapus ya....",
        icon:"question",
        showCancelButton:true,
        confirmButtonText: "Bersihkan Keranjang",
        cancelButtonText: "Ooops.. Gak Jadi!!",
    }).then(function(result){
        if(result.isConfirmed){
            kosongkankeranjanglokal()
        }
    })
});
$('#textpencarianmemberkasir').on('input', debounce(function (e) {
    $('#kasir_daftarmember').DataTable().ajax.reload();
}, 300));
$('#textpencariankategori').on('input', debounce(function (e) {
    panggilkategorikasir()
}, 300));
function panggilkategorikasir(){
$.ajax({
    url: baseurljavascript + 'masterdata/daftakategoriselectkasir',
    method: 'POST',
    dataType: 'json',
    data: {
        NAMAKATEGORI: $("#textpencariankategori").val(),
        KODEUNIKMEMBER: session_kodeunikmember,
    },
    success: function (response) {
        let obj = JSON.parse(response);
        let htmljoin = "";
        if (obj.success == "false"){
            $('#tampilankategori').html('<div class="d-flex flex-column align-items-center justify-content-center"><h4 style="text-align:center;"> Oopss.. Kategori Yang Anda Cari Tidak Ditemukan, Silahkan Periksa Katakunci Yang Anda Masukkan</h4><!-- BEGIN Avatar --><div class="avatar avatar-label-primary avatar-circle widget12 mb-4"><div class="avatar-display"><i class="fas fa-box-open"></i></div></div></div>');
        }else{
            htmljoin += '<div class="row">';
            for (datake = 0; datake < obj.totaldata; datake++) {
                htmljoin += "<div class=\"col-md-3 col-sm-4 mb-2\"><div class=\"card-sl\"><div class=\"card-image\"><img src=\""+obj.daftarkategori[datake].logokategori+"\" /></div><div class=\"card-heading\">Nama Kategori :<br>\""+obj.daftarkategori[datake].namakategori+"\"</div><a onclick=\"pilihkategori('"+obj.daftarkategori[datake].idkategori+"')\" href=\"javascript:void(0)\" class=\"card-button\">Filter Kategori</a></div></div>";
            }
            htmljoin += '</div>';
            $("#tampilankategori").html(htmljoin);
        }
    }
});
}
function panggilkategorikasir_acipay(kondisi,katakunci){
    let htmljoin = ""
    $.ajax({
        url: baseurljavascript + 'masterdata/kategoridompetdata',
        method: 'POST',
        dataType: 'json',
        data: {
            KONDISI: kondisi,
            KATAKUNCI: katakunci,
        },
        success: function (response) {
            if (response.success == false){
                $('#tampilankategori_acipay').html('<div class="d-flex flex-column align-items-center justify-content-center"><h4 style="text-align:center;"> Oopss.. Kategori Yang Anda Cari Tidak Ditemukan, Silahkan Periksa Katakunci Yang Anda Masukkan</h4><!-- BEGIN Avatar --><div class="avatar avatar-label-primary avatar-circle widget12 mb-4"><div class="avatar-display"><i class="fas fa-box-open"></i></div></div></div>');
            }else{
                htmljoin += '<div class="row m-2">';
                for (datake = 0; datake < response.totaldata; datake++) {
                    htmljoin += "<div style=\"cursor:pointer;\" class=\"col-md-3 col-sm-4 mb-2\"><div class=\"card-sl\"><div class=\"card-image\"><img src=\""+(response.data[datake].LOGOKATEGORI == "" ? baseurljavascript+"images/avatar/no_image.png" : response.data[datake].LOGOKATEGORI )+"\" /></div><div class=\"card-heading\">Nama Kategori :<br>\""+response.data[datake].NAMAKATEGORI+"\"</div><a onclick=\"pilihkategori('"+response.data[datake].KATEGORIPARENT_ID+"')\" href=\"javascript:void(0)\" class=\"card-button\">Pilih Ini</a></div></div>";
                }
                htmljoin += '</div>';
                $("#tampilankategori_acipay").html(htmljoin);
            }
        }
    });
}
function pilihkategori(kategoriid){
    $('#katakuncikategori').val(kategoriid)
    loaddaftarbarang();
    $('#filterbycategori').modal('toggle');
    $('#katakuncikategori').val("")

}
function panggildompetdata(){
    panggilkategorikasir_acipay("ROOT_DIGITAL","ROOT_DIGITAL")
    $("#panggildompetdata").on('shown.bs.modal', function(){
        setTimeout(function (){
            $("#textpencarianmemberkasir").focus()
        }, 150);
    }).modal('show');
}
function panggilmemberkasir(){
    $('#kasir_daftarmember').DataTable().ajax.reload();
    $("#memberdikasir").on('shown.bs.modal', function(){
        setTimeout(function (){
            $("#textpencarianmemberkasir").focus();
        }, 150);
    }).modal('show');
}
function pilihmemberkasir(kodemember,namamember,lamajatuhtempo,emailpelanggan,nokontakpelanggan){
    $("#namamember").html(namamember);
    $("#idmember").html(kodemember);
    $("#lamajatuhtempo").html(lamajatuhtempo);
    $("#emailpelanggan").html(emailpelanggan);
    $("#nokontakpelanggan").html(nokontakpelanggan);
    $('#memberdikasir').modal('toggle');
}
function detailinformasimember (){
$.ajax({
    url: baseurljavascript + 'masterdata/detailmemberterpilih',
    method: 'POST',
    dataType: 'json',
    data: {
        KATAKUNCI: $("#idmember").html(),
        KODEUNIKMEMBER: session_kodeunikmember,
        DATAKE: 0,
        LIMIT: 1,
    },
    success: function (response) {
        let obj = JSON.parse(response);
        if (obj.success == "true"){
            $('#namapelanggandetail').html(obj.NAMA);
            $('#alamatpelanggandetail').html(obj.ALAMAT);
            $('#limitbataspiutangdetail').html(formatuang(obj.LIMITJUMLAHPIUTANG,'id-ID','IDR'));
            $('#memberiddetail').html(obj.MEMBER_ID);
            $('#nomortelepondetail').html(obj.TELEPON);
            $('#alamatemaildetail').html(obj.EMAIL);
            $('#kotamemberdetail').html(obj.KOTA);
            $('#totaldeposit').html(formatuang(obj.TOTALDEPOSIT,'id-ID','IDR'));
            $('#informasimember').modal();
        }else{
        }
    },
    error: function(xhr, status, error) {
        toastr["error"](xhr.responseJSON.message);
    }
});
}
function panggilsalesman(){
    $('#kasir_daftarsalesman').DataTable().ajax.reload();
    $("#salesmandikasir").on('shown.bs.modal', function(){
        setTimeout(function (){
            $("#textpencariansuplierkasir").focus();
        }, 150);
    }).modal('show');
}
function pilihsalesman(kodesales,namasales){
    $("#idsalesman").html(kodesales);
    $("#namasalesman").html(namasales);
    $('#salesmandikasir').modal('toggle');
}
function pilihbank(kondisi,jenisbank){
    let htmlnya = '';
    $.ajax({
        url: baseurljavascript + 'masterdata/daftarpembayarannontunai',
        method: 'POST',
        dataType: 'json',
        data: {
            KODEUNIKMEMBER: session_kodeunikmember,
            JENISNONTUNAI: jenisbank,
        },
        success: function (response) {
            htmlnya = "";
            if (kondisi == "D"){
                htmlnya = '<div class="row mt-2" style="display:none" id="pilihbankdebitdaftar">';
            } else if (kondisi == "K"){
                htmlnya = '<div class="row mt-2" style="display:none" id="pilihbankkreditdaftar">';
            } else if (kondisi == "T"){
                htmlnya = '<div class="row mt-2" style="display:none" id="pilihbanktransferdaftar">';
            } else {
                htmlnya = '<div class="row mt-2" style="display:none" id="pilihemoneyaftar">';
            }

            for (let i = 0; i < response.daftarpembayarannontunai[0].totaldatadataquery; i++) {
                let totaladmin = 0;
                if (kondisi == "D"){
                    totaladmin = response.daftarpembayarannontunai[0].dataquery[i].PAJAKDEBIT;
                } else if (kondisi == "K"){
                    totaladmin = response.daftarpembayarannontunai[0].dataquery[i].PAJAKKREDIT;
                } else if (kondisi == "T"){
                    totaladmin = response.daftarpembayarannontunai[0].dataquery[i].PAJAKTRANSFER;
                } else {
                    totaladmin = response.daftarpembayarannontunai[0].dataquery[i].PAJAKTRANSFER;
                }
                let adminDisplay = "";
                if (parseFloat(totaladmin) >= 1 && parseFloat(totaladmin) < 99) {
                    adminDisplay = totaladmin + "%";
                } else {
                    adminDisplay = "Rp " + parseFloat(totaladmin).toLocaleString("id-ID");
                }

               htmlnya += `
                <div onclick="pilihbankterpilih(
                    '${kondisi}',
                    '${response.daftarpembayarannontunai[0].dataquery[i].BANK_ID}',
                    '${response.daftarpembayarannontunai[0].dataquery[i].PAJAKDEBIT}',
                    '${response.daftarpembayarannontunai[0].dataquery[i].PAJAKKREDIT}',
                    '${response.daftarpembayarannontunai[0].dataquery[i].PAJAKTRANSFER}',
                    this.closest('.row').id,
                    'click'
                )" style="cursor:pointer" class="card mt-1 mx-auto">
                    <div class="card-body">
                        <h5 class="text-center card-title">
                            ${response.daftarpembayarannontunai[0].dataquery[i].NAMABANK} [${adminDisplay}]
                        </h5>
                        <a id="btnpilihbankcss${kondisi}${response.daftarpembayarannontunai[0].dataquery[i].BANK_ID}"  
                        onclick="pilihbankterpilih(
                            '${kondisi}',
                            '${response.daftarpembayarannontunai[0].dataquery[i].BANK_ID}',
                            '${response.daftarpembayarannontunai[0].dataquery[i].PAJAKDEBIT}',
                            '${response.daftarpembayarannontunai[0].dataquery[i].PAJAKKREDIT}',
                            '${response.daftarpembayarannontunai[0].dataquery[i].PAJAKTRANSFER}',
                            this.closest('.row').id,
                            'click'
                        )" href="javascript:void(0)" 
                        class="butonbank${kondisi} btn btn-primary btn-block">Pilih Bank Ini</a>
                    </div>
                </div>`;

            }            
            htmlnya += '</div>'
            if (kondisi == "D"){
                $("#daftarbankdebit").append(htmlnya)
                if ($("#pilihbankdebitdaftar").is(':visible')){
                    if (iseditkasir == "true" && nomorkartudebit.getNumber() > 0){
                        $("#pilihbankdebitdaftar").show();
                    }else{
                        $("#pilihbankdebitdaftar").hide();
                        $(".butonbank"+kondisi).css({"color": "","background-color": "","border-color": ""});
                    }
                }else{
                    $("#pilihbankdebitdaftar").show();
                }
            }else if (kondisi == "K"){
                $("#daftarbankkredit").append(htmlnya)
                if ($("#pilihbankkreditdaftar").is(':visible')){
                    if (iseditkasir == "true" && nomorkartukredit.getNumber() > 0){
                        $("#pilihbankkreditdaftar").show();
                    }else{
                        $("#pilihbankkreditdaftar").hide();
                        $(".butonbank"+kondisi).css({"color": "","background-color": "","border-color": ""});
                    }
                }else{
                    $("#pilihbankkreditdaftar").show();
                }
            }else if (kondisi == "T"){
                $("#daftarbanktransfer").append(htmlnya)
                if ($("#pilihbanktransferdaftar").is(':visible')){
                    if (iseditkasir == "true" && nominaltransfer.getNumber() > 0){
                        $("#pilihbanktransferdaftar").show();
                    }else{
                        $("#pilihbanktransferdaftar").hide();
                        $(".butonbank"+kondisi).css({"color": "","background-color": "","border-color": ""});
                    }
                }else{
                    $("#pilihbanktransferdaftar").show();
                }
            }else{
                $("#daftaremoney").append(htmlnya)
                if ($("#pilihemoneyaftar").is(':visible')){
                    if (iseditkasir == "true" && nominalemoney.getNumber() > 0){
                        $("#pilihemoneyaftar").show();
                    }else{
                        $("#pilihemoneyaftar").hide();
                        $(".butonbank"+kondisi).css({"color": "","background-color": "","border-color": ""});
                    }
                }else{
                    $("#pilihemoneyaftar").show();
                }
            }
        }
    });
}
function daftarpenjualan(){
    $("#daftarpenjualan").on('shown.bs.modal', function(){
        setTimeout(function (){
            $('#kasir_daftarpenjualan').DataTable().ajax.reload();
            $("#txtpencariannota").focus();
        }, 100);
    }).modal('show');

}
function pilihbanktransfer(){
    pilihbank("T","B");
}
function pilihbankdebit(){
    pilihbank("D","B")
}
function pilihbankkredit(){
    pilihbank("K","B")
}
function pilihemoney(){
    pilihbank("E","E")
}
function pilihbankterpilih(kondisi, bankterpilih, pajakdebit, pajakkredit, pajaktransfer, elementid, aksiuser) {
    let totalbelanjasetelahadmin = 0,totalbelanjasebelumadmin =0;
    if (kondisi == "D"){
        $("#idkartudebit").html(bankterpilih);
    }else if(kondisi == "K"){
        $("#idkartukredit").html(bankterpilih);
    }else if(kondisi == "T"){
        $("#idtransfer").html(bankterpilih);
    }else{
        $("#idemoney").html(bankterpilih);
    }
    $(".butonbank"+kondisi).css({"color": "","background-color": "","border-color": ""});
    $("#btnpilihbankcss"+kondisi+bankterpilih).css({"color": "","background-color": "red","border-color": ""});
    totalbelanjasebelumadmin = Number(
        $('#totalbelanjaatas').html()
            .replace('Rp&nbsp;', '')
            .replaceAll('.', '')
            .replace(',', '.')
            .trim()
    );
    let pajak = 0;
    if (kondisi == "D") pajak = parseFloat(pajakdebit);
    else if (kondisi == "K") pajak = parseFloat(pajakkredit);
    else if (kondisi == "T") pajak = parseFloat(pajaktransfer);
    else pajak = parseFloat(pajaktransfer);

    let totaladmin = 0;
    if (pajak > 0 && pajak < 99) {
        totaladmin = (totalbelanjasebelumadmin * pajak) / 100;
    } else if (pajak >= 99) {
        totaladmin = pajak;
    }
    if (iseditkasir == "true"){
        if (aksiuser == "click"){
            totalbelanjasetelahadmin = totalbelanjasebelumadmin + totaladmin;
        }else{
            totalbelanjasetelahadmin = totalbelanjadatabase;
        }
    }else{
        totalbelanjasetelahadmin = totalbelanjasebelumadmin + totaladmin;
    }
    $("#totalbelanjakonfirmasi").html(formatuang(totalbelanjasetelahadmin,'id-ID','IDR'));
    if (jenistransaksienum === "KARTU") {
        showOnlyJenisBank(elementid)
        if (kondisi == "T") {
            nominaltransfer.set(totalbelanjasetelahadmin);
            nomorkartudebit.set(0);
            nomorkartukredit.set(0);
            nominalemoney.set(0);
            nominaltotalbayar.set(totalbelanjasetelahadmin);
            nominalkembalian.set(0);
            return;
        }
        if (kondisi == "D") {
            nominaltransfer.set(0);
            nomorkartudebit.set(totalbelanjasetelahadmin);
            nomorkartukredit.set(0);
            nominalemoney.set(0);
            nominaltotalbayar.set(totalbelanjasetelahadmin);
            nominalkembalian.set(0);
            return;
        }
        if (kondisi == "K") {
            nominaltransfer.set(0);
            nomorkartudebit.set(0);
            nomorkartukredit.set(totalbelanjasetelahadmin);
            nominalemoney.set(0);
            nominaltotalbayar.set(totalbelanjasetelahadmin);
            nominalkembalian.set(0);
            return;
        }
        nominaltransfer.set(0);
        nomorkartudebit.set(0);
        nomorkartukredit.set(0);
        nominalemoney.set(totalbelanjasetelahadmin);
        nominaltotalbayar.set(totalbelanjasetelahadmin);
        nominalkembalian.set(0);
        return;
    }
    if (jenistransaksienum === "SPLITCASH") {
        
    }
}


$("#txtpencariannota, #tanggalawalnota, #tanggalakhirnota").on('input change', debounce(function (e) {
    $('#kasir_daftarpenjualan').DataTable().ajax.reload();
}, 300));
$("#filtertanggalreservasiawal, #filtertanggalreservasiakhir").on('input change', debounce(function (e) {
    $('#tabel_pesanananmeja_kasir').DataTable().ajax.reload();
}, 300));
$("#txtpencariannotapending").on('input change', debounce(function (e) {
    let keyword = $(this).val().toLowerCase();
    let data = generatePendingSummary().filter(item => 
        item.KETERANGANTRX.toLowerCase().includes(keyword)
    );
    tablePending.clear().rows.add(data).draw();
}, 300));
$("#icon1").on("click", function () {
    $("#katakuncipencariankasir").val("22000000"); 
    $('#katakuncipencariankasir').trigger($.Event('keydown', { key: 'Enter', keyCode: 13 }));
});
$("#icon2").on("click", function () {
    $("#katakuncipencariankasir").val("V-PC10174184101820010101"); 
    $('#katakuncipencariankasir').trigger($.Event('keydown', { key: 'Enter', keyCode: 13 }));
});
$("#icon3").on("click", function () {
    $("#katakuncipencariankasir").val("A-18011418010101"); 
    $('#katakuncipencariankasir').trigger($.Event('keydown', { key: 'Enter', keyCode: 13 }));
});
function modalinfobarang(kodebarang, hargajual, catatanperbarang, hargajualstak, statusitem, namabarang, potonganperbarang){
    Swal.fire({
        title: "Konfirmasi Ubah Data",
        text: "Masukkan PIN untuk mengubah data barang : " + namabarang,
        input: "password",
        inputLabel: "Konfirmasi PIN",
        inputPlaceholder: "Masukkan PIN",
        inputAttributes: {
            autocapitalize: "off",
            autocorrect: "off"
        },
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Lihat Informasi",
        cancelButtonText: "Batalkan",
        preConfirm: (password) => {
            if (!password) {
                Swal.showValidationMessage("PIN tidak boleh kosong.");
            }
            return password;
        }
    }).then(function (result) {
        if (result.isConfirmed) {
            $.ajax({
                url: baseurljavascript + 'penjualan/bacapassword',
                method: 'POST',
                dataType: 'json',
                data: {
                    KATASANDI : result.value,
                },
                success: function (response) {
                    if (response.success) {
                        let htmlnya = "";
                        if (statusitem != 0){
                            return Swal.fire({
                                title: "Permintaan Proses Ditolak",
                                text: "Kami mohon maaf untuk menolak permintaan anda. Karena item sudah dalam STATUS PROSES.",
                                icon: 'error',
                            });
                        }
                        $("#pilihanvariansebelumnya").html($("#varian"+kodebarang).html())
                        $.ajax({
                            url: baseurljavascript + 'penjualan/detailbarangkeranjang',
                            method: 'POST',
                            dataType: 'json',
                            data: {
                                BARANG_ID : kodebarang
                            },
                            success: function (response) {
                                jsonStrjenisvarian = '{"jenisvarian":[]}';
                                hasilhargabaru = 0;
                                htmlnya = "<div class=\"row\"><div class=\"col\">";
                                if (response[0].dataquery[0].NAMATAMBAHAN != null){
                                    for (let i = 0; i < response[0].totaldata; i++) {
                                        htmlnya += "<button id=\""+response[0].dataquery[i].NAMATAMBAHAN.toLowerCase().replace(/\s/g, '')+"\" onclick=\"ubahhargajual('"+response[0].dataquery[i].HARGATAMBAHAN+"','"+response[0].dataquery[i].NAMATAMBAHAN+"',"+this.id+")\" style=\"font-size: 18px;\" class=\"btn btn-primary btn-block\">"+response[0].dataquery[i].NAMATAMBAHAN+" +"+formatuang(response[0].dataquery[i].HARGATAMBAHAN,'id-ID','IDR')+"</button>";
                                    }
                                }else{
                                    htmlnya += "<p style=\"font-size:15px\">Tidak Ada Varian Yang Tersedia Dalam "+response[0].dataquery[0].NAMABARANG+"</p>";
                                }
                                htmlnya += "</div></div>";
                                $("#detailvarianbarang").html("");
                                $("#detailvarianbarang").append(htmlnya);
                                $("#juduldetailbarang").html(response[0].dataquery[0].NAMABARANG);
                                $("#kodebarangv").val(kodebarang);
                                $("#namabarangv").val(response[0].dataquery[0].NAMABARANG);
                                hargajualv.set($("#hargajual"+kodebarang).html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim());
                                hargajualasliv.set((hargajual == 0 ? hargajualstak : hargajual ));
                                nominalhargajualvstak.set(hargajualstak)
                                qtyv.set($("#barangkeluarqty"+kodebarang).val());
                                potonganbarang.set(potonganperbarang);
                                $("#hargajualbarudetail").html(formatuang(hargajualv,'id-ID','IDR'));
                                $('#catatanperbarang').val((catatanperbarang == "" ? "" : catatanperbarang )),
                                $("#modaldetailbarang").modal('show');
                            }
                        }); 
                    }else{
                        return toastr["error"]("PIN yang anda masukkan tidak cocok dengan database kami. Silahkan coba lagi");
                    }
                }
            });
        }
    });
}
$('#hargajualv, #catatanperbarang, #potonganbarang').on('keypress', debounce(function (e) {
    jsonStrjenisvarian = '{"jenisvarian":[]}';
    hargajualasliv.set(hargajualv.getNumber())
    $("#hargajualbarudetail").html(formatuang(hargajualv.getNumber(),'id-ID','IDR'));
    $("#potongan_"+$("#kodebarangv").val()).html(formatuang(potonganbarang.getNumber(),'id-ID','IDR'));
    $("#potongan"+$("#kodebarangv").val()).html(potonganbarang.getNumber());
    hasilhargabaru = hargajualv.getNumber();
    $("#keterangantiapbarang"+$("#kodebarangv").val()).html($('#catatanperbarang').val())
    ubahhargajual(0,"",this.id, potonganbarang.getNumber());
}, 300));

function ubahhargajual(tambahanharga, namavarian, idElement, potonganharga) {
    let paksaupdatehj = $("#paksaubah").is(':checked') ? 1 : 0;
    let obj = JSON.parse(jsonStrjenisvarian);
    let kodeBarang = $("#kodebarangv").val();
    let qty = qtyv.getNumber();
    let hargaJualDasar = hargajualv.getNumber();
    let hargaAsli = hargajualasliv.getNumber();
    let totalHarga = 0,hasilhargabaru = 0;

    // Ambil keranjang awal dari localStorage
    let keranjang = JSON.parse(localStorage.getItem('keranjangbelanja')) || {};

    if (tambahanharga > 0) {
        swal.fire({
            title: "Konfirmasi Informasi Varian",
            text: "Apakah anda ingin menambahkan atau membatalkan varian " + namavarian,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Tambahkan Varian",
            cancelButtonText: "Batalkan Varian",
        }).then(function (result) {
            if (result.isConfirmed) {
                if (hasilhargabaru <= hargaJualDasar) {
                    hasilhargabaru = hargaJualDasar;
                }
                obj['jenisvarian'].push({ namavarian: namavarian, hargavarian: tambahanharga, qty: 1 });
                hasilhargabaru += Number(tambahanharga);
            } else {
                obj['jenisvarian'].push({ namavarian: namavarian, hargavarian: tambahanharga, qty: -1 });
                if (hasilhargabaru > hargaJualDasar) {
                    hasilhargabaru -= Number(tambahanharga);
                }
            }

            // Gabungkan varian yang sama, hapus yang qty 0
            let output = _(obj['jenisvarian'])
                .groupBy('namavarian')
                .map((objs, key) => ({
                    namavarian: key,
                    hargavarian: tambahanharga, // asumsi harganya sama
                    qty: _.sumBy(objs, 'qty')
                }))
                .filter(o => o.qty > 0)
                .value();

            jsonStrjenisvarian = JSON.stringify({ jenisvarian: output });

            // Tampilkan kembali varian
            let namavariannya = "";
            output.forEach((v) => {
                namavariannya += `${v.namavarian} (${v.qty}x), `;
            });

            // Hitung total harga
            totalHarga = hasilhargabaru - potonganharga;

            // Update tampilan
            $("#subtotalbarang" + kodeBarang).html(formatter.format(qty * totalHarga));
            $("#hargajual" + kodeBarang).html(formatter.format(totalHarga));
            $("#hargajualbarudetail").html(formatuang(totalHarga, 'id-ID', 'IDR'));
            $("#jsonjenisvarian" + kodeBarang).html(jsonStrjenisvarian);
            $("#varian" + kodeBarang).html(namavariannya);
            $("#hargajualubah" + kodeBarang).html(hargaAsli);
        });
    } else {
        // Jika tidak ada varian tambahan
        let objjsonStrjenisvarian = JSON.parse(jsonStrjenisvarian);
        let namavariannya = "";

        Object.entries(objjsonStrjenisvarian).forEach(([key, value]) => {
            value.forEach((variandetail) => {
                namavariannya += `${variandetail.namavarian} (${variandetail.qty}x), `;
            });
        });
        totalHarga = (qty * hargaJualDasar) - potonganharga;
        // Update tampilan
        $("#subtotalbarang" + kodeBarang).html(formatter.format(totalHarga));
        $("#hargajual" + kodeBarang).html(formatter.format(hargaJualDasar)); // harga per unit
        $("#hargajualbarudetail").html(formatuang(totalHarga, 'id-ID', 'IDR'));
        $("#jsonjenisvarian" + kodeBarang).html(jsonStrjenisvarian);
        $("#varian" + kodeBarang).html(namavariannya);
        $("#hargajualubah" + kodeBarang).html((hargaAsli * qty) - potonganharga);
    }
    let dataLama = keranjang[kodeBarang] || {}; // ambil data lama kalau ada

    // hanya update field yang perlu diubah
    dataLama.QTY = qty;
    dataLama.QTY_LABEL = qty;
    dataLama.HARGA_JUAL = parseFloat(hargaJualDasar).toFixed(2);
    dataLama.HARGAASLI = parseFloat(hargaAsli).toFixed(2);
    dataLama.POTONGAN = parseFloat(potonganharga).toFixed(2);
    dataLama.JSONTAMBAHAN = jsonStrjenisvarian;
    
    // simpan kembali ke keranjang
    keranjang[kodeBarang] = dataLama;
    
    // simpan ke localStorage
    localStorage.setItem('keranjangbelanja', JSON.stringify(keranjang));
    grandtotalkasir();
}

function hitungpotongan(){
    let totalbelanjaatas = Number($("#totalbelanjaatas").html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim())
    nominalpajaktoko.set(0)
    nominalpajaknegara.set(0)
    $("#grandtotal").html(formatuang(totalbelanjaatas - nominalpotongan.getNumber(),'id-ID','IDR'))
}
function hitungpajak(jenis){    
    let totalbelanjatasnya = Number($('#totalbelanjaatas').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim())
    if (jenis == "manualtoko"){
        if (nominalpajaktoko.getNumber() < 100){
            nominalpajaktoko.set((totalbelanjatasnya - nominalpotongan.getNumber()) * (nominalpajaktoko.getNumber() / 100));
        }else{
            nominalpajaktoko.set(nominalpajaktoko.getNumber());
        }
        nominalpajaknegara.set(0)
    }else if (jenis == "manualnegara"){
         if (nominalpajaknegara.getNumber() < 100){
            nominalpajaknegara.set((totalbelanjatasnya - nominalpotongan.getNumber() - nominalpajaktoko.getNumber()) * (nominalpajaknegara.getNumber() / 100));
        }else{
            nominalpajaknegara.set(nominalpajaknegara.getNumber());
        }
    }else if (jenis == "toko"){
        nominalpajaktoko.set((totalbelanjatasnya - nominalpotongan.getNumber()) * (pajaktoko / 100));
        nominalpajaknegara.set(0)
    }else if(jenis == "negara"){
        nominalpajaknegara.set((totalbelanjatasnya - nominalpotongan.getNumber() - nominalpajaktoko.getNumber()) * (pajaknegara / 100));
    }
    $("#grandtotal").html(formatuang(totalbelanjatasnya - nominalpotongan.getNumber() + nominalpajaktoko.getNumber() + nominalpajaknegara.getNumber(),'id-ID','IDR'))
}
function batalkanmodal(){
    let pesanpembatalan = "";
    if (tipeordernya == 1){
        pesanpembatalan = "Apakah anda yakin ingin membatalkan reservasi meja atas Nama: "+$('#namapemesan_rev').val()+" dengan Kode:"+$('#kodepesan_rev').val();
    }
    swal.fire({
        title: "Formulir Pembatalan!!",
        icon: 'warning',
        text: pesanpembatalan,
        //imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzhiMTE3M2RjM2U1ZWI3OWFjMjVjYjUxZjI4NjZhYTk2NzZiNmNiZCZjdD1z/jn27S7H3ARZVHex8z6/giphy.gif',
        //imageHeight: 150,
        showCancelButton:true,
        confirmButtonText: "Oke, Batalkan",
        cancelButtonText: "Tunggu Sebentar!",
    }).then(function(result){
        if(result.isConfirmed){
            bersihkanformmodal();
        }
    })   
}
function bersihkanformmodal(){
    tipeordernya = 0;
    $("#iconresrvasi").css({'color':'black'});
    $("#icondinein").css({'color':'black'});
    $("#modalreservation").modal('hide');
    $('#titlekasir').html("KOTAK CANTIK STORE");
    $('#berapaorang_rev').val("");
    $('#namapemesan_rev').val("");
    $('#notelp_rev').val("");
    $('#kodemejaterpilih_rev').val("");
    $('#keterangantransaksi').val("")
    $('#tanggalawal_rev').val(moment().format('DD-MM-YYYY'));
    $("#tanggalawal_rev").datepicker({todayHighlight: true,format:'dd-mm-yyyy',});
    $('#tanggalakhir_rev').val(moment().format('DD-MM-YYYY'));
    $("#tanggalakhir_rev").datepicker({todayHighlight: true,format:'dd-mm-yyyy',});
    $('#waktuawal_rev').clockTimePicker();
    $('#waktuselesai_rev').clockTimePicker();
    $('#waktuawal_rev').clockTimePicker('value', moment().format('HH:mm'));
    $('#waktuselesai_rev').clockTimePicker('value', moment().add(3, 'hours').format('HH:mm'));
}
function konfirmasipesananmeja(){
    if ($("#berapaorang_rev").val() == "" || $("#namapemesan_rev").val() == "" || $("#notelp_rev").val() == "" || $("#kodemejaterpilih_rev").val() == ""){
        return Swal.fire({
            title: "Terjadi Kesalahan",
            text: "Silahkan isikan formulir pesanan dengan benar seperti BERAPA ORANG, NAMA PEMESAN, NOTELEPON, LOKASI MEJA",
            icon: 'error',
        });
    }
    swal.fire({
        title: "Formulir Konfirmasi!!",
        icon: 'question',
        text: "Apakah anda yakin dengan pemesanan tempat ini ? Silahkan masukan menu untuk dipesan",
        showCancelButton:true,
        confirmButtonText: "Oke, Catat",
        cancelButtonText: "Tunggu Sebentar!",
    }).then(function(result){
        if(result.isConfirmed){
            $("#modalreservation").modal('hide');
            pilihbarang("ACI100000100000001", "TIKET PEMESANAN "+$("#namapemesan_rev").val()+" "+$("#kodemenupesan_rev").val(), dp_rev.getNumber(), "0", "9", "0", false, false, "DAPAT MINUS", 0, "0", 0, 0, "JASA", "PCS")
        }
    })   
}
function getresolusikasir(){
    if($(window).width() < 1600){
        if ($("body").hasClass("chat-contact-desktop-show")){
            $(".daftarkeranjangkatalog").removeClass("col-md-6");
            $(".daftarkeranjangkatalog").addClass("col-md-4");
        }else{
            $(".daftarkeranjangkatalog").removeClass("col-md-4");
            $(".daftarkeranjangkatalog").addClass("col-md-6");
        }
    }else{
        if ($("body").hasClass("chat-contact-desktop-show")){
            $(".daftarkeranjangkatalog").removeClass("col-md-4");
            $(".daftarkeranjangkatalog").addClass("col-md-3");
        }else{
            $(".daftarkeranjangkatalog").removeClass("col-md-3");
            $(".daftarkeranjangkatalog").addClass("col-md-4");
        }
    }
}
$("#buttonkiri").click(function() {
    getresolusikasir()
});
socketIo.on("callbackduitku", function (data) {
    /*   00 - Success    01 - Pending    02 - Canceled   */
    if (data.response_code == "00"){
        if (data.no_transaksi === $("#notakasirpenjualan").html()){
            toastr["success"]("Transaksi Terbayarkan Pada Payment Gateway");
            $("#labelscanqris,#qrcodeclosepayment,#btncektransaksipayment,#durasiscanqris").hide()
            $("#btnsimpanpaygateway").html("[F6] Buat Trx QRIS");
            $("#btnsimpanpaygateway").prop('disabled', false);
            $("#qrcodeclosepayment").html('');
            $("#kartu").prop("checked", true);
            $("#kartu").trigger("change");
            nominalemoney.set(ktotalbelanja);
            $('#idemoney').html('QRISD');
            proseskonfirmasipembelian(1);
        }
    }else if (data.response_code == "01"){
        toastr["info"]("Informasi Transaksi Pending Pada Payment Gateway");
    }else if (data.response_code == "02"){
        toastr["error"]("Informasi Transaksi Batal Pada Payment Gateway");
    }
});
function cetakklerekasir(){
    swal.fire({
        title: "Cetak Rangkuman Pendapatan Kasir ?",
        text: "Apakah anda ingin mencetak rangkuman pendapatan kasir hari ini ? Mudah-mudahan tidak minus ya?",
        icon: "question",
        showCancelButton:true,
        confirmButtonText: "Cetak Rangkuman",
        cancelButtonText: "Gak Jadi Ah!",
    }).then(function(result){
        if(result.isConfirmed){
            $.ajax({
            url: baseurljavascript + 'penjualan/cetakrangkumanpenjualan',
            method: 'POST',
            dataType: 'json',
            data: {
                TANGGALAWAL: $("#tanggalawalnota").val().split("-").reverse().join("-"),
                TANGGALAKHIR: $("#tanggalakhirnota").val().split("-").reverse().join("-"),
                KODESOCKETPRINT : "RANGKUMAN_"+localStorage.getItem("KODESOCKETPRINTER"),
            },
            success: function (response) {
            }
        });  
        }
    })
}
$('#cetak_penjualan_hari_ini').on('click', function() {
    cetakklerekasir();
});