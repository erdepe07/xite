document.addEventListener('mousedown', function (event) { if (event.detail > 1) { event.preventDefault(); } }, false);
document.addEventListener("keydown", function (e) {
    if (e.key === "F1") {
        e.preventDefault();
        setTimeout(function () {
            $("#daftaritem_katakunci_panggil").focus();
        }, 1000);
        $('#modal6').modal('show');
    } else if (e.key === "F2") {
        e.preventDefault();
        panggilsuplier();
        $('#modalpilihsuplier').modal('show');
    } else if (e.key === "F5") {
        e.preventDefault();
        swal.fire({
            title: "Halaman akan disegarkan [resfresh] ?",
            text: "Apakah anda ingin mensegarkan [refresh] halaman ini. Pastikan anda menyimpan pekerjaan sebelumnya dikarenakan progress akan tereset",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oke, Segarkan [Refresh] Halaman Ini!",
            cancelButtonText: "Gak Jadi Ah!",
        }).then(function (result) {
            if (result.isConfirmed) {
                window.location.reload();
            }
        })
    } else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        simpantransaksipembelian();
    }
});

function hitungkeranjangbeli(index, kondisi) {
    let data = daftarkeranjang.rows().data();
    let totalbelanja = 0, totalbelanjanett = 0, totalppnmasukan = 0;
    /* cek jika stok display melebihi jumlah beli */
    if (anjumlahbeli[index].getNumber() < anstokdisplay[index].getNumber()) {
        Swal.fire(
            'Stok melebihi informasi beli!',
            'Stok display yang anda masukan melebihi kapasitas jumlah beli anda. Anda membeli sebesar ' + anjumlahbeli[index].getNumber() + ' QTY, tetapi anda memasukan ' + anstokdisplay[index].getNumber() + ' QTY. Stok akan diubah menjadi stok maksimal jumlah beli',
            'error'
        )
        anstokdisplay[index].set(anjumlahbeli[index].getNumber());
        anstokgudang[index].set(0);
    } else {
        anstokgudang[index].set(anjumlahbeli[index].getNumber() - anstokdisplay[index].getNumber());
    }
    if (kondisi == 'hs') {
        subtotal[index].set(hargasuplier[index].getNumber() * anjumlahbeli[index].getNumber());
    } else if (kondisi == 'shs') {
        hargasuplier[index].set(subtotal[index].getNumber() / anjumlahbeli[index].getNumber());
    }
    /* diskon 1*/
    if (diskon1[index].getNumber() < 99 && diskon1[index].getNumber() >= 0) {
        diskon1[index].set((diskon1[index].getNumber() / 100) * subtotal[index].getNumber());
    } else {
        diskon1[index].set(diskon1[index].getNumber());
    }
    /* diskon 2*/
    hasildiskon1 = subtotal[index].getNumber() - diskon1[index].getNumber();
    if (diskon2[index].getNumber() < 99 && diskon2[index].getNumber() >= 0) {
        diskon2[index].set((diskon2[index].getNumber() / 100) * hasildiskon1);
    } else {
        diskon2[index].set(diskon2[index].getNumber());
    }
    hasildiskon2 = hasildiskon1 - diskon2[index].getNumber();
    if ($('#aktifkanpajakmasukan').is(':checked')) {
        ppn[index].set(11)
    } else {
        ppn[index].set(0)
    }
    if (ppn[index].getNumber() < 99 && ppn[index].getNumber() >= 0) {
        ppn[index].set((ppn[index].getNumber() / 100) * hasildiskon2);
    } else {
        ppn[index].set(ppn[index].getNumber())
    }
    hasildenganppn = hasildiskon2 + ppn[index].getNumber()
    if (adiskon1[index].getNumber() < 99 && adiskon1[index].getNumber() >= 0) {
        adiskon1[index].set((adiskon1[index].getNumber() / 100) * hasildenganppn);
    } else {
        adiskon1[index].set(adiskon1[index].getNumber())
    }
    hasiladiskon1 = hasildenganppn - adiskon1[index].getNumber()
    if (adiskon2[index].getNumber() < 99 && adiskon2[index].getNumber() >= 0) {
        adiskon2[index].set((adiskon2[index].getNumber() / 100) * hasiladiskon1);
    } else {
        adiskon2[index].set(adiskon2[index].getNumber())
    }
    hasiladiskon2 = hasiladiskon1 - adiskon2[index].getNumber()
    subtotalhpp[index].set(hasiladiskon2)
    hpp[index].set(hasiladiskon2 / anjumlahbeli[index].getNumber())
    hppbeban[index].set(
        (hasiladiskon2 / (anjumlahbeli[index].getNumber() || 1)) +
        (bebangaji[index]?.getNumber() ?? 0) +
        (bebanpromo[index]?.getNumber() ?? 0) +
        (bebanpacking[index]?.getNumber() ?? 0) +
        (bebantransport[index]?.getNumber() ?? 0)
    );
    /* hitung sum pembelian */
    data.each(function (value, index) {
        totalbelanja = totalbelanja + subtotalhpp[index].getNumber()
        totalbelanjanett = totalbelanjanett + (parseFloat(hppbeban[index].getNumber()) * parseFloat(anjumlahbeli[index].getNumber()))
        totalppnmasukan = totalppnmasukan + ppn[index].getNumber()
        $('#totalpembelian').html(formatuang(totalbelanja.toFixed(2), 'id-ID', 'IDR'));
        $('#totalpembeliannett').html(formatuang(totalbelanjanett.toFixed(2), 'id-ID', 'IDR'));
        $('#totalppnmasukan').html(formatuang(totalppnmasukan.toFixed(2), 'id-ID', 'IDR'));
    });
}
let catchEnter = debounce(function (index, kondisi) {
    hitungkeranjangbeli(index, kondisi)
}, 500);
function hitungdenganinfototal() {
    let data = daftarkeranjang.rows().data();
    data.each(function (value, index) {
        hitungkeranjangbeli(index, "hs")
    });
}
function pasangdiskon(daridiskon) {
    let data = daftarkeranjang.rows().data();
    data.each(function (value, index) {
        if (daridiskon == "diskon1general") {
            diskon1[index].set($('#diskon1general').val())
        } else if (daridiskon == "diskon2general") {
            diskon2[index].set($('#diskon2general').val())
        } else if (daridiskon == "adiskon1general") {
            adiskon1[index].set($('#adiskon1general').val())
        } else if (daridiskon == "adiskon2general") {
            adiskon2[index].set($('#adiskon2general').val())
        }
        hitungkeranjangbeli(index, "hs")
    });
}

function loadnotapembelian() {
    $.ajax({
        url: baseurljavascript + 'penjualan/notamenupenjualan',
        method: 'POST',
        dataType: 'json',
        data: {
            AWALANOTA: "PB",
            OUTLET: session_outlet,
            KODEKUMPUTERLOKAL: localStorage.getItem("KODEKASA"),
            TANGGALSEKARANG: moment().format('YYYYMMDD'),
            KODEUNIKMEMBER: session_kodeunikmember,
        },
        success: function (response) {
            $('#nofaktur').val(response.nomornota);
        }
    });
}
function panggilsuplier() {
    $("#admin_daftarsuplier").DataTable({
        retrieve: true,
        ordering: true,
        order: [[0, 'desc']],
        language: { "url": "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json" },
        ajax: {
            "url": baseurljavascript + 'pembelian/modaldaftarsuplier',
            "type": "POST",
            "data": function (d) {
                d.KATAKUNCIPENCARIAN = $("#txtpencariansuplier").val();
            }
        },
        scrollCollapse: true,
        scrollY: "50vh",
        scrollX: true,
        bFilter: false,
    });
}
$("#txtpencariansuplier").on('input focus keypress keydown', debounce(function (e) {
    $('#admin_daftarsuplier').DataTable().ajax.reload();
}, 500))
function pilihsuplier(namasuplier, alamatsuplier, notelponsuplier, kodesuplier) {
    $("#namasuplier").html(namasuplier);
    $("#alamatsuplier").html(alamatsuplier);
    $("#notelpnsuplier").html(notelponsuplier);
    $("#kodesuplier").val(kodesuplier);
    $("#modalpilihsuplier").modal('hide');
}
$('#katakuncibarang').keypress(function (e) {
    let key = e.which;
    if (key == 13 && $('#katakuncibarang').val() == "") {
        $('#qtypemasukan').focus(); return false;
    } else if (key == 13 && $('#katakuncibarang').val() != "") {
        panggilinformasibarang();
    }
});
$('#diskon1general, #diskon2general, #adiskon1general, #adiskon2general').keypress(function (e) {
    let key = e.which; if (key == 13) {
        pasangdiskon($(this).attr("id"),)
    }
});

$('#qtypemasukan').keypress(function (e) { let key = e.which; if (key == 13) { $('#katakuncibarang').focus(); return false; } });
function panggilinformasibarang() {
    $.ajax({
        url: baseurljavascript + 'pembelian/pilihbarangpembelian',
        method: 'POST',
        dataType: 'json',
        data: {
            KATAKUNCI: $('#katakuncibarang').val(),
        },
        success: function (response) {
            if (response[0].success == "true") {
                if (response[0].totaldata > 1) {
                    setTimeout(function () {
                        $("#daftaritem_katakunci_panggil").focus();
                        $("#daftaritem_katakunci_panggil").val($('#katakuncibarang').val());
                        $('#pangil_daftarabarang').DataTable().ajax.reload();
                    }, 100);
                    $("#modal6").modal('show');
                } else {
                    tambahkeranjangpembelian(
                        response[0].dataquery[0].BARANG_ID,
                        response[0].dataquery[0].NAMABARANG,
                        response[0].dataquery[0].DISPLAY,
                        response[0].dataquery[0].HARGABELI,
                        response[0].dataquery[0].BEBANGAJI,
                        response[0].dataquery[0].BEBANPACKING,
                        response[0].dataquery[0].BEBANPROMO,
                        response[0].dataquery[0].BEBANTRANSPORT,
                        Number($('#qtypemasukan').val()),
                    );
                }
            } else {
                Swal.fire({
                    title: "Informasi Tidak Ditemukan",
                    text: "Waduh... Loo Loo Loo informasi yang anda masukan sama sekali tidak ditemukakn di database kami. Silahkan cek kembali",
                    icon: 'warning',
                });
            }
        }
    });
}
function refreshKeranjangTable() {
    let data = ambilKeranjangLocal();
    daftarkeranjang.clear().rows.add(data).draw();
}
function tambahkeranjangpembelian(kodebarang, namabarang, stoksebelum, hargasuplierlama, bebangaji, bebanpromo, bebanpacking, bebantransport, jumlahbelimasukan) {
    let keranjang = JSON.parse(localStorage.getItem('keranjangPembelian')) || [];

    // cari index barang dengan kode sama
    let index = keranjang.findIndex(item => item.KODEBARANG === kodebarang);
    if (index !== -1) {
        // kalau sudah ada, update jumlah + subtotal
        keranjang[index].JUMLAHBELI = parseInt(keranjang[index].JUMLAHBELI) + parseInt(jumlahbelimasukan);
        keranjang[index].DISPLAY = $('#stoktaruhgudang').is(":checked") ? 0 : keranjang[index].JUMLAHBELI;
        keranjang[index].GUDANG = $('#stoktaruhgudang').is(":checked") ? keranjang[index].JUMLAHBELI : 0;
        keranjang[index].SUBTOTAL = keranjang[index].JUMLAHBELI * parseFloat(hargasuplierlama);
        keranjang[index].SUBTOTALHPP = keranjang[index].JUMLAHBELI * parseFloat(hargasuplierlama) - parseFloat(keranjang[index].DISKON1) - parseFloat(keranjang[index].DISKON2) + parseFloat(keranjang[index].PPN) - parseFloat(keranjang[index].ADISKON1) - parseFloat(keranjang[index].ADISKON2);
        keranjang[index].HPPBEBAN = (parseFloat(keranjang[index].JUMLAHBELI) * parseFloat(hargasuplierlama)) + parseFloat(bebangaji) + parseFloat(bebanpromo) + parseFloat(bebanpacking) + parseFloat(bebantransport);
    } else {
        // kalau belum ada, bikin item baru
        let itemBaru = {
            KODEBARANG: kodebarang,
            NAMABARANG: namabarang,
            STOKSEBELUM: stoksebelum,
            JUMLAHBELI: jumlahbelimasukan,
            DISPLAY: $('#stoktaruhgudang').is(":checked") ? 0 : jumlahbelimasukan,
            GUDANG: $('#stoktaruhgudang').is(":checked") ? jumlahbelimasukan : 0,
            HARGASUPLIER: hargasuplierlama,
            EXP: moment(new Date()).format('DD-MM-YYYY'),
            SUBTOTAL: jumlahbelimasukan * parseFloat(hargasuplierlama),
            DISKON1: 0,
            DISKON2: 0,
            PPN: 0,
            ADISKON1: 0,
            ADISKON2: 0,
            SUBTOTALHPP: jumlahbelimasukan * parseFloat(hargasuplierlama),
            HPP: hargasuplierlama,
            BEBANGAJI: bebangaji,
            BEBANPROMO: bebanpromo,
            BEBANPACKING: bebanpacking,
            BEBANTRANSPORT: bebantransport,
            HPPBEBAN: 0
        };
        keranjang.push(itemBaru);
    }

    // simpan lagi
    localStorage.setItem('keranjangPembelian', JSON.stringify(keranjang));

    // reset input
    $('#katakuncibarang').val('');
    $('#qtypemasukan').val('1');

    refreshKeranjangTable();
    hitungdenganinfototal();
}

function updateKeranjangItem(index, updatedFields) {
    let keranjang = JSON.parse(localStorage.getItem('keranjangPembelian')) || [];
    if (keranjang[index]) {
        keranjang[index] = { ...keranjang[index], ...updatedFields };
        localStorage.setItem('keranjangPembelian', JSON.stringify(keranjang));
    }
}
$("#simpansementara").on("click", function () {
    let keranjang = [];
    let datapembelian = $('#keranjangpembelian').DataTable().rows().data();
    datapembelian.each(function (isidatatable, index) {
        let itemBaru = {
            KODEBARANG: $.trim(datapembelian.cell(index, 1).nodes().to$().text()),
            NAMABARANG: $.trim(datapembelian.cell(index, 0).nodes().to$().text()),
            STOKSEBELUM: $.trim(datapembelian.cell(index, 2).nodes().to$().text()),
            JUMLAHBELI: anjumlahbeli[index].getNumber(),
            DISPLAY: anstokdisplay[index].getNumber(),
            GUDANG: anstokgudang[index].getNumber(),
            HARGASUPLIER: hargasuplier[index].getNumber(),
            EXP: datapembelian.cell(index, 7).nodes().to$().find('input').val().split("-").reverse().join("-"),
            DISKON1: diskon1[index].getNumber(),
            DISKON2: diskon2[index].getNumber(),
            PPN: ppn[index].getNumber(),
            ADISKON1: adiskon1[index].getNumber(),
            ADISKON2: adiskon2[index].getNumber(),
            HPP: hpp[index].getNumber(),
            SUBTOTAL: anjumlahbeli[index].getNumber() * hargasuplier[index].getNumber(),
            SUBTOTALHPP: anjumlahbeli[index].getNumber() * hargasuplier[index].getNumber(),
            BEBANGAJI: bebangaji[index].getNumber(),
            BEBANPROMO: bebanpromo[index].getNumber(),
            BEBANPACKING: bebanpacking[index].getNumber(),
            BEBANTRANSPORT: bebantransport[index].getNumber(),
            HPPBEBAN: hppbeban[index].getNumber()
        };
        keranjang.push(itemBaru);
    });
    localStorage.setItem('keranjangPembelian', JSON.stringify(keranjang));
    return toastr["success"]("Keranjang pembelian berhasil disimpan sementara pada komputer ini. ");
})
$('#bebanlainlain').keypress(function (e) {
    let jumlahbeban = Number($('#bebanlainlain').val());
    let totalqty = 0;
    let data = daftarkeranjang.rows().data();
    data.each(function (value, index) {
        totalqty = totalqty + anjumlahbeli[index].getNumber();
        jumlahbeban = jumlahbeban / 1;
    });
});

$("#bersihkanform").on("click", function () {
    swal.fire({
        title: "Apakah Yakin ?",
        text: "Apakah yakin ingin menghapus seluruh pada keranjang pembelian ini ?. Jika anda ingin mensegarkan tampilan ini silahkan tekan F5",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oke, Hapus Ini!",
        cancelButtonText: "Gak Jadi Ah!",
    }).then(function (result) {
        if (result.isConfirmed) {
            kosongkankeranjanglokal()
        }
    })
});
function simpantransaksipembelian(paksasimpan = false) {
    hitungdenganinfototal();
    let notrankasipembelian = $('#nofaktur').val();
    var datanya = $('#jenispembayaran').select2('data')
    if ($('#kodesuplier').val() == "" || $('#jenispembayaran').val() == null || $('#pilihperusahaan').val() == null || $('#nofaktur').val() == "" || $('#keranjangpembelian').DataTable().rows().data().length == 0) {
        return Swal.fire({
            title: "Informasi Pada Form Pembelian",
            text: "Kode perusahaan, Suplier, Nomor nota, Jenis pembayaran, dan minimal di keranjang pembelian harus ada 1 barang",
            icon: "warning",
        });
    }
    Swal.fire({
        title: iseditjs ? "Ubah Transaksi " + $('#nofaktur').val() : "Simpan Transaksi Ini ?",
        text: iseditjs
            ? "Proses ubah data akan dilakukan. Stok dan total hutang akan disesuaikan dengan TRANSAKSI baru setelah di ubah. Jika ada histori pembayaran hutang silahkan cek kembali untuk mengecek kekurangan / kelebihan hutang"
            : "Stok akan ditambahkan sesuai kodebarang terpilih pada OUTLET : " + session_outlet + " Tekan Ya untuk melanjutkan",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: iseditjs ? "Ya, Ubah Data" : "Ya, Simpan!",
        cancelButtonText: "Tidak, Kembali!"
    }).then((result) => {
        if (result.isConfirmed) {
            let arraydetailpembelian = [];
            let datapembelian = $('#keranjangpembelian').DataTable().rows().data();
            datapembelian.each(function (isidatatable, index) {
                var temp = new Array();
                temp.push(
                    $.trim(datapembelian.cell(index, 1).nodes().to$().text()),
                    hargasuplier[index].getNumber(),
                    anjumlahbeli[index].getNumber(),
                    anstokdisplay[index].getNumber(),
                    anstokgudang[index].getNumber(),
                    datapembelian.cell(index, 7).nodes().to$().find('input').val().split("-").reverse().join("-"),
                    diskon1[index].getNumber(),
                    diskon2[index].getNumber(),
                    ppn[index].getNumber(),
                    adiskon1[index].getNumber(),
                    adiskon2[index].getNumber(),
                    hpp[index].getNumber(),
                    bebangaji[index].getNumber(),
                    bebanpromo[index].getNumber(),
                    bebanpacking[index].getNumber(),
                    bebantransport[index].getNumber(),
                    hppbeban[index].getNumber(),
                    $.trim(datapembelian.cell(index, 0).nodes().to$().text()),
                    $.trim(datapembelian.cell(index, 2).nodes().to$().text()),
                );
                arraydetailpembelian.push(temp)
            });
            $.ajax({
                url: baseurljavascript + 'pembelian/simpanpembelian',
                method: 'POST',
                dataType: 'json',
                data: {
                    DETAILPEMBELIAN: arraydetailpembelian,
                    NOTA: $('#nofaktur').val(),
                    FK_SUPPLIER: $('#kodesuplier').val(),
                    TANGGALTRS: $('#tgltrx').val().split("-").reverse().join("-"),
                    KETERANGAN: $('#keterangan').val(),
                    TOP: $('#jenispembayaran').val(),
                    NAMATOP: datanya[0].text,
                    JATUHTEMPO: moment($('#tgltrx').val(), "DD-MM-YYYY").add(Number($('#jatuhtempo').val()), 'days').format('YYYY-MM-DD'),
                    TOTALPEMBELIAN: $('#totalpembelian').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim(),
                    TOTALPEMBELIANBEBAN: $('#totalpembeliannett').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim(),
                    TOTALHUTANG: $('#totalpembelian').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim(),
                    BIAYALAINLAIN: anbebanlainlain.getNumber(),
                    DARISUBPERUSAHAAN: $('#pilihperusahaan').val(),
                    NOMOR: ($('#nofaktur').val().split('#')[1] === undefined ? "0" : $('#nofaktur').val().split('#')[1]),
                    TOTALPPNMASUKAN: $('#totalppnmasukan').html().replace('Rp&nbsp;', '').replaceAll('.', '').replace(',', '.').trim(),
                    ISEDIT: iseditjs,
                    UBAHTANPABARANG: $('#ubah_tanpa_barang').prop('checked'),
                    PAKSA_SIMPAN: paksasimpan,
                },
                success: function (response) {
                    if (response[0].success) {
                        swal.fire({
                            title: iseditjs == "true" ? "Ubah Data Berhasil" : "Transaksi Pembelian Berhasil",
                            text: "Transaksi dengan NOTA " + $('#nofaktur').val() + " sebesar " + $('#totalpembelian').html().replace('&nbsp;', ' ') + " berhasil di tranaksi pada TANGGAL " + $('#tgltrx').val(),
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonText: "Oke, Ubah Harga Jual!",
                            cancelButtonText: "Tidak, Lanjut Transaksi!",
                        }).then(function (result) {
                            kosongkankeranjanglokal();
                            if (result.isConfirmed) {
                                panggilhargajual(notrankasipembelian);
                                $('#modalubahhargajual').modal('show');
                            } else {
                                location.href = baseurljavascript + "pembelian/formpembelian";
                            }
                        })
                    } else {
                        if (response[0].rc == 409) {
                            return Swal.fire({
                                title: "Nota " + $('#nofaktur').val() + " Sudah digunakan",
                                text: response[0].msg,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: "Ya, Gunakan NOTA ini!",
                                cancelButtonText: "Tidak, Ganti Nota Lain!",
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    simpantransaksipembelian(true);
                                }
                            });
                        }
                        Swal.fire({
                            title: "Terjadi kesalahan dalam Transaksi Pembelian Nota " + $('#nofaktur').val(),
                            text: response[0].msg,
                            icon: 'warning',
                        });
                    }
                }
            });
        }
    })
}
$('#keranjangpembelian').on('click', '.hapus-item', function () {
    let row = daftarkeranjang.row($(this).parents('tr'));
    let rowData = row.data();
    swal.fire({
        title: "Habis daftar pembelian baris ini",
        text: "Apakah anda yakin ingin menghapus barang Nama : " + rowData.NAMABARANG + " ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oke, Hapus Ini!",
        cancelButtonText: "Gak Jadi Ah!",
    }).then(function (result) {
        if (result.isConfirmed) {
            row.remove().draw();
            let keranjang = ambilKeranjangLocal();
            keranjang = keranjang.filter(item => item.KODEBARANG !== rowData.KODEBARANG);
            localStorage.setItem('keranjangPembelian', JSON.stringify(keranjang));
            loadkeranjangLocalStorage();
        }
    })
});
$("#simpantransaksipembelian").on("click", function () {
    simpantransaksipembelian();
});
function kosongkankeranjanglokal() {
    localStorage.removeItem('keranjangPembelian');
    $('#katakuncibarang').val('');
    $('#qtypemasukan').val('1');
    $('#totalpembelian').html("0.00");
    $('#totalpembeliannett').html("0.00");
    $('#totalppnmasukan').html("0.00");
    loadkeranjangLocalStorage();
    Swal.fire({
        title: "Keranjang Kosong",
        text: "Semua item keranjang sudah dihapus.",
        icon: 'success'
    });
}

//sourcut barang item
function showItemDetailSourcut(kodeBarang) {
    /* master item sourcut*/
    // === CEK DATA TABLE SUDAH ADA ATAU BELUM ===
    let tabelgrosir, tabelbarangtambahan;
    if ($.fn.DataTable.isDataTable('#tabelhargagrosir')) {
        tabelgrosir = $('#tabelhargagrosir').DataTable();
    } else {
        tabelgrosir = $('#tabelhargagrosir').DataTable({
            pageLength: 5,
            bLengthChange: false,
            bFilter: false,
            destroy: true
        });
    }

    if ($.fn.DataTable.isDataTable('#tabelbarangtambahan')) {
        tabelbarangtambahan = $('#tabelbarangtambahan').DataTable();
    } else {
        tabelbarangtambahan = $('#tabelbarangtambahan').DataTable({
            pageLength: 5,
            bLengthChange: false,
            bFilter: false,
            destroy: true
        });
    }
    $.ajax({
        url: baseurljavascript + 'masterdata/daftarbaranginformasidetail',
        method: 'POST',
        dataType: 'json',
        data: {
            KODEBARANG: kodeBarang,
        },
        success: function (response) {
            if (response.success && response.daftarbarang.length > 0) {
                const data = response.daftarbarang[0];

                // === INFORMASI DASAR BARANG ===
                $('#kodebarang').val(data.BARANG_ID);
                $('#kodebarangqrcode').val(data.QRCODE_ID);
                $('#namabarang').val(data.NAMABARANG);
                beratbarang.set(data.BERAT_BARANG);
                hargapokokpembelian.set(data.HARGABELI);
                hargajualumum.set(data.HARGAJUAL);
                let newOption = new Option("[" + data.SATUAN + "] " + data.SATUAN, data.SATUAN, true, true);
                $('#pilihsatuan').append(newOption).trigger('change');

                // === INFORMASI AKUNTANSI ===
                $('#aktifkanbestbuy').prop('checked', data.APAKAHGROSIR.toLowerCase() === 'aktif');
                $('#aktifbaranggrosir').prop('checked', data.APAKAHGROSIR.toLowerCase() === 'aktif');

                // === Bersihkan tabel sebelum isi ulang
                tabelgrosir.clear().draw();
                tabelbarangtambahan.clear().draw();

                // === Barang Grosir ===
                if (response.bestbuygrosir && response.bestbuygrosir.length > 0) {
                    $('#aktifbaranggrosir').prop('checked', true);
                    $('#tambahbarangbonus').prop('disabled', false);

                    response.bestbuygrosir.forEach(function (item) {
                        tabelgrosir.row.add([
                            data.NAMABARANG,
                            `<input name="bonusitem[]" class="grosirqty form-control" type="text" value="${item.JIKABELI}">`,
                            `<input name="bonusitem[]" class="grosirqtyharga form-control" type="text" value="${item.HARGABELIGROSIR}">`,
                            `<div><button class="hapushargagrosir btn btn-danger"><i class="fas fa-trash"></i> Hapus</button></div>`
                        ]).draw(false);
                    });
                } else {
                    $('#aktifbaranggrosir').prop('checked', false);
                    $('#tambahbarangbonus').prop('disabled', true);
                }

                // === Barang Tambahan ===
                if (response.bestbuytambahbarang && response.bestbuytambahbarang.length > 0) {
                    $('#aktifkanbarangtambahan').prop('checked', true);
                    $('#barangtambahan').prop('disabled', false);

                    response.bestbuytambahbarang.forEach(function (item) {
                        tabelbarangtambahan.row.add([
                            `<input name="namatambahan[]" class="grosirqty form-control" type="text" value="${item.NAMATAMBAHAN}">`,
                            `<input name="bonusitem[]" class="grosirqty form-control" type="text" value="${item.HARGA}">`,
                            `<div><button class="hapusbarangtambahan btn btn-danger"><i class="fas fa-trash"></i> Hapus</button></div>`
                        ]).draw(false);
                    });
                } else {
                    $('#aktifkanbarangtambahan').prop('checked', false);
                    $('#barangtambahan').prop('disabled', true);
                }
                setTimeout(() => {
                    $("#modalItemDetail").modal("show");
                }, 300);
            } else {
                alert('Data barang tidak ditemukan!');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', error);
            alert('Terjadi kesalahan saat mengambil data barang.');
        }
    });
}