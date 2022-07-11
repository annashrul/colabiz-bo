import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import {
  compareObjectResAndState,
  filterObject,
  imgToStrip,
  rmComma,
  ToastQ,
  toRp,
} from "../../../../../helper";
import {
  postPaket,
  putPaket,
} from "../../../../../redux/actions/masterdata/paket.action";
import SelectCommon from "../../../../common/SelectCommon";
import File64 from "../../../../common/File64";
import CKEditor from "react-ckeditor-component";

const myState = {
  title: "",
  caption: "",
  price: "",
  stock: "",
  status: "1",
  gambar: "-",
  alokasi: "",
  alokasi_data: [],
  status_data: [
    { value: "1", label: "Aktif" },
    { value: "0", label: "Tidak Aktif" },
  ],
};

class FormPaket extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeCkeditor = this.handleChangeCkeditor.bind(this);
    this.state = myState;
  }

  clearState() {
    this.setState(myState);
  }
  getProps(props) {
    let state = {};
    if (props.dataAlokasi !== undefined) {
      if (props.dataAlokasi.length > 0) {
        let data = [];
        props.dataAlokasi.forEach((v, i) => {
          data.push({ value: v.id, label: v.type });
        });
        Object.assign(state, { alokasi_data: data });
      }
    }
    if (props.detail.id !== "") {
      this.state.alokasi = props.detail.val.id_alokasi;
      props.detail.val.status = `${props.detail.val.status}`.toString();
      const compare = compareObjectResAndState(props.detail.val, this.state);
      console.log("compare", compare);
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
  handleChangeImage(files) {
    if (files.status === "success") {
      this.setState({
        gambar: files.base64,
      });
    }
  }
  handleChangeCkeditor(evt) {
    var newContent = evt.editor.getData();
    this.setState({
      caption: newContent,
    });
  }

  handleSelect(col, val) {
    this.setState({ [col]: val.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    const justStrings = filterObject(this.state);
    let keyState = Object.keys(state);
    justStrings.gambar = imgToStrip(justStrings.gambar);
    for (let i = 0; i < keyState.length; i++) {
      if (state[keyState[i]] === "") {
        ToastQ.fire({
          icon: "error",
          title: `${keyState[i]} tidak boleh kosong`,
        });
        return;
      }
    }
    if (this.props.detail.id === "") {
      this.props.dispatch(
        postPaket(
          justStrings,
          this.props.detail.where,
          this.props.detail.typeCode
        )
      );
    } else {
      this.props.dispatch(
        putPaket(justStrings, this.props.detail, this.props.detail.typeCode)
      );
    }
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
        isOpen={this.props.isOpen && this.props.type === "formPaket"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== ""
            ? `Ubah Paket ${this.props.detail.type}`
            : `Tambah Paket ${this.props.detail.type}`}
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-group">
            <label>Harga</label>
            <input
              type="text"
              className="form-control"
              name="price"
              value={toRp(this.state.price)}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label>Stok</label>
            <input
              type="text"
              className="form-control"
              name="stock"
              value={toRp(this.state.stock)}
              onChange={this.handleChange}
            />
          </div>
          <SelectCommon
            label="Kategori"
            options={this.state.alokasi_data}
            dataEdit={this.state.alokasi}
            callback={(res) => this.handleSelect("alokasi", res)}
          />
          <SelectCommon
            label="Status"
            options={this.state.status_data}
            dataEdit={this.state.status}
            callback={(res) => this.handleSelect("status", res)}
          />
          <div className="form-group">
            <label>Deskripsi</label>
            <CKEditor
              activeClass="p10"
              content={this.state.caption}
              events={{
                change: this.handleChangeCkeditor,
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputState" className="col-form-label">
              Gambar{" "}
              {this.props.detail.id !== "" ? (
                <small style={{ color: "red" }}>
                  kosongkan bila tidak akan diubah
                </small>
              ) : (
                ""
              )}
            </label>
            <br />
            <File64
              multiple={false}
              maxSize={2048} //in kb
              fileType="png, jpg" //pisahkan dengan koma
              className="mr-3 form-control-file"
              onDone={this.handleChangeImage}
              showPreview={true}
              lang="id"
              previewConfig={{
                width: "100%",
              }}
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
            <button
              type="submit"
              className="btn btn-primary mb-2"
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
    dataAlokasi: state.alokasiReducer.data,
  };
};

export default connect(mapStateToProps)(FormPaket);
