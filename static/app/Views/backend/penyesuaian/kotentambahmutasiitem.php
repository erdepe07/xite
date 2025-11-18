<?= $this->extend('backend/main'); ?>
<?= $this->section('kontenutama'); ?>
<?= $this->include('backend/header') ?>
<style>
    .tombolmelayang{ width:300px; height: 40px; position: fixed; background-color: blue; bottom: 0; right: 40%; z-index: 999999;}
</style>
<div class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="portlet">
                    <div class="portlet-body">
                        <!-- BEGIN Form Row -->
                        <div class="row portlet-row-fill-md h-100">
                            <div class="col-md-12 col-xl-12">
                                <!-- BEGIN Portlet -->
                                <div class="portlet portlet-primary">
                                    <div class="portlet-header">
                                        <div class="portlet-icon">
                                            <i class="fa fa-box"></i>
                                        </div>
                                        <h3 class="portlet-title">Informasi Mutasi Item</h3>
                                    </div>
                                    <div class="portlet-body">
                                        <!-- BEGIN Portlet -->
                                        <div class="portlet mb-2">
                                            <div class="portlet-body">
                                                <!-- BEGIN Widget -->
                                                <div class="widget5">
                                                    <h4 class="widget5-title"></h4>
                                                    <div class="widget5-group">
                                                        <div class="widget5-item mr-2">
                                                            <span class="widget5-info">Asal Outlet</span>
                                                            <span class="widget5-value"><select class="form-control" id="cmblokasioutletasal"></select></span>
                                                        </div>
                                                        <div class="widget5-item mr-2">
                                                            <span class="widget5-info">Lokasi Asal Item</span>
                                                            <span class="widget5-value"><select id="lokasiitemasal" class="selectpicker" data-live-search="true">
                                                                <option value="D"> Ambil Dari Display</option>
                                                                <option value="G" selected> Ambil Dari Gudang</option>
                                                                <option value="R"> Ambil Dari Retur</option>
                                                            </select></span>
                                                        </div>
                                                        <div class="widget5-item mr-2">
                                                            <span class="widget5-info"> Tujuan Outlet</span>
                                                            <span class="widget5-value"><select class="form-control" id="cmblokasioutlettujuan"></select></span>
                                                        </div>
                                                        <div class="widget5-item mr-2">
                                                            <span class="widget5-info">Lokasi Tujuan Item</span>
                                                            <span class="widget5-value"><select id="lokasiitemtujuan" class="selectpicker" data-live-search="true">
                                    <option value="D"> Pindah Ke Display</option>
                                    <option value="G"> Pindah Ke Gudang</option>
                                    <option value="R"> Pindah Ke Retur</option>
                                </select></span>
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
                        <div class="row">
                            <div class="col mb-2">
                                <!-- BEGIN Rich List -->
								<div class="rich-list-item w-100 p-0">
									<div class="rich-list-prepend" style="width: 100px;">
										<!-- BEGIN Input Group -->
                                        <div class="input-group-icon input-group-lg">
                                            <div class="input-group-prepend">
                                                <i class="fa fa-cart-plus text-primary"></i>
                                            </div>
                                            <input id="qtykeluarkasir" type="text" class="form-control" value="1" placeholder="QTY">
                                        </div>
                                        <!-- END Input Group -->
									</div>
									<div class="rich-list-content">
										<!-- BEGIN Input Group -->
                                        <div class="input-group-icon input-group-lg">
                                            <div class="input-group-prepend ml-1">
                                                <i class="fa fa-search text-primary"></i>
                                            </div>
                                            <input id="katakuncipencariankasir" type="text" class="form-control" placeholder="Ketikkan Kode item / Nama item">
                                        </div>
                                        <!-- END Input Group -->
									</div>
									<div class="rich-list-append">
										<button id="bersihkanform" class="btn btn-flat-info btn-icon mr-2 btn-lg">
											<i class="fa fa-redo-alt"></i>
										</button>
										<button class="btn btn-flat-info btn-icon mr-2 btn-lg" id="panggilbarangglobalmutasi">
											<i class="fa fa-boxes"></i>
										</button>
									</div>
								</div>
								<!-- END Rich List -->
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4">
                                <div class="input-group">
                                    <input value="" type="text" id="notrxmutasi" class="form-control" style="font-size:15px" placeholder="Buat Nomor Nota Anda">
                                    <div class="input-group-prepend">
                                        <span style="cursor:pointer;" onclick="loadnotranskasi()" id="generateiditem" class="input-group-text btn-warning btn">Generate Nota</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <input id="keteranganmutasi" type="text" class="form-control" style="font-size:15px" placeholder="Tentukan keterangan mutasi berikut">
                            </div>
                            <div class="col-md-4">
                                <div class="input-group">
                                    <input id="tanggaltransaksiopname" type="text" style="font-size:15px" class="form-control" placeholder="Pilih Tanggal Transaksi">
                                    <div class="input-group-append">
                                        <span class="input-group-text">
                                            <i class="fa fa-calendar"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- END Form Row -->
                        <hr>
                        <b>NB : </b>[D] = Display [G] = Gudang [R] = Retur
                        <!-- BEGIN Datatable -->
                        <table id="keranjangmutasi" class="table table-bordered table-striped table-hover nowrap">
                            <thead>
                                <tr>
                                    <th>Aksi</th>
                                    <th>Kode Item</th>
                                    <th>Nama Item</th>
                                    <th>Unit</th>
                                    <th>Stok Awal</th>
                                    <th>Stok Mutasi</th>
                                    <th>Nominal HPP</th>
                                    <th>Outlet Awal</th>
                                    <th>Outlet Tujuan</th>
                                    <th>Awal Lokasi</th>
                                    <th>Tujan Lokasi</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Aksi</th>
                                    <th>Kode Item</th>
                                    <th>Nama Item</th>
                                    <th>Unit</th>
                                    <th>Stok Awal</th>
                                    <th>Stok Mutasi</th>
                                    <th>Nominal HPP</th>
                                    <th>Outlet Awal</th>
                                    <th>Outlet Tujuan</th>
                                    <th>Awal Lokasi</th>
                                    <th>Tujan Lokasi</th>
                                </tr>
                            </tfoot>
                        </table>
                        <!-- END Datatable -->
                        <button onclick="simpantransaksimutasiitem()" id="simpantrxpenyesuaian" class="tombolmelayang btn btn-success btn-block"><i class="fas fa-box-open"></i> Transaksi Mutasi Item </button>
                    </div>
                </div>
                <!-- END Portlet -->
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="<?=base_url();?>scripts/penyesuaian/mutasiitem.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>
<script src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<?= $this->include('backend/panggildaftarbarang') ?>
<?= $this->endSection(); ?>