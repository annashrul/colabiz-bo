import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import Paginationq, {
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
import Form_resi from "../../modals/masterdata/order/form_resi";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import Preloader from "../../../../Preloader";

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
      modalResi: false,
      kdTrx: "",
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
      kdTrx_data: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleModal = this.handleModal.bind(this);
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
  handleGet(res, page = 1, isFirst = false) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let periode = getPeriode(where.split("&"));
      let state = {
        where_data: where,
        periode: periode,
      };
      this.setState(state);
      if (isFirst) {
        where += "&perpage=100";
      } else {
        where += "&perpage=10";
      }
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
    if (this.state.resi_data.length === 0) {
      if (nextProps.dataResi !== undefined && nextProps.dataResi.length > 0) {
        let resiData = [{ value: "", label: "semua" }];
        nextProps.dataResi.map((res, key) => {
          resiData.push({
            value: res.resi,
            label: `${res.resi} | ${res.stockis}`,
          });
        });
        this.setState({ resi_data: resiData });
      }
    }
    if (this.state.stokis_data.length === 0) {
      if (
        nextProps.dataStokis !== undefined &&
        nextProps.dataStokis.length > 0
      ) {
        let stokisData = [{ value: "", label: "semua" }];
        nextProps.dataStokis.map((res, key) => {
          stokisData.push({
            value: res.id_stockis,
            label: `${res.stockis} | ${res.jumlah_transaksi} transaksi`,
          });
        });
        this.setState({ stokis_data: stokisData });
      }
    }
    if (this.state.data.length === 0) {
      if (
        nextProps.dataMaster !== undefined &&
        nextProps.dataMaster.length > 0
      ) {
        let masterData = [];
        let kdTrx = [];
        let isDisableButtonResi = true;
        nextProps.dataMaster.map((res, key) => {
          Object.assign(res, { checked: false });
          if (this.state.checkedAll) {
            kdTrx.push(res.kd_trx);
            Object.assign(res, { checked: true });
          }
          if (res.checked) {
            isDisableButtonResi = false;
          }

          masterData.push(res);
        });
        if (this.state.checkedAll) {
          let details = {
            where: this.checkFilter(),
            kdTrx: kdTrx.toString(),
            totalTrx: nextProps.dataMaster.length,
          };
          this.setState({ detail: details });
        }
        this.setState({
          data: masterData,
          isDisableButtonResi: isDisableButtonResi,
        });
      }
    }
  }

  componentWillMount() {
    this.props.dispatch(getResiAction());
    this.props.dispatch(getStokisAction());
  }

  handleCheck(e, i = null) {
    let kdTrx = this.state.kdTrx_data;
    let col = e.target.name;
    let val = e.target.checked;
    let data = this.state.data;
    if (col === "checkAll") {
      this.setState({ data: [] });
      setTimeout(() => {
        let perpage = 10;
        if (val) {
          perpage = this.props.paginationMaster
            ? this.props.paginationMaster.total
            : 10;
        }
        let where = `${this.checkFilter()}&perpage=${perpage}`;
        setTimeout(() => this.props.dispatch(getOrderMasterAction(where)), 200);
      }, 100);
      this.setState({ checkedAll: val });
    } else {
      data[i].checked = val;

      if (this.state.detail.kdTrx === undefined) {
        kdTrx.push(data[i].kd_trx);
      } else {
        const filterKdTrx = this.state.detail.kdTrx
          .split(",")
          .filter((res) => res === data[i].kd_trx);
        if (filterKdTrx.length === 0) {
          kdTrx.push(data[i].kd_trx);
        }
      }
      let detail = {
        where: this.checkFilter(),
        kdTrx: kdTrx.toString(),
        totalTrx: kdTrx.length,
      };
      this.setState({ detail: detail });
    }
    this.setState(data);
    setTimeout(() => this.handleIsDisabledButton(!val), 100);
  }

  checkFilter() {
    let where = `${this.state.where_data}`;
    if (this.state.resi !== "") {
      where += `&resi=${this.state.resi}`;
    }
    if (this.state.stokis !== "") {
      where += `&id_stockis=${this.state.stokis}`;
    }
    return where;
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
  handlePageChange(pageNumber) {
    this.setState({ data: [] });
    setTimeout(() => {
      this.handleGet(this.state.where_data, pageNumber);
    }, 100);
  }

  handleModal(e) {
    e.preventDefault();
    this.setState({
      modalResi: true,
    });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formResi"));
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
      where_data,
      modalResi,
      detail,
      kdTrx,
      kdTrx_data,
    } = this.state;
    // console.log(kdTrx_data);

    return (
      <Layout page={"order"}>
        <HeaderGeneralCommon
          col="col-md-4"
          callbackGet={(res) => {
            this.handleGet(res, 1, false);
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
          // callbackExport={() =>
          //   this.printDocumentXLsx(
          //     paginationMaster.per_page * paginationMaster.last_page
          //   )
          // }
          renderFilterHtml={
            <div className="col-md-8">
              <div className="row">
                <div className={`col-6 col-xs-6 col-md-6`}>
                  <SelectCommon
                    label={"Stokis"}
                    options={stokis_data}
                    callback={(res) => {
                      this.setState({
                        stokis: res.value,
                        data: [],
                        checkedAll: false,
                      });
                      setTimeout(() => {
                        let where = `${this.checkFilter()}&perpage=10`;
                        setTimeout(
                          () =>
                            this.props.dispatch(getOrderMasterAction(where)),
                          100
                        );
                      }, 100);
                    }}
                    dataEdit={stokis}
                  />
                </div>
                <div className={`col-6 col-xs-6 col-md-6`}>
                  <SelectCommon
                    label={"Resi"}
                    options={resi_data}
                    callback={(res) => {
                      this.setState({
                        resi: res.value,
                        data: [],
                        checkedAll: false,
                      });
                      setTimeout(() => {
                        let where = `${this.checkFilter()}&perpage=10`;
                        setTimeout(
                          () =>
                            this.props.dispatch(getOrderMasterAction(where)),
                          100
                        );
                      }, 100);
                    }}
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
                pilih semua transaksi
              </label>
              <br />
              <button
                disabled={isDisableButtonResi}
                className="btn btn-primary"
                style={{ cursor: isDisableButtonResi ? "not-allowed" : "" }}
                onClick={this.handleModal}
              >
                Buat Resi
              </button>
            </div>
          </div>
        </div>
        {!this.props.loadingMaster ? (
          data !== undefined && data.length > 0 ? (
            data.map((res, key) => {
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
                            {res.kd_trx}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <p>
                          <small>Pemesan</small> <br /> {res.pembeli}
                        </p>

                        <p>
                          <small>Tanggal Pemesanan</small> <br />{" "}
                          {dateIndo(res.created_at)}
                        </p>
                        <p>
                          <small>Alamat</small> <br /> {res.main_address},{" "}
                          {res.kecamatan}, {res.kota}, {res.provinsi}
                        </p>
                        <p>
                          <small>Telepon</small> <br /> {res.pembeli_mobile_no}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <p>
                          <small>Stokis</small> <br /> {res.stockis} -
                          {res.stockis_mobile_no}
                        </p>
                        <p>
                          <small>Penerima</small> <br /> {res.penerima}
                        </p>
                        <p>
                          <small>Status Transaksi</small> <br />{" "}
                          {statusOrder(res.status)}
                        </p>
                        <p>
                          <small>Status Pengambilan</small> <br />{" "}
                          {statusPengambilan(res.status_pengambilan)}
                        </p>{" "}
                        <small>Tagihan - {res.metode_pembayaran}</small>
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
                                    <tr key={index}>
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
          ) : (
            ""
          )
        ) : (
          <Preloader />
        )}
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={
              paginationMaster === undefined ? 0 : paginationMaster.current_page
            }
            per_page={
              paginationMaster === undefined ? 0 : paginationMaster.per_page
            }
            total={paginationMaster === undefined ? 0 : paginationMaster.total}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {modalResi && this.props.isOpen ? (
          <Form_resi
            detail={detail}
            callback={(status) => {
              if (status) {
                this.setState({ data: [], checkedAll: false });
                setTimeout(
                  () =>
                    this.props.dispatch(
                      getOrderMasterAction(`${this.checkFilter()}&perpage=10`)
                    ),
                  100
                );
              }
            }}
          />
        ) : null}
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
