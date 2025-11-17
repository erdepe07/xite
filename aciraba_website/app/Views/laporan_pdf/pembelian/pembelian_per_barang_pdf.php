<!DOCTYPE html>
<html>
<head>
    <title>Laporan Pembelian Seira</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 5px;
            text-align: left;
        }
        h2 {
            text-align: center;
        }
    </style>
</head>
<body>
    <h2>Laporan Pembelian</h2>
    <p>Tanggal: <?= esc($tanggal) ?></p>
    <table>
        <tr>
            <th>No</th>
            <th>Barang</th>
            <th>Qty</th>
            <th>Total</th>
        </tr>
        <tr>
            <td>1</td>
            <td>Botol Minum</td>
            <td>10</td>
            <td>300.000</td>
        </tr>
    </table>
</body>
</html>
