import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import {
  generateNo,
  myDate,
  noData,
  rmHtml,
  statusQ,
  toCurrency,
  toRp,
} from "../../../../helper";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import FormUserList from "../../modals/masterdata/pengguna/form_user_list";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import {
  deletePaket,
  getPaket,
} from "../../../../redux/actions/masterdata/paket.action";
import FormPaket from "../../modals/masterdata/paket/form_paket";
import { getKategoriPaket } from "../../../../redux/actions/masterdata/kategori_paket.action";
import { getAlokasi } from "../../../../redux/actions/setting/alokasi.action";

class IndexSmartContract extends Component {
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
      this.props.dispatch(getPaket(whereLocal, "SMART_CONTRACT"));
    }
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleModal(par) {
    this.props.dispatch(getAlokasi());
    let data = {
      id: "",
      where: this.state.where,
      type: "Smart Contract",
      typeCode: "SMART_CONTRACT",
    };
    if (par !== null) {
      Object.assign(data, { id: par.id });
      Object.assign(data, { val: par });
      this.setState({ detail: data });
    } else {
      this.setState({ detail: data });
    }
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPaket"));
  }

  render() {
    const { paginationSmartContract, dataSmartContract } = this.props;
    const { where, detail } = this.state;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Foto", width: "1%" },
      { label: "Nama", width: "1%" },
      { label: "Alokasi", width: "1%" },
      { label: "Harga", width: "1%" },
      { label: "Stok", width: "1%" },
      { label: "Status", width: "1%" },
      { label: "Deskripsi" },
    ];

    return (
      <Layout page={"Daftar Paket Smart Contract"}>
        <HeaderGeneralCommon
          col="col-md-12"
          pathName="daftarPaketSmartContract"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.handleModal(null)}
        />

        <TableCommon
          head={head}
          meta={{
            total: paginationSmartContract.total,
            current_page: paginationSmartContract.current_page,
            per_page: paginationSmartContract.per_page,
          }}
          current_page={paginationSmartContract.current_page}
          renderRow={
            typeof dataSmartContract === "object"
              ? dataSmartContract.length > 0
                ? dataSmartContract.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, paginationSmartContract.current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={[{ label: "Ubah" }, { label: "Hapus" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal(v);
                              if (e === 1)
                                this.props.dispatch(
                                  deletePaket(
                                    {
                                      total: dataSmartContract.length,
                                      id: v.id,
                                      where: where,
                                    },
                                    "SMART_CONTRACT"
                                  )
                                );
                            }}
                          />
                        </td>
                        <td className="middle nowrap">
                          <img
                            src={v.gambar}
                            style={{
                              width: "25px",
                              height: "25px",
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.title}</td>
                        <td className="middle nowrap">
                          {v.title_alokasi.replace("_", " ")}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.price)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.stock, false)}
                        </td>
                        <td className="middle nowrap text-center">
                          {statusQ(v.status)}
                        </td>
                        <td className="middle nowrap">{rmHtml(v.caption)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {this.props.isOpen === true ? <FormPaket detail={detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loadingSmartContract: state.paketReducer.loadingSmartContract,
    isOpen: state.modalReducer,
    dataSmartContract: state.paketReducer.dataSmartContract,
    dataAlokasi: state.alokasiReducer.data,
    paginationSmartContract: state.paketReducer.paginationSmartContract,
  };
};

export default connect(mapStateToProps)(IndexSmartContract);
