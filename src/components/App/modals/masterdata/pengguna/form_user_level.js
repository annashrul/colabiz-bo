import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import Switch from "react-switch";
import { ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { swallOption, ToastQ } from "../../../../../helper";
import { menu } from "../../../../../linkMenu";
import {
  postUserLevel,
  putUserLevel,
} from "../../../../../redux/actions/masterdata/user_level.action";
import { store, destroy } from "../../../../../components/model/app.model";
import setAuthToken from "../../../../../utils/setAuthToken";
import {
  setCurrentUser,
  setLoggedin,
} from "../../../../../redux/actions/authActions";
// import { useHistory } from "react-router-dom";
// const history = useHistory();
class FormUserLevel extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeToggle = this.handleChangeToggle.bind(this);
    this.state = {
      menu: menu(),
      lvl: "",
      checked: false,
    };
  }

  clearState() {
    this.setState({
      menu: menu(),
      lvl: "",
      checked: false,
    });
  }

  getProps(param) {
    console.log("detail", param.detail);
    if (param.detail !== undefined && param.detail.id !== "") {
      // this.setState({
      //   lvl: param.detail.val.level,
      //   menu: param.detail.val.access_level,
      // });

      this.setState({ lvl: param.detail.val.level, menu: this.state.menu });
    } else {
      this.clearState();
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  toggle(e) {
    e.preventDefault();
    this.clearState();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }
  handleAllChecked(event, param) {
    let menu = this.state.menu;
    menu.forEach((val) => {
      if (param === val.id) {
        val.isChecked = event;
      }
      if (val.sub !== undefined) {
        val.sub.forEach((row) => {
          if (param === val.id || param === row.id) {
            row.isChecked = event;
          }
          if (row.sub !== undefined) {
            row.sub.forEach((res) => {
              if (param === val.id || param === row.id || param === res.id) {
                res.isChecked = event;
              }
            });
          }
        });
      }
    });
    this.setState({ menu: menu });
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  handleChangeToggle(e, val) {
    this.setState({ checked: val });
  }
  handleSubmit(e) {
    e.preventDefault();
    let parseData = {};
    parseData["level"] = this.state.lvl;
    parseData["access_level"] = JSON.stringify(this.state.menu);
    if (parseData["level"] === "" || parseData["level"] === undefined) {
      ToastQ.fire({
        icon: "error",
        title: `silahkan beri nama untuk akses pengguna ini`,
      });
      return;
    }
    if (this.props.detail.id === "") {
      this.props.dispatch(postUserLevel(parseData, this.props.detail.where));
      this.clearState();
    } else {
      this.props.dispatch(
        putUserLevel(parseData, this.props.detail, (res) => {
          if (res) {
            swallOption(
              "silahkan keluar untuk menggunakan menu yang sudah dipilih",
              () => {
                window.location.href = "/login";
                destroy("sess");
                localStorage.clear();
                setAuthToken(false);
              },
              () => {
                this.props.dispatch(ModalToggle(false));
                this.clearState();
              }
            );
          } else {
          }
        })
      );
    }
  }
  render() {
    const { menu, lvl } = this.state;
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formUserLevel"}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id === "" ? "Tambah" : "Ubah"} akses
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label> Nama Akses </label>
                <input
                  type="text"
                  className="form-control"
                  name="lvl"
                  value={lvl}
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
            </div>

            {menu.map((val, key) => {
              return val.sub === undefined ? (
                <div style={{ zoom: "80%" }} className="col-md-12" key={key}>
                  <div className="form-group">
                    <label htmlFor="">
                      <i className={val.icons}></i>&nbsp;
                      {val.label.replace("_", " ").replace("-", " ")}
                    </label>
                    <br />
                    <Switch
                      onChange={(e) => this.handleAllChecked(e, val.id)}
                      checked={val.isChecked}
                    />
                  </div>
                  <hr style={{ borderColor: "gray", borderStyle: "dashed" }} />
                </div>
              ) : (
                <div style={{ zoom: "80%" }} className="col-md-12" key={key}>
                  <div className="form-group">
                    <label htmlFor="">
                      <i className={val.icons}></i>&nbsp;
                      {val.label.replace("_", " ").replace("-", " ")}
                    </label>
                    <br />
                    <Switch
                      onChange={(e) => this.handleAllChecked(e, val.id)}
                      checked={val.isChecked}
                    />
                  </div>
                  <div className="row">
                    {val.sub.map((row, idx) => {
                      return (
                        <div
                          className={`${
                            row.sub !== undefined
                              ? "col-md-12"
                              : "col-4 col-xs-4 col-md-3"
                          }`}
                          key={idx}
                          style={{
                            marginLeft: "0px",
                          }}
                        >
                          <div className="form-group">
                            <label htmlFor="">
                              {row.label.replace("_", " ").replace("-", " ")}
                            </label>
                            <br />
                            <Switch
                              onChange={(e) => this.handleAllChecked(e, row.id)}
                              checked={row.isChecked}
                            />
                          </div>

                          <div className="row" style={{ marginLeft: "0px" }}>
                            {(() => {
                              let child = [];
                              if (row.sub !== undefined) {
                                row.sub.forEach((res, i) => {
                                  child.push(
                                    <div className="col-md-3" key={i}>
                                      <div className="form-group">
                                        <label htmlFor="">
                                          {res.label
                                            .replace("_", " ")
                                            .replace("-", " ")}
                                        </label>
                                        <br />
                                        <Switch
                                          onChange={(e) =>
                                            this.handleAllChecked(e, res.id)
                                          }
                                          checked={res.isChecked}
                                        />
                                      </div>
                                    </div>
                                  );
                                });
                              }
                              return child;
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <hr
                    style={{
                      borderColor: menu.length - 1 === key ? "" : "gray",
                      borderStyle: "dashed",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="form-group" style={{ textAlign: "right" }}>
            <button
              style={{ color: "white" }}
              type="button"
              className="btn btn-warning mb-2 mr-2"
              onClick={this.toggle}
            >
              <i className="ti-close" /> Keluar
            </button>
            <button
              type="submit"
              className="btn btn-primary mb-2 mr-2"
              onClick={this.handleSubmit}
            >
              <i className="ti-save" /> Simpan
            </button>
          </div>
        </ModalFooter>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    isLoadingPost: state.userLevelReducer.isLoadingPost,
    isError: state.userLevelReducer.isError,
  };
};

export default connect(mapStateToProps)(FormUserLevel);
