import React, { Component } from "react";
import { connect } from "react-redux";
import WrapperModal from "../../_wrapper.modal";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { isEmptyOrUndefined, ToastQ } from "../../../../../helper";
import {
  postKategori,
  putKategori,
} from "../../../../../redux/actions/kategori/kategori.action";

class FormKategoriBerita extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      title: "",
    };
  }
  getProps(props) {
    if (props.detail.id !== "") {
      this.setState({
        title: props.detail.title,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };

  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let parsedata = { title: state.title, type: 1 };
    if (!isEmptyOrUndefined(state.title)) {
      ToastQ.fire({ icon: "error", title: `title tidak boleh kosong` });
      return;
    }
    if (this.props.detail.id !== "") {
      this.props.dispatch(
        putKategori(this.props.detail.id, parsedata, "berita")
      );
    } else {
      this.props.dispatch(postKategori(parsedata, "berita"));
    }
  }

  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formKategoriBerita"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== "" ? "Ubah" : "Tambah"} kategori berita
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Nama</label>
                <input
                  type="text"
                  className={"form-control"}
                  name={"title"}
                  value={this.state.title}
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
            <button
              type="submit"
              className="btn btn-primary mb-2 mr-2"
              onClick={this.handleSubmit}
            >
              <i className="ti-save" />
              Simpan
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
    isLoadingPost: state.kategoriReducer.isLoadingPost,
    isError: state.kategoriReducer.isError,
  };
};
export default connect(mapStateToProps)(FormKategoriBerita);
