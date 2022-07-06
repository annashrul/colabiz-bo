import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import helper, {
  generateNo,
  myDate,
  noData,
  statusQ,
  swallOption,
  swalWithCallback,
  toCurrency,
} from "../../../../helper";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import {
  deleteTestimoni,
  getTestimoni,
} from "../../../../redux/actions/masterdata/testimoni.action";
import FormTestimoni from "../../modals/masterdata/testimoni/form_testimoni";
import {
  approveStockis,
  getDetailStockis,
  getStockis,
} from "../../../../redux/actions/masterdata/stockis.action";

class IndexStokis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      where: "",
    };
    this.handleModal = this.handleModal.bind(this);
  }
  componentWillMount() {
    this.handleGet("", 1);
  }

  handleGet(res, page = 1) {
    if (res !== undefined) {
      let whereLocal = `page=${page}${res}`;
      this.setState({ where: whereLocal });
      this.props.dispatch(getStockis(whereLocal));
    }
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleModal(par) {
    let data = { id: "", where: this.state.where };
    if (par !== null) {
      Object.assign(data, { id: par.id });
      Object.assign(data, { val: par });
      this.props.dispatch(getDetailStockis(this.state.where, par.id));
      this.setState({ detail: data });
    } else {
      this.setState({ detail: data });
    }
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formTestimoni"));
  }

  render() {
    const { pagination, data } = this.props;
    const { where, detail } = this.state;
    console.log(pagination);
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Nama", width: "1%" },
      { label: "Alamat" },
      { label: "Akun Bank", width: "1%" },
      { label: "Status", className: "text-center", width: "1%" },
      { label: "Tanggal", width: "1%" },
    ];

    return (
      <Layout page={"Daftar Stokis"}>
        <HeaderGeneralCommon
          col="col-md-12"
          pathName="daftarStokis"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          // callbackAdd={() => this.handleModal(null)}
        />

        <TableCommon
          head={head}
          meta={{
            total: pagination.total,
            current_page: pagination.current_page,
            per_page: pagination.per_page,
          }}
          callbackPage={this.handlePageChange.bind(this)}
          current_page={pagination.current_page}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    let status = "";
                    let actionButton = [{ label: "Detail" }];
                    if (v.status === 0) {
                      actionButton.push({ label: "Jadikan Stokis" });
                    }
                    if (v.status === 0) {
                      status = "Bukan Stokis";
                    } else if (v.status === 1) {
                      status = "Stokis";
                    } else if (v.status === 2) {
                      status = "Sedang Diverifikasi";
                    } else {
                      status = "Suspend";
                    }

                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, pagination.current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={actionButton}
                            callback={(e) => {
                              if (e === 0) this.handleModal(v);
                              if (e === 1) {
                                swallOption(
                                  `deposit ${toCurrency(
                                    10000000
                                  )} akan langsung dimasukan ke saldo member`,
                                  () => {
                                    this.props.dispatch(
                                      approveStockis({
                                        id: v.id_member,
                                        where: where,
                                      })
                                    );
                                  },
                                  null,
                                  `Jadikan ${v.name} stokis`
                                );
                              }
                            }}
                          />
                        </td>
                        <td className="middle nowrap">
                          {v.name}
                          <br /> {v.mobile_no}
                        </td>
                        <td className="middle nowrap">
                          {v.main_address},{v.kecamatan} , {v.kota},{v.provinsi}
                        </td>
                        <td className="middle nowrap">
                          {v.bank_name}
                          <br />
                          {v.acc_name} ({v.acc_no})
                        </td>
                        <td className="middle nowrap">{status}</td>
                        <td className="middle nowrap">
                          {myDate(v.created_at)}
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {/* {this.props.isOpen === true ? <FormTestimoni detail={detail} /> : null} */}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.stockisReducer.loading,
    isOpen: state.modalReducer,
    data: state.stockisReducer.data,
    pagination: state.stockisReducer.pagination,
  };
};

export default connect(mapStateToProps)(IndexStokis);
