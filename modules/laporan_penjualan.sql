with penjualan as (
select *
, DATE_FORMAT(tglkeluar
,'%Y-%m-%d') as pt_date
from 01_trs_barangkeluar
where DATE_FORMAT(tglkeluar
,'%Y-%m-%d') = '2025-10-11')
, kasir as (
select A.*
, B.NAMAPENGGUNA from penjualan A
left join 01_tms_penggunaaplikasi B
on A.KASIR = B.PENGGUNA_ID)
select pt_date
, namapengguna
, sum(totalbelanja) as totalbelanja
, sum(nominaltunai) as tunai
, sum(nominalkredit) as kredit
, sum(nominalkartukredit) as kartukredit
, sum(nominalkartudebit) as kartudebit
, sum(nominalemoney) as emoney
, sum(nominaltransfer) as transfer 
, sum(nominaltunai) + sum(nominalkredit) + sum(nominalkartukredit) + sum(nominalkartudebit) + sum(nominalemoney) + sum(nominaltransfer) as total_pembayaran          
, sum(kembalian) as kembalian 
, (sum(nominaltunai) + sum(nominalkredit) + sum(nominalkartukredit) + sum(nominalkartudebit) + sum(nominalemoney) + sum(nominaltransfer)) - sum(kembalian) as grand_total            
, sum(totalbelanja) - (((sum(nominaltunai) -sum(kembalian)) + sum(nominalkredit) + sum(nominalkartukredit) + sum(nominalkartudebit) + sum(nominalemoney) + sum(nominaltransfer))) as selisih               
from kasir    
where pt_date between '2025-10-01' and '2025-10-11'
group by pt_date
, namapengguna 
order by pt_date
, namapengguna;