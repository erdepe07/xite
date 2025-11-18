<!DOCTYPE html>
<html>
<head>
    <title>Laporan Penjualan Per Barang</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            margin-left: 0;
            margin-right: 0;
        }

        h2, h3 {
            text-align: center;
            margin: 0;
        }

        img {
            vertical-align: middle;
            margin-right: 10px;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            border: 1px solid #000;
            padding: 5px;
        }

        th {
            background-color: #f0f0f0;
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        /* Header tabel otomatis diulang setiap halaman */
        thead {
            display: table-header-group;
        }

        tfoot {
            display: table-row-group;
        }

        tr {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>

    <h2>KOTAK CANTIK MAGELANG</h2>
    <h3>
        Laporan Penjualan Per Barang<br>
        Periode <?= esc($periodeawal) ?> s.d <?= esc($periodeakhir) ?><br>
        Dicetak: <?= date('d-m-Y H:i:s') ?>
    </h3>
    <br>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 11%;">Kode Item</th>
                <th style="width: 11%;">Nama Item</th>
                <th style="width: 15%;">Kategori</th>
                <th style="width: 10%;">Keluar</th>
                <th style="width: 12%;">Total Jual</th>
                <th style="width: 12%;">Potongan</th>
                <th style="width: 12%;">Total Beli</th>
                <th style="width: 15%;">Total Laba</th>
            </tr>
        </thead>
        <tbody>
            <?php if (!empty($datapenjualan)): ?>
                <?php 
                    $no = 1;
                    $grandKeluar = $grandJual = $grandPotongan = $grandBeli = $grandLaba = 0;
                    foreach ($datapenjualan as $row): 
                        $grandKeluar += $row['JUMLAHITEM'] ?? 0;
                        $grandJual   += $row['HARGAJUAL'] ?? 0;
                        $grandPotongan += $row['POTONGAN'] ?? 0;
                        $grandBeli   += $row['HARGABELI']  * $row['JUMLAHITEM'] ?? 0;
                        $grandLaba   += ($row['HARGAJUAL'] + $row['PAJAKTOKO'] + $row['PAJAKNEGARA'] - $row['POTONGANGLOBAL']) - ($row['HARGABELI'] * $row['JUMLAHITEM']) ?? 0;
                    ?>
                    <tr>
                        <td style="text-align:center;"><?= $no++ ?></td>
                        <td><?=esc($row['FK_BARANG']) ?></td>
                        <td><?=esc($row['NAMABARANG']) ?></td>
                        <td><?=esc($row['NAMAKATEGORI']) ?></td>
                        <td class="text-right"><?= number_format($row['JUMLAHITEM'], 0, ',', '.') ?></td>
                        <td class="text-right"><?= number_format($row['HARGAJUAL'], 0, ',', '.') ?></td>
                        <td class="text-right"><?= number_format($row['POTONGAN'], 0, ',', '.') ?></td>
                        <td class="text-right"><?= number_format($row['HARGABELI'] * $row['JUMLAHITEM'], 0, ',', '.') ?></td>
                        <td class="text-right"><?= number_format(($row['HARGAJUAL'] + $row['PAJAKTOKO'] + $row['PAJAKNEGARA'] - $row['POTONGANGLOBAL']) - ($row['HARGABELI'] * $row['JUMLAHITEM']), 0, ',', '.') ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="8" style="text-align:center;">Tidak ada data</td>
                </tr>
            <?php endif; ?>
        </tbody>

        <?php if (!empty($datapenjualan)): ?>
        <tfoot>
            <tr>
                <th colspan="4" class="text-right">GRAND TOTAL</th>
                <th class="text-right"><?= number_format($grandKeluar, 0, ',', '.') ?></th>
                <th class="text-right"><?= number_format($grandJual, 0, ',', '.') ?></th>
                <th class="text-right"><?= number_format($grandPotongan, 0, ',', '.') ?></th>
                <th class="text-right"><?= number_format($grandBeli, 0, ',', '.') ?></th>
                <th class="text-right"><?= number_format($grandLaba, 0, ',', '.') ?></th>
            </tr>
        </tfoot>
        <?php endif; ?>
    </table>

</body>
</html>
