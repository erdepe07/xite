<link rel="stylesheet" href="https://cdn.datatables.net/keytable/2.12.0/css/keyTable.dataTables.min.css">

<!-- BEGIN Modal -->
<div class="modal fade" id="modal6">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Silahkan Pilih Item</h5>
                <button type="button" class="btn btn-label-danger btn-icon" data-dismiss="modal">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <input name="daftaritem_katakunci" type="text" class="form-control mb-2 mt-2" id="daftaritem_katakunci_panggil" placeholder="Masukan kata kunci yang anda inginkan">
                <div class="d-flex justify-content-start align-items-center">
                    <div class="custom-control custom-checkbox mr-4">
                        <input type="checkbox" class="custom-control-input" id="stokhanyadisplay">
                        <label class="custom-control-label" for="stokhanyadisplay">Stok Display</label>
                    </div>

                    <div class="custom-control custom-checkbox mr-4">
                        <input type="checkbox" class="custom-control-input" id="stokhanyagudang">
                        <label class="custom-control-label" for="stokhanyagudang">Stok Gudang</label>
                    </div>

                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="stokhanyaretur">
                        <label class="custom-control-label" for="stokhanyaretur">Stok Retur</label>
                    </div>
                </div>
                <hr>
                <!-- BEGIN Datatable -->
                <table id="pangil_daftarabarang" class="dataTable table table-bordered table-striped table-hover nowrap">
                    <thead>
                        <tr>
                            <th align="center">Aksi</th>
                            <th align="center">Kode Item</th>
                            <th align="center">Nama Item</th>
                            <th align="center">Harga Jual</th>
                            <th align="center">Stok Tersedia</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th align="center">Aksi</th>
                            <th align="center">Kode Item</th>
                            <th align="center">Nama Item</th>
                            <th align="center">Harga Jual</th>
                            <th align="center">Stok Tersedia</th>
                        </tr>
                    </tfoot>
                </table>
                <!-- END Datatable -->
            </div>
        </div>
    </div>
</div>
<!-- END Modal -->
<script src="https://cdn.datatables.net/keytable/2.12.0/js/dataTables.keyTable.min.js"></script>
<script>
    let kondisipilihbarang = "d";
    $(function () {
        $('#modal6').on('shown.bs.modal', function () {
            $('#modal6 .custom-control-input').on('change', function () {
                if ($(this).is(':checked')) {
                    $('#modal6 .custom-control-input').not(this).prop('checked', false);
                }
            });
        });
        $('#modal6').on('hidden.bs.modal', function () {
            $('#modal6 .custom-control-input').off('change');
        });
        $("#pangil_daftarabarang").DataTable({
            language:{"url":"https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"},
            scrollCollapse: true,
            scrollY: "50vh",
            scrollX: true,
            bFilter: false,
            keys: true,
            ajax: {
                "url": baseurljavascript + 'masterdata/panggilbarangglobal',
                "type": "POST",
                "data": function (d) {
                    if ($('#stokhanyaretur').is(':checked')) {
                        kondisipilihbarang = "r";
                    }else if ($('#stokhanyagudang').is(':checked')) {
                        kondisipilihbarang = "g";
                    }else if ($('#stokhanyadisplay').is(':checked')) {
                        kondisipilihbarang = "d";
                    }else{
                        kondisipilihbarang = "d";
                    }
                    d.DIMANA2 = $("#daftaritem_katakunci_panggil").val();
                    d.DIMANA3 = "kombinasi";
                    d.DIMANA4 = kondisipilihbarang;
                    d.DIMANA6 = session_outlet;
                    d.DIMANA8 = statusbarang;
                    d.DIMANA10 = session_kodeunikmember;
                    d.DATAKE = 0;
                    d.LIMIT = 500
                    d.KONDISIDARI = '<?= $SEGMENT;?>';
                }
            },
        });
        $('#pangil_daftarabarang tbody').on('dblclick', 'tr', function () {
            let dataDiv = $(this).find('div.btn-pilih');
            if (dataDiv.length === 0) return;

            let barangId = dataDiv.data('barangid');
            let namaBarang = dataDiv.data('namabarang');
            let hargaJual = dataDiv.data('hargajual');
            let hargaBeli = dataDiv.data('hargabeli');
            let kondisiDari = dataDiv.data('kondisidari');
            let stok = dataDiv.data('stok');

            onclickplihbarang(barangId, namaBarang, hargaJual, kondisiDari, stok, hargaBeli);
        });
        $('#pangil_daftarabarang').DataTable().on('key', function (e, datatable, key, cell, originalEvent) {
            if (key === 13) {
                const rowData = datatable.row(cell.index().row).data();
                onclickplihbarang(rowData[1],rowData[2],rowData[3],'<?= $SEGMENT;?>',rowData[4],rowData[5]);
            }
        });
        $('#pangil_daftarabarang').DataTable().on('xhr.dt', function (e, settings, json, xhr) {
            setTimeout(function() {
                const rowCount = $('#pangil_daftarabarang').DataTable().rows({ filter: 'applied' }).data().length;
                if (rowCount === 1) {
                    const row = $('#pangil_daftarabarang').DataTable().row(0).node();
                    const dataDiv = $(row).find('div.btn-pilih');
                    if (dataDiv.length > 0) {
                        let barangId = dataDiv.data('barangid');
                        let namaBarang = dataDiv.data('namabarang');
                        let hargaJual = dataDiv.data('hargajual');
                        let hargaBeli = dataDiv.data('hargabeli');
                        let kondisiDari = dataDiv.data('kondisidari');
                        let stok = dataDiv.data('stok');
                        onclickplihbarang(barangId, namaBarang, hargaJual, kondisiDari, stok, hargaBeli);
                    }
                }
            }, 100);
        });
    });
    $("#daftaritem_katakunci_panggil").on('keydown', debounce(function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            $('#pangil_daftarabarang').DataTable().ajax.reload();
        }
    }, 0))
    function onclickplihbarang(kodeitem, namaitem, harga, kondisi, stoktersedia, hargabeli) {
        let addrows = true;
        if (kondisi == "daftaritemdetail") {
            if ($("#modalPecahsatuan").data('bs.modal')?._isShown){
                $("#kodebarangpecahsatuan").val(kodeitem);
                $("#namabarangpecahsatuan").val(namaitem);
                hargajualbaruPecahSatuan.set(harga.replace('IDR','').replace(',',''));
                hppprodukbaruPecahSatuan.set(hargabeli.replace('IDR','').replace(',',''));
                $('#modal6').modal('hide');
            }else{
                var data = $('#bonusbarangitem').DataTable().rows().data();
                data.each(function (isidatatable, index) {
                    var temp = new Array();
                    temp = isidatatable.toString().split(",");
                    if (temp[0] == kodeitem) {
                        addrows = false;
                        return false;
                    }
                });
                if (addrows == true){
                    $('#bonusbarangitem').DataTable().row.add([
                        kodeitem,
                        namaitem,
                        "<input name=\"bonusitem[]\" class=\"form-control\" type=\"text\" value=\"1\">",
                        "<div><button class=\"hapusbonusbarang btn btn-danger\"><i class=\"fas fa-trash\"></i> Hapus</button></div>",
                    ]).draw(false);
                    Swal.fire({
                        icon: 'success',
                        target: document.getElementById('modal6'),
                        text: namaitem + ' telah ditambahkan',
                        toast: true,
                        showConfirmButton: false,
                        timer: 1500,
                        position: 'top-right'
                    })
                }else{
                    Swal.fire({
                        icon: 'warning',
                        target: document.getElementById('modal6'),
                        text: namaitem + ' sudah ada, pilih yang lainnya',
                        toast: true,
                        showConfirmButton: false,
                        timer: 1500,
                        position: 'top-right'
                    })
                }
            }
        }else if (kondisi == "formpembelian"){
            $("#katakuncibarang").val(kodeitem);
            panggilinformasibarang();
            $('#modal6').modal('hide');
        }else if (kondisi == "formmutasiitem"){
            if (stoktersedia <= 0){
                return Swal.fire(
                    'Stok Barang '+stoktersedia+' !',
                    'Stok dengan nama item '+namaitem+' tidak dapat dilakukan mutasi karena stok kosong KOSONG atau DIBAWAH 0',
                    'warning'
                ) 
            }
            $("#katakuncipencariankasir").val(kodeitem);
            panggilinformasibarangmutasi();
            $('#modal6').modal('hide');
        }else if (kondisi == "formpenyesuianstok"){
            $("#katakuncipencariankasir").val(kodeitem);
            panggilinformasibarang();
            $('#modal6').modal('hide');
        }else if (kondisi == "daftarkartustok"){
            $("#kodebarangkartustok").val(kodeitem);
            $('#modal6').modal('hide');
        }else if (kondisi == "tambahdiskonitem"){
            $("#textkodebarangdiskon").html("Kode Item : "+kodeitem);
            $("#textnamabarangdiskon").html("Nama Barang : "+namaitem);
            $("#texthargajualumumdiskon").html("Harga Jual Barang : "+harga);
            $('#modal6').modal('hide');
        }else if (kondisi == "tambahreturpenjualan" || kondisi == "detailreturpenjualan" || kondisi == "formreturpembelian"){
            informasibarang(kodeitem);
            $('#modal6').modal('hide');
        }
        $("#daftaritem_katakunci_panggil").focus();
    }
</script>