import React, { Component } from "react";
import { connect } from "react-redux";
import WrapperModal from "../../_wrapper.modal";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { ToastQ } from "../../../../../helper";
import Select from "react-select";
import { fetchKategori } from "../../../../../redux/actions/kategori/kategori.action";
import File64 from "../../../../common/File64";
import CKEditor from "react-ckeditor-component";
import {
  postReward,
  putReward,
} from "../../../../../redux/actions/masterdata/reward.action";

class FormReward extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data_status: [
        { label: "Aktif", value: 1 },
        { label: "Tidak Aktif", value: 0 },
      ],
      data_clusters: [
        { value: 1, label: "Pertama" },
        { value: 2, label: "Kedua" },
        { value: 3, label: "Ketiga" },
      ],
      status: 1,
      clusters: 1,
      title: "",
      caption: "",
      poin: "",
      picture: "-",
    };
  }

  getProps(props) {
    console.log(props);
    if (props.detail.id !== "") {
      this.setState({
        caption: props.detail.caption,
        title: props.detail.title,
        status: props.detail.status,
        poin: props.detail.poin,
        clusters: props.detail.clusters,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentDidMount() {
    this.getProps(this.props);
  }

  componentWillMount() {
    this.props.dispatch(fetchKategori("berita"));
  }

  clearState() {
    this.setState();
  }
  handleChangeImage(files) {
    if (files.status === "success") {
      this.setState({
        picture: files.base64,
      });
    }
  }

  handleSelect(state, val) {
    this.setState({
      [state]: val.value,
    });
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };

  updateContent(newContent) {
    this.setState({
      caption: newContent,
    });
  }

  onChange(evt) {
    var newContent = evt.editor.getData();
    this.setState({
      caption: newContent,
    });
  }

  onBlur(evt) {}

  afterPaste(evt) {}

  handleSubmit(e) {
    e.preventDefault();
    let parsedata = {
      status: this.state.status,
      clusters: this.state.clusters,
      title: this.state.title,
      caption: this.state.caption,
      poin: this.state.poin,
      picture: this.state.picture,
    };
    if (parsedata["title"] === "") {
      ToastQ.fire({ icon: "error", title: `judul tidak boleh kosong` });
      return;
    }

    if (parsedata["caption"] === "") {
      ToastQ.fire({ icon: "error", title: `Deskripsi tidak boleh kosong` });
      return;
    }
    if (this.props.detail.id === "") {
      this.props.dispatch(postReward(parsedata, this.props.detail));
    } else {
      this.props.dispatch(putReward(parsedata, this.props.detail));
    }
  }
  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formReward"}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id === "" ? "Tambah" : "Ubah"} Reward
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Judul</label>
                <input
                  type="text"
                  className={"form-control"}
                  name={"title"}
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label>Poin</label>
                <input
                  type="text"
                  className={"form-control"}
                  name={"poin"}
                  value={this.state.poin}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label>Cluster</label>
                {
                  <Select
                    options={this.state.data_clusters}
                    placeholder="==== Pilih Cluster ===="
                    onChange={(e) => this.handleSelect("clusters", e)}
                    value={this.state.data_clusters.find((op) => {
                      return op.value === this.state.clusters;
                    })}
                  />
                }
              </div>
              <div className="form-group">
                <label>Status</label>
                {
                  <Select
                    options={this.state.data_status}
                    onChange={(e) => this.handleSelect("status", e)}
                    value={this.state.data_status.find((op) => {
                      return op.value === this.state.status;
                    })}
                  />
                }
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
                  previewLink={this.state.prev}
                  previewConfig={{
                    width: "100%",
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <CKEditor
                activeClass="p10"
                content={this.state.caption}
                events={{
                  blur: this.onBlur,
                  afterPaste: this.afterPaste,
                  change: this.onChange,
                }}
              />
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
              {!this.props.isLoadingPost ? "Simpan" : "Loading ......"}
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
  };
};
export default connect(mapStateToProps)(FormReward);
