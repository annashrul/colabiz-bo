import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { ToastQ } from "../../../../../helper";
import { putMemberPin } from "../../../../../redux/actions/masterdata/member.action";
import { updateResiAction } from "../../../../../redux/actions/masterdata/order.action";
const myState = {
  resi: "",
  kd_trx: "",
};

class FormResi extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = myState;
  }

  clearState() {
    this.setState(myState);
  }
  getProps(props) {
    console.log(props);
  }

  componentWillMount() {
    this.getProps(this.props);
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    this.props.dispatch(
      updateResiAction(
        { kd_trx: this.props.detail.kdTrx, resi: state.resi },
        this.props.where,
        (status) => {
          this.props.callback(status);
        }
      )
    );
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
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
        isOpen={this.props.isOpen && this.props.type === "formResi"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>Form Resi</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <p className="text-white">
              total transaksi sebanyak {this.props.detail.totalTrx}
            </p>
            <div className="form-group">
              <label>Resi </label>
              <input
                type="number"
                className="form-control"
                name="resi"
                value={this.state.resi}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Kode Transaksi </label>
              <textarea
                className="form-control"
                name="kd_trx"
                value={this.props.detail.kdTrx}
                disabled={true}
              />
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
  };
};

export default connect(mapStateToProps)(FormResi);
