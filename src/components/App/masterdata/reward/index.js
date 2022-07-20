import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import helper, { myDate, noImage, rmHtml } from "../../../../helper";
import moment from "moment";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import {
  deleteReward,
  getReward,
} from "../../../../redux/actions/masterdata/reward.action";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import FormBerita from "../../modals/masterdata/berita/form_berita";
import * as Swal from "sweetalert2";
import { NOTIF_ALERT } from "../../../../redux/actions/_constants";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import FormReward from "../../modals/masterdata/reward/form_reward";

moment.locale("id"); // en

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      title: "",
      id: "",
      perpage: 10,
      scrollPage: 0,
      isScroll: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentWillMount() {
    this.handleGet("", 1);
  }
  handleGet(res, page) {
    if (res !== undefined) {
      let whereLocal = `page=${page}${res}`;
      this.setState({ where: whereLocal });
      this.props.dispatch(getReward(whereLocal));
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handlePage(pageNumber) {
    this.props.dispatch(getReward(`page=${pageNumber}`));
  }

  handleModal(par) {
    if (par !== null) {
      let det = this.props.data[par];
      Object.assign(det, { where: this.state.where });
      this.setState({
        detail: det,
      });
    } else {
      this.setState({
        detail: {
          id: "",
          where: this.state.where,
        },
      });
    }
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formReward"));
  }

  handleDelete(id) {
    this.props.dispatch(deleteReward(id, "Reward"));
  }

  render() {
    const { data, pagination } = this.props;
    return (
      <Layout page={"Reward"}>
        <HeaderGeneralCommon
          col={"col-md-12"}
          pathName="listReward"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.handleModal(null)}
        />
        <div className="row">
          {typeof data === "object" ? (
            data.length > 0 ? (
              data.map((v, i) => {
                let desc = rmHtml(v.caption);
                if (desc.length > 100) {
                  desc = desc.substr(0, 100);
                }
                return (
                  <div className="col-md-4" key={i}>
                    <div className="box-margin">
                      <div
                        className="coupon"
                        style={{
                          borderRadius: "15px",
                          margin: "0 auto",
                          breakInside: "avoid-column",
                        }}
                      >
                        <div className="ribbon-wrapper bgWithOpacity">
                          <div
                            className={`ribbon ribbon-bookmark ${
                              v.status === 1
                                ? "ribbon-success"
                                : "ribbon-danger"
                            }`}
                          >
                            {v.poin} Poin
                          </div>
                          <img
                            alt="example"
                            src={v.picture}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = noImage();
                            }}
                          />
                          <br />
                          <div className="row">
                            <div className="col-md-12" style={{ padding: "5" }}>
                              <br />
                              <div className="row">
                                <div className="col-md-8">
                                  <p className="text-muted">
                                    {myDate(v.created_at)}
                                  </p>
                                </div>
                                <div className="col-md-4">
                                  <p className="text-muted text-right">
                                    Cluster ke-{v.clusters}
                                  </p>
                                </div>
                              </div>

                              <h4 className="text-white">{v.title}</h4>
                              <p className="text-muted">{rmHtml(desc)}</p>
                            </div>
                            <div className="col-md-12">
                              <div
                                className="btn-group btn-block"
                                style={{ textAlign: "right" }}
                              >
                                <UncontrolledButtonDropdown nav>
                                  <DropdownToggle caret className="myDropdown">
                                    Pilihan
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={(e) => this.handleModal(i)}
                                    >
                                      Ubah
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={(e) =>
                                        this.props.dispatch(
                                          deleteReward({ id: v.id })
                                        )
                                      }
                                    >
                                      Hapus
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledButtonDropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <img src={NOTIF_ALERT.NO_DATA} alt="member" />
            )
          ) : (
            <img src={NOTIF_ALERT.NO_DATA} alt="member" />
          )}
        </div>

        {this.props.isOpen === true ? (
          <FormReward detail={this.state.detail} />
        ) : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.rewardReducer.data,
    pagination: state.rewardReducer.pagination,
  };
};

export default connect(mapStateToProps)(Index);
