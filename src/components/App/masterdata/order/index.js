import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import {
  DEFAULT_WHERE,
  generateNo,
  getFetchWhere,
  getPeriode,
  noData,
  toCurrency,
  toDate,
  toExcel,
  ToastQ,
  dateIndo,
  statusOrder,
  statusPengambilan,
  toRp,
} from "../../../../helper";
import {
  getOrderMasterAction,
  getOrderExcelAction,
  getResiAction,
  getStokisAction,
} from "../../../../redux/actions/masterdata/order.action";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import SelectCommon from "../../../common/SelectCommon";
import TableCommon from "../../../common/TableCommon";

class IndexOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      periode: "",
      where_data: DEFAULT_WHERE,
      data: [],
      isDisableButtonResi: true,
      checkedAll: false,
      status_data: [
        { value: "", label: "semua status" },
        { value: "0", label: "Menunggu Pembayaran" },
        { value: "1", label: "Diproses" },
        { value: "2", label: "Berhasil" },
        { value: "3", label: "Diterima" },
        { value: "4", label: "Ditolak" },
      ],
      status: "",
      kolom_data: [
        { value: "kd_trx", label: "Kode Transaksi" },
        { value: "pembeli", label: "pembeli" },
      ],
      kolom: "",
      stokis_data: [],
      stokis: "",
      resi_data: [],
      resi: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataExcel !== this.props.dataExcel) {
      this.getExcel(this.props);
    }
  }
  getExcel(props) {
    if (props.dataExcel !== undefined) {
      if (props.dataExcel.length > 0) {
        let totOngkir = 0;
        let totBayar = 0;
        let content = [];
        props.dataExcel.forEach((v, i) => {
          totOngkir = totOngkir + parseFloat(v.ongkir);
          totBayar = totBayar + parseFloat(v.grand_total);
          content.push([
            dateIndo(v.created_at),
            v.status_st,
            v.kd_trx,
            v.title,
            toCurrency(parseFloat(v.subtotal).toFixed(0)),
            toCurrency(parseFloat(v.ongkir).toFixed(0)),
            toCurrency(parseFloat(v.grand_total).toFixed(0)),
            v.fullname,
            v.metode_pembayaran,
            v.layanan_pengiriman,
            v.main_address,
          ]);
        });
        toExcel(
          "LAPORAN TRASANSAKSI PENJUALAN",
          `${this.state.periode.split("-")[0]} - ${
            this.state.periode.split("-")[1]
          }`,
          [
            "TANGGAL",
            "STATUS",
            "KODE",
            "NAMA BARANG",
            "HARGA",
            "ONGKIR",
            "TOTAL",
            "PENERIMA",
            "METODE PEMBAYARAN",
            "LAYANAN",
            "ALAMAT",
          ],
          content,
          [
            [""],
            [""],
            [
              "TOTAL",
              "",
              "",
              "",
              "",
              toCurrency(`${totOngkir.toFixed(0)}`),
              toCurrency(`${totBayar.toFixed(0)}`),
            ],
          ]
        );
      }
    }
  }
  printDocumentXLsx = (param) => {
    let datefrom = this.state.where_data.split("&")[1];
    let dateto = this.state.where_data.split("&")[2];
    let where = `page=1&perpage=${param}&${datefrom}&${dateto}`;
    if (
      this.state.any !== null &&
      this.state.any !== undefined &&
      this.state.any !== ""
    ) {
      where += `&q=${this.state.any}`;
    }
    this.props.dispatch(getOrderExcelAction(where));
  };
  handleGet(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let periode = getPeriode(where.split("&"));
      let state = {
        where_data: where,
        periode: periode,
      };
      this.setState(state);
      this.props.dispatch(getOrderMasterAction(where));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.where_data, pageNumber);
  }

  handleChange(e, i) {
    let data = this.state.data;
    data[i].resi = e.target.value;
    this.setState({ data: data });
  }

  componentWillReceiveProps(nextProps) {
    let resiData = [];
    let stokisData = [];
    let masterData = [];
    if (nextProps.dataResi !== undefined && nextProps.dataResi.length > 0) {
      nextProps.dataResi.map((res, key) => {
        resiData.push({
          value: res.resi,
          label: `${res.resi} | ${res.stockis}`,
        });
      });
      this.setState({ resi_data: resiData });
    }
    if (nextProps.dataStokis !== undefined && nextProps.dataStokis.length > 0) {
      nextProps.dataStokis.map((res, key) => {
        stokisData.push({
          value: res.id_stockis,
          label: `${res.stockis} | ${res.jumlah_transaksi} transaksi`,
        });
      });
      this.setState({ stokis_data: stokisData });
    }
    if (nextProps.dataMaster !== undefined && nextProps.dataMaster.length > 0) {
      nextProps.dataMaster.map((res, key) => {
        Object.assign(res, { checked: false });
        masterData.push(res);
      });
      this.setState({ data: masterData });
    }
  }
  componentWillMount() {
    this.props.dispatch(getResiAction());
    this.props.dispatch(getStokisAction());
  }

  handleCheck(e, i = null) {
    let col = e.target.name;
    let val = e.target.checked;
    let data = this.state.data;
    if (col === "checkAll") {
      this.setState({ checkedAll: val });
      data.map((res) => Object.assign(res, { checked: val }));
    } else {
      data[i].checked = val;
    }
    this.setState(data);
    setTimeout(() => this.handleIsDisabledButton(!val), 100);
  }

  handleIsDisabledButton(res) {
    let isFalse = res;
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].checked) {
        isFalse = false;
        break;
      }
    }

    this.setState({ isDisableButtonResi: isFalse });
  }

  render() {
    const { paginationMaster, dataMaster } = this.props;
    const {
      isDisableButtonResi,
      status_data,
      kolom_data,
      resi_data,
      resi,
      stokis_data,
      stokis,
      data,
      checkedAll,
    } = this.state;
    console.log("checkall", checkedAll);

    return (
      <Layout page={"order"}>
        <HeaderGeneralCommon
          col="col-md-4"
          callbackGet={(res) => {
            this.handleGet(res);
            this.setState();
          }}
          isOther={true}
          otherName="status"
          otherState="status"
          otherData={status_data}
          isColumn={true}
          columnData={kolom_data}
          isPeriode={true}
          pathName="laporanTransaksiPenjualan"
          callbackExport={() =>
            this.printDocumentXLsx(
              paginationMaster.per_page * paginationMaster.last_page
            )
          }
          renderFilterHtml={
            <div className="col-md-8">
              <div className="row">
                <div className={`col-6 col-xs-6 col-md-6`}>
                  <SelectCommon
                    label={"Stokis"}
                    options={stokis_data}
                    callback={(res) => {}}
                    dataEdit={stokis}
                  />
                </div>
                <div className={`col-6 col-xs-6 col-md-6`}>
                  <SelectCommon
                    label={"Resi"}
                    options={resi_data}
                    callback={(res) => {}}
                    dataEdit={resi}
                  />
                </div>
              </div>
            </div>
          }
        />
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <input
                type="checkbox"
                id="exampleCheck1"
                name="checkAll"
                checked={checkedAll}
                value={checkedAll}
                onChange={(e) => this.handleCheck(e, null)}
              />
              <label
                style={{
                  marginLeft: "5px",
                }}
              >
                Ceklis semua
              </label>
              <br />
              <button
                disabled={isDisableButtonResi}
                className="btn btn-primary"
                style={{ cursor: isDisableButtonResi ? "not-allowed" : "" }}
              >
                Buat Resi
              </button>
            </div>
          </div>
        </div>
        {data !== undefined && data.length > 0
          ? data.map((res, key) => {
              let totalQty = 0;
              let subTotal = 0;

              return (
                <div className="card mb-2" key={key}>
                  <div className="card-header">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <input
                            type="checkbox"
                            id="exampleCheck1"
                            checked={res.checked}
                            value={res.checked}
                            onChange={(e) => this.handleCheck(e, key)}
                          />
                          <label
                            className="text-black"
                            style={{
                              marginLeft: "5px",
                            }}
                          >
                            {res.kd_trx} {res.checked ? "true" : "false"}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <p>
                          <small>Pemesan</small> <br /> Annashrul Yusuf
                        </p>

                        <p>
                          <small>Tanggal Pemesanan</small> <br /> 15 Jun 2022
                        </p>
                        <p>
                          <small>Alamat</small> <br /> Komp. Deppen Blok E No.
                          24 Kel. Harjamukti Kec. Cimanggis Kota Depok 16454,
                          Kecamatan Cimanggis Kota Depok, Jawa Barat,
                        </p>
                        <p>
                          <small>Telepon</small> <br /> 081223165037
                        </p>
                      </div>
                      <div className="col-md-3">
                        <p>
                          <small>Stokis</small> <br /> Ulman Syafriandi -
                          6285711868824
                        </p>
                        <p>
                          <small>Penerima</small> <br /> Ulman Syafriandi
                        </p>
                        <p>
                          <small>Status Transaksi</small> <br />{" "}
                          {statusOrder(3)}
                        </p>
                        <p>
                          <small>Status Pengambilan</small> <br />{" "}
                          {statusPengambilan(1)}
                        </p>{" "}
                        <small>Tagihan - Transfer</small>
                        <h1
                          style={{
                            borderRadius: "10px",
                            border: "1px dashed green",
                            padding: "5px",
                            textAlign: "center",
                            color: "green",
                          }}
                        >
                          {toRp(res.grand_total)}
                        </h1>
                      </div>

                      <div className="col-md-6" style={{ overflowX: "auto" }}>
                        <small>Daftar Paket</small>
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th width="1%">No</th>
                              <th>Nama</th>

                              <th width="1%">Harga</th>
                              <th width="1%">Qty</th>
                              <th width="1%">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {res.detail !== undefined && res.detail.length > 0
                              ? res.detail.map((val, index) => {
                                  totalQty += parseInt(val.qty, 10);
                                  subTotal += parseInt(val.total, 10);
                                  return (
                                    <tr>
                                      <td className="middle nowrap text-center">
                                        {index + 1}
                                      </td>
                                      <td className="middle nowrap">
                                        {val.paket}
                                      </td>

                                      <td className="middle nowrap text-right">
                                        {toRp(val.harga)}
                                      </td>
                                      <td className="middle nowrap text-right">
                                        {toRp(val.qty)}
                                      </td>
                                      <td className="middle nowrap text-right">
                                        {toRp(val.total)}
                                      </td>
                                    </tr>
                                  );
                                })
                              : noData(5)}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th colSpan="3">Total</th>
                              <th colSpan="1" className="text-right">
                                {toRp(totalQty)}
                              </th>
                              <th colSpan="1" className="text-right">
                                {toRp(subTotal)}
                              </th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : ""}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    loadingMaster: state.orderReducer.loadingMaster,
    dataMaster: state.orderReducer.dataMaster,
    paginationMaster: state.orderReducer.paginationMaster,
    loadingExcel: state.orderReducer.loadingExcel,
    dataExcel: state.orderReducer.dataExcel,
    dataResi: state.orderReducer.dataResi,
    dataStokis: state.orderReducer.dataStokis,
  };
};

export default connect(mapStateToProps)(IndexOrder);
