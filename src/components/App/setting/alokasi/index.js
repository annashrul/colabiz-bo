import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import {
  generateNo,
  myDate,
  noData,
  statusQ,
  toCurrency,
  toRp,
} from "../../../../helper";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";

import { getAlokasi } from "../../../../redux/actions/setting/alokasi.action";
import Form_alokasi from "../../modals/setting/form_alokasi";

class IndexAlokasi extends Component {
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
      this.props.dispatch(getAlokasi(whereLocal));
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
      this.setState({ detail: data });
    } else {
      this.setState({ detail: data });
    }
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formAlokasi"));
  }

  render() {
    const { pagination, data } = this.props;
    const { where, detail } = this.state;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Tipe" },
      { label: "Sponsor", width: "1%" },
      { label: "Monoleg", width: "10%" },
      { label: "Leadership", width: "1%" },
      { label: "Poin Reward", width: "1%" },
      { label: "Generasi", width: "1%" },
      { label: "Hpp", width: "1%" },
      { label: "IT", width: "1%" },
      { label: "Support", width: "1%" },
      { label: "Distribusi Poin", width: "1%" },
      { label: "Subsidi Ongkir", width: "1%" },
      { label: "Profit", width: "1%" },
    ];

    return (
      <Layout page={"Daftar Paket"}>
        <HeaderGeneralCommon
          pathName="daftarPaket"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
        />

        <TableCommon
          head={head}
          meta={{
            total: pagination.total,
            current_page: pagination.current_page,
            per_page: pagination.per_page,
          }}
          current_page={pagination.current_page}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, pagination.current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={[{ label: "Ubah" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal(v);
                            }}
                          />
                        </td>

                        <td className="middle nowrap">{v.type}</td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.sponsor)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.monoleg)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.leadership)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.poin_reward)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.generasi)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.hpp)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.it)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.support)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.distribution_point)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.subsidi_ongkir)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.profit)}
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {this.props.isOpen === true ? <Form_alokasi detail={detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.alokasiReducer.isLoading,
    isOpen: state.modalReducer,
    data: state.alokasiReducer.data,
    pagination: state.alokasiReducer.pagination,
  };
};

export default connect(mapStateToProps)(IndexAlokasi);
