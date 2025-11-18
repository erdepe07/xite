<?= $this->extend('backend/main'); ?>
<?= $this->section('kontenutama'); ?>
<?= $this->include('backend/header') ?>
<style>
.theme-light .dataTable tbody td.focus, .theme-light .dataTable tbody th.focus { box-shadow: inset 0 0 0 0px #2196f3;}
.tombolmelayang{ width:300px; height: 40px; position: fixed; background-color: blue; bottom: 0; right: 40%; z-index: 999999;}
.tombolmelayang_kanan{ width:100px; height: 40px; position: fixed; background-color: blue; bottom: 0; right: 35%; z-index: 999999;}
.kolom-tersembunyi {
  display: none !important;
}

</style>
<div class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="portlet">
                    <div class="portlet-body">
                        <!-- BEGIN Form Row -->
                        <select class="form-control" id="pilihperusahaan">
                        <?php if ($top != ""){ echo "<option value=\"".$kodeperusahaan."\">[".$kodeperusahaan."] ".$namaperusahaan."</option>";}?> 
                        </select>
                        <hr>
                        <div class="form-row">
                            <div class="col-md-4 col-sm-12">
                                <!-- BEGIN Select -->
                                <div class="form-group row">
                                    <label for="kodesuplier" class="col-sm-3 col-form-label">Kode Suplier</label>
                                    <div class="col-sm-9">
                                        <div class="input-group">
                                            <input value="<?= $kodesuplier ;?>" type="text" id="kodesuplier" class="form-control" placeholder="Masukkan Kode / Nama Suplier Tertuju">
                                            <div onclick="panggilsuplier()" data-toggle="modal" data-target="#modalpilihsuplier" class="input-group-prepend">
                                                <span id="pilihsuplier" style="cursor:pointer;" class="input-group-text btn">Pilih Suplier</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:12">Nama Suplier : <b><span id="namasuplier"><?= $namasuplier ;?></span></b></div>
                                <div style="font-size:12">Alamat Suplier : <b><span id="alamatsuplier"><?= $alamat ;?></span></b></div>
                                <div style="font-size:12">No Telepon : <b><span id="notelpnsuplier"><?= $notelepon ;?></span></b></div>
                                <!-- END Select -->
                            </div>
                            <div class="col-md-4 mb-1 col-sm-12">
                                <div class="form-group row">
                                    <label for="nofaktur" class="col-sm-3 col-form-label">No Faktur</label>
                                    <div class="col-sm-9">
                                        <div class="input-group">
                                            <input <?= $isedit == "true" ? 'readonly' : ''  ?> value="<?= $notapembelian;?>" type="text" id="nofaktur" class="form-control" placeholder="Masukkan No Faktur Dari Suplier">
                                            <?php if ($isedit == "false"){
                                                echo '<div class="input-group-prepend" onclick="loadnotapembelian()">
                                                <span id="generateiditem" class="input-group-text btn-warning btn">Generate Faktur</span>
                                                </div>';
                                            }?>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="tgltrx" class="col-sm-3 col-form-label">Tanggal Transaksi</label>
                                    <div class="col-sm-9">
                                        <div class="input-group">
                                            <input value="" type="text" id="tgltrx" class="form-control">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><i class="fa fa-calendar"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="keterangan" class="col-sm-3 col-form-label">Keterangan</label>
                                    <div class="col-sm-9">
                                        <div class="input-group">
                                            <input value="<?= $keterangan ;?>" type="text" id="keterangan" class="form-control"
                                                placeholder="Keterangan Transaksi">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group row">
                                    <label for="jenispembayaran" class="col-sm-5 col-form-label">Sumber Dana Pembayaran</label>
                                    <div class="col-sm-7">
                                        <div class="input-group">
                                            <select onchange="tampiljatuhtempo()" class="form-control" id="jenispembayaran">
                                            <?php if ($top != ""){ echo "<option value=\"".$top."\">".$namatop."</option>";}?> 
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div id="jatuhtempoform" class="form-group row">
                                    <label for="jatuhtempo" class="col-sm-3 col-form-label">Jatuh Tempo</label>
                                    <div class="col-sm-9">
                                        <div class="input-group">
                                            <input value="" type="text" id="jatuhtempo" class="form-control"
                                                placeholder="Masukan besaran jatuh tempo">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text btn"> Hari Kedepan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size:17px;text-align:right;display:none"> Σ Faktur : <span id="totalpembelian" >Rp 0.00</span></div>
                                <div style="font-size:17px;text-align:right;display:none"> Σ HPP + Beban : <span id="totalpembeliannett_" >Rp 0.00</span></div>
                                <div style="font-size:17px;text-align:right"> Σ Faktur : <span id="totalpembeliannett" >Rp 0.00</span></div>
                                <div style="font-size:17px;text-align:right"> Σ PPN Masukan : <span id="totalppnmasukan" >Rp 0.00</span></div>
                            </div>
                        </div>
                        <!-- END Form Row -->
                        <hr>
                        <div class="form-row ml-1">
                            <div class="custom-control custom-checkbox mr-2">
                                <input checked type="checkbox" class="custom-control-input" id="stoktaruhgudang">
                                <label class="custom-control-label" for="stoktaruhgudang">Stok Taruh Gudang</label>
                            </div>
                            <div class="custom-control custom-checkbox mr-2">
                                <input onclick="return hitungdenganinfototal();" type="checkbox" class="custom-control-input" id="aktifkanpajakmasukan">
                                <label class="custom-control-label" for="aktifkanpajakmasukan">Aktifkan PPN Masukan</label>
                            </div>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="ubah_tanpa_barang">
                                <label class="custom-control-label" for="ubah_tanpa_barang">Ubah Informasi Tanpa Barang</label>
                            </div>
                        </div>
                        <div class="rich-list-item w-100 p-0">
                            <div class="rich-list-prepend" style="width: 100px;">
                                <!-- BEGIN Input Group -->
                                <div class="input-group-icon input-group-lg">
                                    <div class="input-group-prepend">
                                        <i class="fa fa-cart-plus text-primary"></i>
                                    </div>
                                    <input id="qtypemasukan" type="text" class="form-control" value="1" placeholder="QTY">
                                </div>
                                <!-- END Input Group -->
                            </div>
                            <div class="rich-list-content">
                                <!-- BEGIN Input Group -->
                                <div class="input-group-icon input-group-lg">
                                    <div class="input-group-prepend ml-1">
                                        <i class="fa fa-search text-primary"></i>
                                    </div>
                                    <input id="katakuncibarang" type="text" class="form-control"
                                        placeholder="Ketikkan Kode item / Nama item">
                                </div>
                                <!-- END Input Group -->
                            </div>
                            <div class="rich-list-append">
                                <button id="bersihkanform" class="btn btn-flat-info btn-icon mr-2 btn-lg">
                                    <i class="fa fa-redo-alt"></i>
                                </button>
                                <button onclick="panggilinformasibarang()" class="btn btn-flat-info btn-icon mr-2 btn-lg">
                                    <i class="fa fa-boxes"></i>
                                </button>
                            </div>
                        </div>
                        </div>
                        <!-- BEGIN Datatable -->
                        <div class="row portlet-row-fill-md h-100" style="display:none;">
								<div class="col-md-12 col-xl-12">
									<!-- BEGIN Portlet -->
									<div class="portlet portlet-primary">
										<div class="portlet-header">
											<div class="portlet-icon">
												<i class="fa fa-chalkboard"></i>
											</div>
											<h3 class="portlet-title">Masukkan Diskon Secara Bersamaan</h3>
										</div>
										<div class="portlet-body">
											<!-- BEGIN Portlet -->
											<div class="portlet mb-2">
												<div class="portlet-body">
													<!-- BEGIN Widget -->
													<div class="widget5">
														<h4 class="widget5-title">Ketikan diskon dalam [%] atau [Nominal] jika ingin diskon di semua barang. NB: Kami sarankan masukkan semua barang sebelum melakukan diskon general</h4>
														<div class="widget5-group">
															<div class="widget5-item mr-2">
																<span class="widget5-info">Tentukan Diskon 1</span>
																<span class="widget5-value"><input id="diskon1general" type="text" class="form-control" value="0" placeholder="Tentukan Diskon 1"></span>
															</div>
															<div class="widget5-item mr-2">
																<span class="widget5-info">Tentukan Diskon 2</span>
																<span class="widget5-value"><input id="diskon2general" type="text" class="form-control" value="0" placeholder="Tentukan Diskon 2"></span>
															</div>
                                                            <div class="widget5-item mr-2">
																<span class="widget5-info">Tentukan After Diskon 1</span>
																<span class="widget5-value"><input id="adiskon1general" type="text" class="form-control" value="0" placeholder="Tentukan After Diskon 1"></span>
															</div>
                                                            <div class="widget5-item mr-2">
																<span class="widget5-info">Tentukan After Diskon 2</span>
																<span class="widget5-value"><input id="adiskon2general"type="text" class="form-control" value="0" placeholder="Tentukan After Diskon 2"></span>
															</div>
														</div>
													</div>
													<!-- END Widget -->
												</div>
											</div>
											<!-- END Portlet -->
										</div>
									</div>
									<!-- END Portlet -->
								</div>
							</div>
						</div>
                        <table id="keranjangpembelian" class="hovercolor table table-bordered table-striped table-hover nowrap">
                            <thead>
                                <tr style="text-align: center">
                                    <th>Nama Barang</th>
                                    <th>Kode Barang</th>
                                    <th>Stok Sebelum</th>
                                    <th>Stok Jumlah Beli</th>
                                    <th>Display</th>
                                    <th>Gudang</th>
                                    <th>Harga Suplier</th>
                                    <th>Exp</th>
                                    <th>Sub Total</th>
                                    <th>Diskon 1</th>
                                    <th>Diskon 2</th>
                                    <th>PPN</th>
                                    <th>After Diskon 1</th>
                                    <th>After Diskon 2</th>
                                    <th>Sub Total Pembelian</th>
                                    <th>HPP</th>
                                    <th>Beban Gaji</th>
                                    <th>Beban Promo</th>
                                    <th>Beban Packing</th>
                                    <th>Beban Transport</th>
                                    <th>HPP + Beban</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Nama Barang</th>
                                    <th>Kode Barang</th>
                                    <th>Stok Sebelum</th>
                                    <th>Stok Jumlah Beli</th>
                                    <th>Display</th>
                                    <th>Gudang</th>
                                    <th>Harga Suplier</th>
                                    <th>Exp</th>
                                    <th>Sub Total</th>
                                    <th>Diskon 1</th>
                                    <th>Diskon 2</th>
                                    <th>PPN</th>
                                    <th>After Diskon 1</th>
                                    <th>After Diskon 2</th>
                                    <th>Sub Total Pembelian</th>
                                    <th>HPP</th>
                                    <th>Beban Gaji</th>
                                    <th>Beban Promo</th>
                                    <th>Beban Packing</th>
                                    <th>Beban Transport</th>
                                    <th>HPP + Beban</th>
                                    <th>Aksi</th>
                                </tr>
                            </tfoot>
                        </table>
                        <!-- END Datatable -->
                        <div class="form-group row">
                            <label for="bebanlainlain" class="col-sm-3 col-form-label">Biaya Lain-Lain. <pre>Beban akan dibagi rata dengan jumlah qty terbeli</pre></label>
                            <div class="col-sm-9">
                                <div class="input-group">
                                    <input readonly value="" type="text" id="bebanlainlain" class="form-control" placeholder="Tentukan Biaya Lain Lain. Ex: Biaya transport, Beban Ongkir">
                                </div>
                            </div>
                        </div>
                        <hr>
                        <button id="simpantransaksipembelian" class="tombolmelayang btn btn-success btn-block"><i class="fas fa-shopping-basket"></i> <?= $buttonsimpan ;?> </button>
                        <button id="simpansementara" class="tombolmelayang_kanan btn btn-success btn-block"><i class="fas fa-save"></i> Sementara </button>
                    </div>
                </div>
                <!-- END Portlet -->
            </div>
        </div>
    
<div class="modal fade" id="modalpilihsuplier" data-backdrop="static" data-keyboard="true" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Silahkan Pilih Suplier Yang Tersedia</h5>
                <button type="button" class="btn btn-label-danger btn-icon" data-dismiss="modal">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
            <input id="txtpencariansuplier" type="text" class="form-control mt-2" placeholder="Masukkan nama / kode suplier"><hr>
            <table id="admin_daftarsuplier" class="hovercolor table table-bordered table-striped table-hover nowrap">
                <thead>
                    <tr>
                        <th style="text-align:center">Aksi</th>
                        <th style="text-align:center">Kode Suplier</th>
                        <th style="text-align:center">Nama Suplier</th>
                        <th style="text-align:center">Alamat</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
                <tfoot>
                    <tr>
                        <th style="text-align:center">Aksi</th>
                        <th style="text-align:center">Kode Suplier</th>
                        <th style="text-align:center">Nama Suplier</th>
                        <th style="text-align:center">Alamat</th>
                    </tr>
                </tfoot>
            </table>
            </div>
            <div class="modal-footer">
            <p class="mb-0">Suplier akan ditampilkan pada semua status baik aktif maupun tidak aktif, gunakan pencarian beradasarkan KODE atau NAMA suplier guna mencari informasi suplier yang spesifik. Data ditampilkan per pencarian maximal 50 Data</p>
            </div>
        </div>
    </div>
</div>
<div class="modal fade mt-2" id="modalubahhargajual" data-backdrop="static" data-keyboard="true" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Silahkan Ubah Harga Jual</h5>
                <button type="button" class="btn btn-label-danger btn-icon" data-dismiss="modal">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
            <table id="tabel_ubahhargajual" class="hovercolor table table-bordered table-striped table-hover nowrap">
                <thead>
                    <tr>
                        <th style="text-align:center">Kode Item</th>
                        <th style="text-align:center">Nama Item</th>
                        <th style="text-align:center">Unit</th>
                        <th style="text-align:center">Harga Beli</th>
                        <th style="text-align:center">Harga Jual</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
                <tfoot>
                    <tr>
                        <th style="text-align:center">Kode Item</th>
                        <th style="text-align:center">Nama Item</th>
                        <th style="text-align:center">Unit</th>
                        <th style="text-align:center">Harga Beli</th>
                        <th style="text-align:center">Harga Jual</th>
                    </tr>
                </tfoot>
            </table>
            <button onclick="konfirmasiaksi()" class="btn btn-block btn-warning mt-2"><i class="fas fa-close"></i> Oke Selesai</button>
            </div>
            <div class="modal-footer">
            <p class="mb-0"><b style="color:red">CATATAN: </b>Silahkan ubah harga jual yang baru langsung pada form tersebut, maka secara otomatis akan langsung berubah di database pada tiap barang yang terpilih</p>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalItemDetail" data-backdrop="static" data-keyboard="true" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-body" id="modalItemContent">

        <div class="portlet-body">
            <div class="mb-3">
                <!-- BEGIN Nav -->
                <div class="nav nav-lines" id="nav1-tab">
                    <a class="nav-item nav-link active" id="nav1-home-tab" data-toggle="tab"
                        href="#nav1-home">Informasi Dasar</a>
                    <a class="nav-item nav-link" id="nav1grosirdanvoucher" data-toggle="tab"
                        href="#nav1-contact">Extra Mode</a>
                </div>
                <!-- END Nav -->
            </div>
            <!-- BEGIN Tab -->
            <div class="tab-content" id="nav1-tabContent">
                <div class="tab-pane fade show active" id="nav1-home">
                    <div class="form-group row">
                        <div class="col-md-6 col-sm-12 col-xs-12">
                            <div class="portlet">
                                <div class="portlet-header portlet-header-bordered">
                                    <h3 class="portlet-title">Informasi Dasar Barang</h3>
                                </div>
                                <div class="portlet-body">
                                    <div class="form-group row">
                                        <label for="kodebarang" class="col-sm-3 col-form-label">Kode
                                            Barang</label>
                                        <div class="col-sm-9">
                                            <div class="input-group">
                                                <input value="" type="text" readonly id="kodebarang" class="form-control" placeholder="Masukkan Kode Barang Produk">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="kodebarangqrcode" class="col-sm-3 col-form-label">QR Code
                                            Barang</label>
                                        <div class="col-sm-9">
                                            <div class="input-group">
                                                <input value="" type="text" readonly id="kodebarangqrcode" class="form-control"
                                                    placeholder="Masukkan Kode QR barang jika tersedia">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="namabarang" class="col-sm-3 col-form-label">Nama
                                            Barang</label>
                                        <div class="col-sm-9">
                                            <input value="" type="text" id="namabarang" class="form-control"
                                                placeholder="Masukan nama barang">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="beratbarang" class="col-sm-3 col-form-label">Berat
                                            Barang</label>
                                        <div class="col-sm-9">
                                            <div class="input-group">
                                                <input value="" id="beratbarang" type="text"
                                                    class="form-control" placeholder="Masukan berat barang">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">Gram [gr]</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="hargapokokpembelian" class="col-sm-3 col-form-label">Harga Pokok</label>
                                        <div class="col-sm-9">
                                            <div class="input-group">
                                                <input value="" type="text" id="hargapokokpembelian"
                                                class="form-control"
                                                placeholder="Masukkan Harga Pokok Pembelian">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="kodebarang" class="col-sm-3 col-form-label">Harga Jual Umum</label>
                                        <div class="col-sm-9">
                                            <div class="input-group">
                                                <input value="" type="text" id="hargajualumum"
                                                class="form-control" placeholder="Tentukan Harga Jual Umum">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <select class="form-control" id="pilihsatuan">
                                            <option value="PCS">[PCS] PCS</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12 col-xs-12">
                            <div class="portlet">
                                <div class="portlet-header portlet-header-bordered">
                                    <h3 class="portlet-title">Informasi Akuntansi Item</h3>
                                </div>
                                <div class="portlet-body">
                                    <div class="form-group row">
                                        <div class="col-md-6 col-sm-12 col-xs-12">
                                            <div class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input"
                                                    id="aktifkanbestbuy">
                                                <label class="custom-control-label"
                                                    for="aktifkanbestbuy">Aktifkan Best Buy</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="nav1-contact">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <!-- BEGIN Portlet -->
                        <div class="portlet">
                            <div class="portlet-body">
                                <div class="mb-3">
                                    <!-- BEGIN Nav -->
                                    <div class="nav nav-lines" id="nav1-tabvouchergrosir">
                                        <a class="nav-item nav-link active" id="tab_baranggrosir" data-toggle="tab" href="#nav1-grosir">Barang Grosir</a>
                                        <a class="nav-item nav-link" id="tab_tambahan" data-toggle="tab" href="#nav1-tambahan">Varian Non Stok</a>
                                    </div>
                                    <!-- END Nav -->
                                </div>
                                <!-- BEGIN Tab -->
                                <div class="tab-content" id="nav1-tabContent">
                                    <div class="tab-pane fade show active" id="nav1-grosir">
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="aktifbaranggrosir">
                                            <label class="custom-control-label" for="aktifbaranggrosir">Aktifkan Sistem Grosir</label>
                                        </div>
                                        <div class="form-group row">
                                            <!-- BEGIN Table -->
                                            <div class="col-md-9 col-sm-12 col-xs-12">
                                                <table id="tabelhargagrosir" class="table table-sm mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Nama Barang</th>
                                                            <th scope="col">Minimal Beli</th>
                                                            <th scope="col">Harga Jual</th>
                                                            <th scope="col">Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    </tbody>
                                                </table>
                                                <!-- END Table -->
                                                <button disabled id="tambahbarangbonus" class="btn-block btn btn-primary">Tambah Baris Grosir</button>
                                            </div>
                                            <div class="col-md-3 col-sm-12 col-xs-12">
                                                <div class="portlet">
                                                    <div class="portlet-header portlet-header-bordered">
                                                        <h3 class="portlet-title">Informasi</h3>
                                                    </div>
                                                    <div class="portlet-body">
                                                        <p align="justify">kebijakan penetapan harga dengan
                                                            cara memberikan potongan harga, baik untuk
                                                            penjualan kontan/tunai/piutang maupun penjualan
                                                            dalam jumlah banyak.</p>
                                                        <p align="justify">contoh: <br> Beli 2 - 5 Harga
                                                            9500<br> Beli 6 - 10 Harga 8500 <br>* Beli 11
                                                            Harga 8300<br><br> Kelipatan terakhir akan
                                                            digunakan sebagai harga untuk kuantiti
                                                            selanjutnya sampai maksimal stok tersedia</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show" id="nav1-tambahan">
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="aktifkanbarangtambahan">
                                            <label class="custom-control-label" for="aktifkanbarangtambahan">Aktifkan Tambahan Barang</label>
                                        </div>
                                        <div class="form-group row">
                                            <!-- BEGIN Table -->
                                            <div class="col-md-9 col-sm-12 col-xs-12">
                                                <table id="tabelbarangtambahan" class="table table-sm mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Nama Barang</th>
                                                            <th scope="col">Tambahan Harga Jual</th>
                                                            <th scope="col">Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    </tbody>
                                                </table>
                                                <!-- END Table -->
                                                <button disabled id="barangtambahan" class="btn-block btn btn-primary">Tambah Baris</button>
                                            </div>
                                            <div class="col-md-3 col-sm-12 col-xs-12">
                                                <div class="portlet">
                                                    <div class="portlet-header portlet-header-bordered">
                                                        <h3 class="portlet-title">Informasi</h3>
                                                    </div>
                                                    <div class="portlet-body">
                                                        <p align="justify">Pada informasi tab ini berfungsi sebagai tambahan barang jika ingin ditambahkan seperti Beli barang A mendapat barang B,C. Sistem barang B, C tidak terkait dengan HPP ataupun stok, hanya akan menambah NOMINAL harga jual + harga bonus yang ditentukan dan harus konfirmasi manual dari KASIR</p>
                                                        <p align="justify">Contoh: Beli Minuman ICE BLEND HJ:2000, HPP:1500<br>
                                                        1. Toping +1000<br>
                                                        2. Gula +500<br>
                                                        Maka harga jual akan diubah menajdi 2000+1000+500 = 3500 sebagai HJ:3500 tetapi HPP tetap 1500
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- END Portlet -->
                        </div>
                    </div>
                </div>
                <!-- END Tab -->
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <input style="visibility: hidden;" type="checkbox" id="isinsert">
        <button id="btn_simpan_tambahitem" class="btn btn-success mr-2"><i class="fas fa-save"></i> Simpan </button>
        <button type="button" class="btn btn-danger" data-dismiss="modal">Tutup Halaman</button>
      </div>
    </div>
  </div>
</div>

<script type="text/javascript" src="<?=base_url();?>scripts/globalfn.js"></script>
<script type="text/javascript" src="<?=base_url();?>scripts/pembelian/tambahpembelian.js"></script>
<script type="text/javascript" src="<?=base_url();?>scripts/masterdata/masteritem2.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/fixedcolumns/3.2.1/js/dataTables.fixedColumns.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/plug-ins/1.13.4/api/sum().js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/v/ju/jqc-1.12.4/dt-1.10.20/kt-2.5.1/datatables.min.js"></script>
<script type="text/javascript">
let daftarkeranjang = "";
let anjumlahbeli = [],anstokdisplay = [],anstokgudang = [],hargasuplier = [],/*kadaluarsa = []*/subtotal = [],diskon1 = [],diskon2 = [],ppn = [],adiskon1 = [],adiskon2 = [],subtotalhpp = [],hpp = [],bebangaji = [],bebanpromo = [],bebanpacking = [],bebantransport = [],hppbeban = [], afbelihb = [], afbelihj = [];
let anbebanlainlain = new AutoNumeric("#bebanlainlain", {decimalCharacter : ',',digitGroupSeparator : '.',})
let iseditjs = ('<?= $isedit ?>' === 'true');
let dariPembelian = 1;
/* master item sourcut */
let beratbarang = new AutoNumeric("#beratbarang", {decimalCharacter : ',',digitGroupSeparator : '.',})
let hargapokokpembelian = new AutoNumeric("#hargapokokpembelian", {decimalCharacter : ',',digitGroupSeparator : '.',})
let hargajualumum = new AutoNumeric("#hargajualumum", {decimalCharacter : ',',digitGroupSeparator : '.',})    
function ambilKeranjangLocal() { 
    if (iseditjs) { 
        localStorage.setItem('keranjangPembelian', JSON.stringify(<?= json_encode($detailpembelian) ?>)); 
    } 
    return JSON.parse(localStorage.getItem('keranjangPembelian')) || []; 
}
function loadkeranjangLocalStorage(){
    daftarkeranjang = $("#keranjangpembelian").DataTable({
        columnDefs: [
        {
            targets: [7, 16,17,18,19,20], // urutan kolom BEBANGAJI (0-based index)
            className: 'kolom-tersembunyi'
        }
        ],
        language: {"url": "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"},
        scrollY: "100vh",
        destroy: true,
        keys: true,
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        ordering: false,
        
        /*fixedColumns: {
            leftColumns: 1,
            rightColumns: 1,
        },*/
        data: ambilKeranjangLocal(),
        // Definisi kolom sesuai dengan HTML (23 kolom)
        columns: [
            { 
                data: 'NAMABARANG',
               render: function(data, type, row, meta) {
                    return `
                        <a href="javascript:void(0)" 
                        style="cursor: pointer; color: black; text-decoration: none;"
                        onclick="showItemDetailSourcut('${row.KODEBARANG}')"
                        class="fw-bold nama-barang-link">
                        ${data}
                        </a>
                    `;
                }
            },
            { data: 'KODEBARANG' },      // 1 - Kode Barang  
            { data: 'STOKSEBELUM' },     // 2 - Stok Sebelum
            { 
                render: function(data, type, row, meta) {
                    let val = row.JUMLAHBELI ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 100%" 
                            type="text" 
                            id="jumlahbeli_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { JUMLAHBELI: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.DISPLAY ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 75px" 
                            type="text" 
                            id="display_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { DISPLAY: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.GUDANG ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 75px" 
                            type="text" 
                            id="gudang_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { GUDANG: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.HARGASUPLIER ?? row.HARGABELI;
                    return `
                        <input 
                            style="text-align: right;width: 125px" 
                            type="text" 
                            id="hargasuplier_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { HARGASUPLIER: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.EXP ?? '';
                    return `
                        <input 
                            type="text" 
                            id="exp_${meta.row}" 
                            class="form-control datepicker" 
                            value="${val || ''}" 
                            onchange="catchEnter(${meta.row}, 'hs')">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.SUBTOTAL ?? (parseFloat(row.JUMLAHBELI) * parseFloat(row.HARGABELI));
                    return `
                        <input 
                            style="text-align: right;width: 200px" 
                            type="text" 
                            id="subtotal_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { SUBTOTAL: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.DISKON1 ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 75px" 
                            type="text" 
                            id="diskon1_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { DISKON1: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.DISKON2 ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 75px" 
                            type="text" 
                            id="diskon2_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { DISKON2: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.PPN ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 75px" 
                            type="text" 
                            id="ppn_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { PPN: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.ADISKON1 ?? row.AFTERDISKON1;
                    return `
                        <input 
                            style="text-align: right;width: 75px" 
                            type="text" 
                            id="adiskon1_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { ADISKON1: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.ADISKON2 ?? row.AFTERDISKON2;
                    return `
                        <input 
                            style="text-align: right;width: 75px" 
                            type="text" 
                            id="adiskon2_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { ADISKON2: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.SUBTOTALHPP ?? ((parseFloat(row.JUMLAHBELI) * parseFloat(row.HARGABELI)) - parseFloat(row.DISKON1) - parseFloat(row.DISKON2) + parseFloat(row.PPN) - parseFloat(row.AFTERDISKON1) - parseFloat(row.AFTERDISKON2));
                    return `
                        <input 
                            style="text-align: right;width: 200px" 
                            type="text" 
                            id="subtotalhpp_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { SUBTOTALHPP: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.HPP ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 125px" 
                            type="text" 
                            id="hpp_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { HPP: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.BEBANGAJI ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 100px" 
                            type="text" 
                            id="bebangaji_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { BEBANGAJI: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.BEBANPROMO ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 100px" 
                            type="text" 
                            id="bebanpromo_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { BEBANPROMO: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.BEBANPACKING ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 100px" 
                            type="text" 
                            id="bebanpacking_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { BEBANPACKING: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    let val = row.BEBANTRANSPORT ?? 0;
                    return `
                        <input 
                            style="text-align: right;width: 100px" 
                            type="text" 
                            id="bebantransport_${meta.row}" 
                            class="form-control" 
                            value="${val}" 
                            onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { BEBANTRANSPORT: AutoNumeric.getNumber(this) })">
                    `;
                }
            },
            { 
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        let val = row.HPPBEBAN ?? 0;
                        return `
                            <input 
                                style="text-align: right;width: 125px" 
                                type="text" 
                                id="hppbeban_${meta.row}" 
                                class="form-control" 
                                value="${val}" 
                                onchange="catchEnter(${meta.row}, 'hs');updateKeranjangItem(${meta.row}, { HPPBEBAN: AutoNumeric.getNumber(this) })">
                        `;
                    }
                    return '';
                }
            },
            { data: null, defaultContent: '<button class="btn btn-danger hapus-item"><i class="fa fa-trash"></i></button>' } // 21 - Aksi
        ],
        drawCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var data = daftarkeranjang.rows().data();
            let totalbelanja = 0, totalbelanjanett = 0;
            
            data.each(function(value, index) {
                // Set datepicker for expiry date column (index 7)
                $('#'+daftarkeranjang.cell(index,7).nodes().to$().find('input').prop('id')).val(moment().format('DD-MM-YYYY'));
                $('#'+daftarkeranjang.cell(index,7).nodes().to$().find('input').prop('id')).datepicker({
                    todayHighlight: true,
                    format:'dd-mm-yyyy'
                });
                
                // Initialize AutoNumeric for each input field if not already initialized
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,3).nodes().to$().find('input').prop('id'))) { 
                    anjumlahbeli[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,3).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,4).nodes().to$().find('input').prop('id'))) { 
                    anstokdisplay[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,4).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,5).nodes().to$().find('input').prop('id'))) { 
                    anstokgudang[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,5).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,6).nodes().to$().find('input').prop('id'))) { 
                    hargasuplier[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,6).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,8).nodes().to$().find('input').prop('id'))) { 
                    subtotal[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,8).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,9).nodes().to$().find('input').prop('id'))) { 
                    diskon1[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,9).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,10).nodes().to$().find('input').prop('id'))) { 
                    diskon2[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,10).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,11).nodes().to$().find('input').prop('id'))) { 
                    ppn[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,11).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,12).nodes().to$().find('input').prop('id'))) { 
                    adiskon1[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,12).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,13).nodes().to$().find('input').prop('id'))) { 
                    adiskon2[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,13).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,14).nodes().to$().find('input').prop('id'))) { 
                    subtotalhpp[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,14).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,15).nodes().to$().find('input').prop('id'))) { 
                    hpp[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,15).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,16).nodes().to$().find('input').prop('id'))) { 
                    bebangaji[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,16).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,17).nodes().to$().find('input').prop('id'))) { 
                    bebanpromo[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,17).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,18).nodes().to$().find('input').prop('id'))) { 
                    bebanpacking[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,18).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,19).nodes().to$().find('input').prop('id'))) { 
                    bebantransport[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,19).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
                if (!AutoNumeric.getAutoNumericElement("#"+daftarkeranjang.cell(index,20).nodes().to$().find('input').prop('id'))) { 
                    hppbeban[index] = new AutoNumeric("#"+daftarkeranjang.cell(index,20).nodes().to$().find('input').prop('id'), {
                        decimalCharacter : ',',
                        digitGroupSeparator : '.'
                    });
                }
            });
        },
        initComplete: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var data = daftarkeranjang.rows().data();
            let totalbelanja = 0, totalbelanjanett = 0, totalppnmasukan = 0;
            
            data.each(function(value, index) {
                if (ppn[index].getNumber() > 0) {
                    $("#aktifkanpajakmasukan").prop("checked", true);
                }
                totalbelanja = totalbelanja + subtotalhpp[index].getNumber();
                totalbelanjanett = totalbelanjanett + (hppbeban[index].getNumber() * anjumlahbeli[index].getNumber());
                totalppnmasukan = totalppnmasukan + ppn[index].getNumber();
                
                $('#totalpembelian').html(formatuang(totalbelanja.toFixed(2), 'id-ID', 'IDR'));
                $('#totalpembeliannett').html(formatuang(totalbelanjanett.toFixed(2), 'id-ID', 'IDR'));
                $('#totalppnmasukan').html(formatuang(totalppnmasukan.toFixed(2), 'id-ID', 'IDR'));
            });
            
            
            if (typeof isedit !== 'undefined' && isedit === "true") {
                hitungdenganinfototal();
            }
        }
    }).on('key-focus', function(e, datatable, cell, originalEvent) {
        $('input', cell.node()).focus();
    }).on("focus", "td input", function() {
        $(this).select();
    });
}

function panggilhargajual(notranskasi){
    formubahhargajual = $("#tabel_ubahhargajual").DataTable({
        language:{"url":"https://cdn.datatables.net/plug-ins/1.10.25/i18n/Indonesian.json"},
        scrollY: "100vh",
        keys: true,
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        ordering: false,
        destroy: true,
        ajax: {
            "url": baseurljavascript + 'pembelian/ubahhargajualsetelahbeli',
            "type": "POST",
            "data": function (d) {
                d.NOTA = notranskasi;
            }
        },
        drawCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var data = formubahhargajual.rows().data();
            data.each(function (value, index) {
                if (!AutoNumeric.getAutoNumericElement("#"+formubahhargajual.cell(index,3).nodes().to$().find('input').prop('id'))) { afbelihb[index] = new AutoNumeric("#"+formubahhargajual.cell(index,3).nodes().to$().find('input').prop('id'), {decimalCharacter : ',',digitGroupSeparator : '.',});}
                if (!AutoNumeric.getAutoNumericElement("#"+formubahhargajual.cell(index,4).nodes().to$().find('input').prop('id'))) { afbelihj[index] = new AutoNumeric("#"+formubahhargajual.cell(index,4).nodes().to$().find('input').prop('id'), {decimalCharacter : ',',digitGroupSeparator : '.',});}
            });
        },
    }).on( 'key-focus', function ( e, datatable, cell, originalEvent ) {
        $('input', cell.node()).focus();
    }).on("focus", "td input", function(){
        $(this).select();
    });
    formubahhargajual.on('key', function (e, dt, code) {
        if (code === 13) {
            formubahhargajual.keys.move('down');
        }
    })
}
function tampiljatuhtempo(){
    if ($('#jenispembayaran').val() == "KREDIT"){
        $('#jatuhtempoform').show()
    }else{
        $('#jatuhtempoform').hide()
    }
}
var catchEnterAfB = debounce(function(index) {
    ubahhargajualafb(index)
}, 500);
function ubahhargajualafb(index){
    $.ajax({
        url: baseurljavascript + 'pembelian/ubahhargajualafb',
        method: 'POST',
        dataType: 'json',
        data: {
            KODEITEM : $("#kodeitem"+index).val(),
            HARGAJUAL : afbelihj[index].getNumber(),
        },
        success: function (response) {
            if (response[0].success == "true"){
                return Swal.fire({
                    icon: 'success',
                    html: 'Horee.. Informasi barang berhasil diubah<br>KODE ITEM: '+$("#kodeitem"+index).val()+'<br>NAMA ITEM: '+$("#namaitem"+index).val(),
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                    position: 'top-right'
                })
            }else{
                Swal.fire(
                    'Gagal.. Uhhhhh!',
                    'Tidak ada yang di perbaharui. Silahkan cek pada error log data di server',
                    'error'
                )
            }
            
        }
    });
}
function konfirmasiaksi(){
swal.fire({
    title: "Oke, Ubah harga selesai",
    text: "Fiyuhh pembelian selesai. Silahkan pilih apakah anda ingin melanjutkan penginputan data atau kembali ke daftar pembelian",
    icon: 'success',
    showCancelButton:true,
    confirmButtonText: "Oke, Lanjut Pembelian!",
    cancelButtonText: "Ke Daftar Aja!",
}).then(function(result){
    kosongkankeranjanglokal();
    if(result.isConfirmed){           
        location.href = baseurljavascript+"pembelian/formpembelian";
    }else{
        location.href = baseurljavascript+"pembelian/daftarpembelian";
    }
})
}
$(document).ready(function () {
    $('#pilihsatuan').select2({
        allowClear: true,
        placeholder: 'Tentukan satuan item',
        ajax: {
            url: baseurljavascript + 'masterdata/jsonsatuanselect',
            method: 'POST',
            dataType: 'json',
            delay: 500,
            data: function (params) {
                return {
                    DIMANA1: (typeof params.term === "undefined" ? "" : params.term),
                    DIMANA10: session_kodeunikmember,
                }
            },
            processResults: function (data) {
                parseJSON = JSON.parse(data);
                return {
                    results: $.map(parseJSON, function (item) {
                        return {
                            text: "[" + item.idsatuan + "] " + item.namasatuan,
                            id: item.idsatuan,
                        }
                    })
                }
            },
            error: function(xhr, status, error) {
                toastr["error"](xhr.responseJSON.message);
            }
        },
    });
    $('#jatuhtempoform').hide()
    <?php
    if ($isedit == "true"){ ?>
        anbebanlainlain.set(<?= $biayalainlain ;?>)
        $('#tgltrx').val('<?= $tanggaltrx ;?>');
    <?php }else{ ?>
        anbebanlainlain.set(0)
        $('#tgltrx').val(moment().format('DD-MM-YYYY'));
    <?php } ?>
    $("#tgltrx").datepicker({todayHighlight: true,format:'dd-mm-yyyy',});
    $('#jenispembayaran').select2({
        allowClear: true,
        placeholder: 'Pilih Sumber Dana',
        ajax: {
            url: baseurljavascript + 'masterdata/jenispembayarantransaksi',
            method: 'POST',
            dataType: 'json',
            delay: 500,
            data: function (params) {
                return {
                    NAMAPARAMETER: (typeof params.term === "undefined" ? "" : params.term),
                }
            },
            processResults: function (data) {
                parseJSON = JSON.parse(data);
                return {
                    results: $.map(parseJSON, function (item) {
                        return {
                            text: item.namatrx,
                            id: item.kodetrx,
                        }
                    })
                }
            },
            error: function(xhr, status, error) {
                toastr["error"]("Terjadi kesalahan. Silahkan coba lagi nanti atau hubungi Administrator / TIM IT");
            }
        },
    });
    loadkeranjangLocalStorage();
    daftarkeranjang.on('key', function(e, dt, code) {
        if (code === 13) {
            daftarkeranjang.keys.move('down');
        }
    });

    $('#pilihperusahaan').select2({
        allowClear: true,
        placeholder: 'Silahkan tentukan transaksi pembelian a.n perusahaan',
        ajax: {
            url: baseurljavascript + 'masterdata/jsonpilihperusahaan',
            method: 'POST',
            dataType: 'json',
            delay: 500,
            data: function (params) {
                return {
                    NAMAPERUSAHAAN: (typeof params.term === "undefined" ? "" : params.term),
                    KODEUNIKMEMBER: session_kodeunikmember,
                }
            },
            processResults: function (data) {
                parseJSON = JSON.parse(data);
                return {
                    results: $.map(parseJSON, function (item) {
                        return {
                            text: "[" + item.kodepursahaan + "] " + item.namaperusahaan,
                            id: item.kodepursahaan,
                        }
                    })
                }
            },
            error: function(xhr, status, error) {
                toastr["error"](xhr.responseJSON.message);
            }
        },
    });
    panggilhargajual(null);
});
</script>
<?= $this->include('backend/panggildaftarbarang') ?>
<?= $this->endSection(); ?>