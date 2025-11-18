/* algoritma tambah item atau barang */
$("#btn_simpan_tambahitem").click(function () {
    if ($("#namabarang").val() == "" || $("#kodebarang").val() == "") {
        return Swal.fire({
            position: 'bottom-end',
            icon: 'warning',
            title: 'Pastikan NAMA BARANG dan KODEBARANG sudah diisi untuk disimpan, karena diwajibkan oleh sistem',
            showConfirmButton: false,
            toast: true,
            timer: 1500
        });
    }
    Swal.fire({
        title: 'Apakah anda yakin?',
        text: $('#isinsert').is(":checked") == false ? 'Apakah anda ingin mengubah data ' + $("#namabarang").val() : 'Informasi barang ' + $("#namabarang").val() + ' akan ditambahkan ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $('#isinsert').is(":checked") == false ? 'Oke, Ubah Data' : 'Oke, Tambah Item!'
    }).then((result) => {
        $("#btn_simpan_tambahitem").html("<i class=\"fas fa-save\"></i> Sedang Proses");
        $("#btn_simpan_tambahitem").prop('disabled', true);
        if (result.isConfirmed) {
            if ($('input[name="rb_statusbarangtambahitem"]:checked').val() == 1) {
                statusbarang = 1;
            } else {
                statusbarang = 0;
            }
            let arrayqueryhargagrosir = [];
            let datahargagrosir = $('#tabelhargagrosir').DataTable().rows().data();
            datahargagrosir.each(function (isidatatable, index) {
                var temp = new Array();
                temp = isidatatable.toString().split(",");
                arrayqueryhargagrosir.push($("#kodebarang").val() + "," + datahargagrosir.cell(index, 1).nodes().to$().find('input').val() + "," + datahargagrosir.cell(index, 2).nodes().to$().find('input').val() + "," + $("#hargapokokpembelian").val() + ",PCS");
            });
            let arrayquerybarangtambahan = [];
            let databarangtambahan = $('#tabelbarangtambahan').DataTable().rows().data();
            databarangtambahan.each(function (isidatatable, index) {
                var temp = new Array();
                temp = isidatatable.toString().split(",");
                arrayquerybarangtambahan.push(databarangtambahan.cell(index, 0).nodes().to$().find('input').val() + "," + databarangtambahan.cell(index, 1).nodes().to$().find('input').val());
            });
            $.ajax({
                url: baseurljavascript + 'masterdata/tambahitemajax',
                method: 'POST',
                dataType: 'json',
                data: {
                    ISINSERT: $('#isinsert').is(":checked"),
                    BARANG_ID: $("#kodebarang").val(),
                    QRCODE_ID: $("#kodebarangqrcode").val(),
                    NAMABARANG: $("#namabarang").val(),
                    BERAT_BARANG: beratbarang.getNumber(),
                    PARETO_ID: $("#pilihprincipal").val(),
                    SUPPLER_ID: $("#pilihsuplier").val(),
                    KATEGORI_ID: $("#pilihkategori").val(),
                    BRAND_ID: $("#pilihbrand").val(),
                    KETERANGANBARANG: (dariPembelian == 1 ? "" : quillHtml.root.innerHTML),
                    HARGABELI: hargapokokpembelian.getNumber(),
                    HARGAJUAL: hargajualumum.getNumber(),
                    SATUAN: $("#pilihsatuan").val(),
                    AKTIF: statusbarang,
                    KODEUNIKMEMBER: session_kodeunikmember,
                    APAKAHGROSIR: $('#aktifbaranggrosir').is(":checked"),
                    STOKDAPATMINUS: $('#stokdapatminus').is(":checked"),
                    JENISBARANG: $('#barangbukanstok').is(":checked") == true ? 1 : 0,
                    PEMILIK: $("#pilihperusahaan").val(),
                    /*untuk bestbuy harga gorsir*/
                    ISHARGAGROSIRAKTIF: $('#aktifbaranggrosir').is(":checked"),
                    JSONHARGAGROSIR: arrayqueryhargagrosir,
                    /*untuk bestbuy harga gorsir*/
                    ISBARANGTAMBAHAN: $('#aktifkanbarangtambahan').is(":checked"),
                    JSONBARANGTAMBAHAN: arrayquerybarangtambahan,
                    IZINKAN_JUAL_DIBAWAH_HPP: $('#izinkan_jual_dibawah_hpp').is(":checked"),
                    DARIPEMBELIAN: dariPembelian,
                },
                complete: function () {
                    $("#btn_simpan_tambahitem").prop('disabled', false);
                    $("#btn_simpan_tambahitem").html("<i class=\"fas fa-save\"></i> Simpan");
                },
                success: function (response) {
                    if (response.success == "true") {
                        if (dariPembelian == 1){
                            return swal.fire({
                                title: "Berhasil.. Horee!",
                                text: "Informasi berhasil disimpan di database beserta informasi pada Master Item",
                                icon: "success",
                            })
                        }
                        swal.fire({
                            title: "Berhasil.. Horee!",
                            text: "Informasi berhasil disimpan di database. Apakah anda ingin mengubah data lagi",
                            icon: "success",
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: "Oke, Lanjut!",
                            cancelButtonText: "Kembali Ke Daftar!",
                        }).then(function (result) {
                            if (result.isConfirmed) { } else {
                                location.href = baseurljavascript + "/masterdata/daftaritem";
                            }
                        })
                    } else {
                        Swal.fire(
                            'Gagal Pembaruan Informasi!',
                            response.msg,
                            'error'
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
$('#bonusbarangitem').on('click', '.hapusbonusbarang', function () {
    let table = $('#bonusbarangitem').DataTable();
    let row = $(this).parents('tr');
    if ($(row).hasClass('child')) {
        table.row($(row).prev('tr')).remove().draw();
    } else {
        table.row($(this).parents('tr')).remove().draw();
    }
});
/* algoritma master item bonus barang area */
$("#belixgratisx").change(function() {
    if(this.checked) {
        if ($("#kodebarang").val().length === 0){
            Swal.fire({
                position: 'bottom-end',
                icon: 'warning',
                title: 'Pastikan KODEITEM sudah diisi untuk mengaktifkan fitur ini',
                showConfirmButton: false,
                toast:true,
                timer: 1500
            })
            $('#belixgratisx').prop('checked', false);
        }
    }
});
/* batas akhir algoritma master item bonus barang area */
$("#belixgratisabc").change(function() {
    if(this.checked) {
        if ($("#kodebarang").val().length === 0){
            Swal.fire({
                position: 'bottom-end',
                icon: 'warning',
                title: 'Pastikan KODEITEM sudah diisi untuk mengaktifkan fitur ini',
                showConfirmButton: false,
                toast:true,
                timer: 1500
            })
            $('#belixgratisabc').prop('checked', false);
            $("#bonusbarang").prop('disabled', true);
        }else{
            $("#bonusbarang").prop('disabled', false);
        }
    }else{
        $("#bonusbarang").prop('disabled', true);
    }
});
$('#tabelhargagrosir').on('click', '.hapushargagrosir', function () {
    var table = $('#tabelhargagrosir').DataTable();
    var row = $(this).parents('tr');
    if ($(row).hasClass('child')) {
        table.row($(row).prev('tr')).remove().draw();
    } else {
        table.row($(this).parents('tr')).remove().draw();
    }
});
/* batas akhir algoritma master item harga grosir */
$("#tambahbarangbonus").on("click", function () {
    $('#tabelhargagrosir').DataTable().row.add([
        $("#namabarang").val(),
        "<input name=\"bonusitem[]\" class=\"grosirqty form-control\" type=\"text\" value=\"1\">",
        "<input name=\"bonusitem[]\" class=\"grosirqtyharga form-control\" type=\"text\" value=\"1\">",
        "<div><button class=\"hapushargagrosir btn btn-danger\"><i class=\"fas fa-trash\"></i> Hapus</button></div>",
    ]).draw(false);
});
$("#aktifbaranggrosir").change(function() {
    if(this.checked) {
        if ($("#kodebarang").val().length === 0 || $("#namabarang").val().length === 0){
            Swal.fire({
                position: 'bottom-end',
                icon: 'warning',
                title: 'Pastikan KODEITEM dan NAMABARANG sudah diisi untuk mengaktifkan fitur ini',
                showConfirmButton: false,
                toast:true,
                timer: 1500
            })
            $('#aktifbaranggrosir').prop('checked', false);
            $("#tambahbarangbonus").prop('disabled', true);
        }else{
            $("#tambahbarangbonus").prop('disabled', false);
        }
    }else{
        $("#tambahbarangbonus").prop('disabled', true);
    }
});
$("#aktifkanbarangtambahan").change(function() {
    if(this.checked) {
        if ($("#kodebarang").val().length === 0 || $("#namabarang").val().length === 0){
            Swal.fire({
                position: 'bottom-end',
                icon: 'warning',
                title: 'Pastikan KODEITEM dan NAMABARANG sudah diisi untuk mengaktifkan fitur ini',
                showConfirmButton: false,
                toast:true,
                timer: 1500
            })
            $('#aktifkanbarangtambahan').prop('checked', false);
            $("#barangtambahan").prop('disabled', true);
        }else{
            $("#barangtambahan").prop('disabled', false);
        }
    }else{
        $("#barangtambahan").prop('disabled', true);
    }
});
$('#tabelbarangtambahan').on('click', '.hapusbarangtambahan', function () {
    var table = $('#tabelbarangtambahan').DataTable();
    var row = $(this).parents('tr');
    if ($(row).hasClass('child')) {
        table.row($(row).prev('tr')).remove().draw();
    } else {
        table.row($(this).parents('tr')).remove().draw();
    }
});
$("#barangtambahan").on("click", function () {
    $('#tabelbarangtambahan').DataTable().row.add([
        "<input name=\"namatambahan[]\" class=\"namatambahan form-control\" type=\"text\" value=\"\" placeholder=\"Silahkan Tentukan Nama\">",
        "<input name=\"bonusitem[]\" class=\"tambahanqtyharga form-control\" type=\"text\" value=\"0\">",
        "<div><button class=\"hapusbarangtambahan btn btn-danger\"><i class=\"fas fa-trash\"></i> Hapus</button></div>",
    ]).draw(false);
});
/* batas akhir algoritma master item voucher barang */
$("#tab_voucherbarang").on("click", function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        let target = $(e.target).attr("href")
        if (target == "#nav1-voucher"){
            $("#btn_simpan_tambahitem").prop('disabled', true);
        }else{
            $("#btn_simpan_tambahitem").prop('disabled', false);
        }
    });
});
$("#aktifvoucherbarnag").change(function() {
    if(this.checked) {
        if ($("#kodebarang").val().length === 0){
            Swal.fire({
                position: 'bottom-end',
                icon: 'warning',
                title: 'Pastikan KODEITEM sudah diisi untuk mengaktifkan fitur ini',
                showConfirmButton: false,
                toast:true,
                timer: 1500
            })
            $('#aktifvoucherbarnag').prop('checked', false);
            $("#tambahbarisvoucher").prop('disabled', true);
        }else{
            $("#tambahbarisvoucher").prop('disabled', false);
        }
    }else{
        $("#tambahbarisvoucher").prop('disabled', true);
    }
});
$("#nav1grosirdanvoucher").on("click", function () {
    $('#nav1-tabvouchergrosir a[href="#nav1-grosir"]').tab('show')
    $("#tab_baranggrosir").addClass("active");
    $("#tab_voucherbarang").removeClass("active");
});