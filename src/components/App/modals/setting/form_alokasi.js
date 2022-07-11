import React, { Component } from "react";
import WrapperModal from "../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../redux/actions/modal.action";
import {
  compareObjectResAndState,
  rmComma,
  ToastQ,
  toRp,
} from "../../../../helper";
import SelectCommon from "../../../common/SelectCommon";
import {
  postBankPerusahaan,
  putBankBankPerusahaan,
} from "../../../../redux/actions/setting/bank.action";
import { putAlokasi } from "../../../../redux/actions/setting/alokasi.action";

const myState = {
  id: "9fac8bcd-26a8-4a61-bdb7-5add951f05aa",
  sponsor: "0",
  monoleg: "0",
  leadership: "0",
  poin_reward: "0",
  generasi: "0",
  hpp: "0",
  it: "0",
  support: "0",
  distribution_point: "0",
  subsidi_ongkir: "0",
  profit: "0",
};

class FormAlokasi extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = myState;
  }

  clearState() {
    this.setState(myState);
  }
  getProps(props) {
    let state = {};
    if (props.detail.id !== "") {
      console.log(props.detail);
      const compare = compareObjectResAndState(props.detail.val, this.state);
      Object.assign(state, compare);
    }

    this.setState(state);
  }

  componentWillMount() {
    this.getProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  handleSelect(col, val) {
    this.setState({ [col]: val.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let keyState = Object.keys(state);
    for (let i = 0; i < keyState.length; i++) {
      if (state[keyState[i]] === "") {
        ToastQ.fire({
          icon: "error",
          title: `${keyState[i].replaceAll("_", " ")} tidak boleh kosong`,
        });
        return;
      }
    }
    console.log(state);

    this.props.dispatch(putAlokasi(state, this.props.detail));
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: rmComma(event.target.value) });
  };

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.clearState();
  }

  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formAlokasi"}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== "" ? "Ubah" : "Tambah"} Alokasi
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Sponsor</label>
                  <input
                    type="text"
                    className="form-control"
                    name="sponsor"
                    value={toRp(this.state.sponsor)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Monoleg</label>
                  <input
                    type="text"
                    className="form-control"
                    name="monoleg"
                    value={toRp(this.state.monoleg)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Leadership</label>
                  <input
                    type="text"
                    className="form-control"
                    name="leadership"
                    value={toRp(this.state.leadership)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Poin Reward</label>
                  <input
                    type="text"
                    className="form-control"
                    name="poin_reward"
                    value={toRp(this.state.poin_reward)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Generasi</label>
                  <input
                    type="text"
                    className="form-control"
                    name="generasi"
                    value={toRp(this.state.generasi)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>HPP</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hpp"
                    value={toRp(this.state.hpp)}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>IT</label>
                  <input
                    type="text"
                    className="form-control"
                    name="it"
                    value={toRp(this.state.it)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Support</label>
                  <input
                    type="text"
                    className="form-control"
                    name="support"
                    value={toRp(this.state.support)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Distribusi Poin</label>
                  <input
                    type="text"
                    className="form-control"
                    name="distribution_point"
                    value={toRp(this.state.distribution_point)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Subsidi Ongkir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subsidi_ongkir"
                    value={toRp(this.state.subsidi_ongkir)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Profit</label>
                  <input
                    type="text"
                    className="form-control"
                    name="profit"
                    value={toRp(this.state.profit)}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
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
                <i className="ti-close" />
                Keluar
              </button>
              <button type="submit" className="btn btn-primary mb-2">
                <i className="ti-save" /> Simpan
              </button>
            </div>
          </ModalFooter>
        </form>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    dataBank: state.bankReducer.data,
  };
};

export default connect(mapStateToProps)(FormAlokasi);
