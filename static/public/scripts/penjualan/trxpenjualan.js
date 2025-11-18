$(function () {
    loadtabelutama();
});
function loadtabelutama() {
    $("#daftarpenjualan").DataTable({
        language:{"url":"https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"},
        columnDefs: [
            { width: 45, targets: 0 },
            { className: "text-right", targets: [5,6]}
        ],
        scrollCollapse: true,
        scrollY: "50vh",
        scrollX: true,
        bFilter: false,
        ajax: {
            "url": baseurljavascript + 'penjualan/ajaxdaftarpenjualan',
            "method": 'POST',
            "data": function (d) {
                d.DIMANA3 = $('#daritanggal').val().split("-").reverse().join("-");
                d.DIMANA4 = $('#sampaitanggal').val().split("-").reverse().join("-");
                d.DIMANA5 = $('#katakunci').val();
                d.DIMANA6 = $('#parameterpencarian').val();
                d.DIMANA7 = $('#jenistransaksipenjualan').val();
                d.DIMANA9 = session_kodeunikmember;
                d.DIMANA10 = session_outlet;
                d.DATAKE = 0;
                d.LIMIT = 500;
            },
        },
        complete: function (xhr, status) {
            $("#prosesdata").html("WES MARI");
        }
    });
}
$('#katakunci').on('keydown', function (e) {
    if (e.key === 'Enter') {
        $('#daftarpenjualan').DataTable().ajax.reload();
    }
});
$("#parameterpencarian").change(function () {
    $('#daftarpenjualan').DataTable().ajax.reload();
});
$("#jenistransaksipenjualan").change(function () {
    $('#daftarpenjualan').DataTable().ajax.reload();
});
$("#pencariantanggal, #prosesdata").on("click", function () {
    $("#prosesdata").html('<i class="fa-solid fa-gear fa-spin"></i> Memproses Data');
    $("#prosesdata").prop("disabled", true);
    $('#daftarpenjualan').DataTable().ajax.reload(function (json) {
        $("#prosesdata").html('<i class="fab fa-searchengin"></i> Proses Data');
        $("#prosesdata").prop("disabled", false);
    });
});
function onclickhapustranskasi(notapenjualan,nammember){
    Swal.fire({
        title: 'Apakah anda yakin?',
        text: 'Apakah anda ingin menghapus TRANSAKSI '+notapenjualan+' dengan NAMA MEMBER '+nammember+'. Informasi yang terhubung dengan '+notapenjualan+' akan dihapus termasuk PIUTANG MEMBER hingga JURNAL TRANSAKSI. Stok akan diretur ke DISPLAY di OUTLET '+session_outlet,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oke, Siap!!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: baseurljavascript + 'penjualan/hapuspenjualan',
                method: 'POST',
                dataType: 'json',
                data: {
                    PK_NOTAPENJUALAN : notapenjualan,
                    LOKASI: session_outlet,
                    KODEUNIKMEMBER: session_kodeunikmember,
                },
                success: function (response) {
                    if (response.success == "true"){
                        Swal.fire(
                            'Berhasil.. Horee!',
                            response.msg,
                            'success'
                        );
                        $('#daftarpenjualan').DataTable().ajax.reload();
                    }else{
                        Swal.fire(
                            'Gagal.. Uhhhhh!',
                            response.msg,
                            'warning'
                        )
                    }
                }
            });
        }
    })
}
