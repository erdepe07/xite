let dataJenisArus = "";
$(function () {
    $("#proseskartustok").prop("disabled", true);
    $("#proseskartustok").html('<i class="fa-solid fa-gear fa-spin"></i> Memuat Data...');
    $('#filterawalkartustok').val(moment().subtract(30, 'days').format('DD-MM-YYYY'));
    $('#filteraakhirkartustok').val(moment().format('DD-MM-YYYY'));
    $("#filterawalkartustok, #filteraakhirkartustok").datepicker({
        todayHighlight: true,
        format: 'dd-mm-yyyy',
    });
    loadkartustok();
    $('#filterawalkartustok').val(moment().format('DD-MM-YYYY'));
    $("#filterawalkartustok").datepicker({ todayHighlight: true, format: 'dd-mm-yyyy', });
    $('#filteraakhirkartustok').val(moment().format('DD-MM-YYYY'));
    $("#filteraakhirkartustok").datepicker({ todayHighlight: true, format: 'dd-mm-yyyy', });
});
function loadkartustok() {
    $("#tabelkartustok").DataTable({
        language: { "url": "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json" },
        scrollCollapse: true,
        scrollY: "50vh",
        scrollX: true,
        bFilter: false,
        ordering: false,
        pageLength: 250,
        lengthMenu: [ [50, 75, 100, 250, 500], [50, 75, 100, 250, 500] ],
        columnDefs: [
            {
                className: "text-right",
                targets: [5, 6, 7, 8, 9, 10]
            },
        ],
        ajax: {
            "url": baseurljavascript + 'masterdata/jsonproseskartustok',
            "method": 'POST',
            "data": function (d) {
                d.KODEITEM = $('#kodebarangkartustok').val();
                d.ORDERBY = "DESC";
                d.JENISARUSBARANG = $("#jenistranskasikartustok").val();
                d.DATAJENIS = dataJenisArus;
                d.KONDISIPERIODE = $('#filterberdasarkantanggal').is(":checked") == true ? "1" : "0";
                d.PERIODEAWAL = $('#filterawalkartustok').val();
                d.PERIODEAKHIR = $('#filteraakhirkartustok').val();
                d.OUTLET = session_outlet;
                d.KODEUNIKMEMBER = session_kodeunikmember;
                d.DATAKE = 0;
                d.LIMIT = 500;
            },
        },
        fnInitComplete: function (oSettings, json) {
            $("#proseskartustok").prop("disabled", false);
            $("#proseskartustok").html('<i class="fab fa-searchengin"></i> Proses Data');
        }


    });
}

$("#pencariantanggal, #proseskartustok").on("click", function () {

});

$("#pencariantanggal,  #proseskartustok").on("click", function () {

    $("#proseskartustok").html('<i class="fa-solid fa-gear fa-spin"></i> Memproses Data');
    $("#proseskartustok").prop("disabled", true);
    switch ($("#jenistranskasikartustok").val()) {
        case "Semua":
            dataJenisArus = "";
            break;
        case "Transaksi Pembelian":
            dataJenisArus = "TRSPMB";
            break;
        case "Transaksi Penjualan":
            dataJenisArus = "TRSKSR";
            break;
        case "Mutasi":
            dataJenisArus = "MTS";
            break;
        case "Retur Pembelian":
            dataJenisArus = "RTPB";
            break;
        case "Retur Penjualan":
            dataJenisArus = "RTRPJ";
            break;
        default:
            dataJenisArus = "";
    }
    $('#tabelkartustok').DataTable().ajax.reload(function (json) {
        $("#proseskartustok").html('<i class="fab fa-searchengin"></i> Proses Data');
        $("#proseskartustok").prop("disabled", false);
    });
    //$('#tabelkartustok').DataTable().ajax.reload();
});