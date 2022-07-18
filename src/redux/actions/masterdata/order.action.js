import { ORDER } from "../_constants";
import { ModalToggle, ModalType } from "../modal.action";
import { handleGet, handlePut } from "../../handle_http";

const folder = "penjualan/report";

export function setLoadingMaster(load) {
  return {
    type: ORDER.LOADING_MASTER,
    load,
  };
}
export function setLoadingExcel(load) {
  return {
    type: ORDER.LOADING_EXCEL,
    load,
  };
}
export function setDataMaster(data = []) {
  return {
    type: ORDER.DATA_MASTER,
    data,
  };
}
export function setDataExcel(data = []) {
  return {
    type: ORDER.DATA_EXCEL,
    data,
  };
}
export function setDataResi(data = []) {
  return {
    type: ORDER.DATA_RESI,
    data,
  };
}
export function setDataStokis(data = []) {
  return {
    type: ORDER.DATA_STOKIS,
    data,
  };
}

export const getOrderMasterAction = (where) => {
  return (dispatch) => {
    // dispatch(setLoadingMaster(true));
    let url = folder + "/order";
    if (where) {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setDataMaster(res));
      // dispatch(setLoadingMaster(false));
    });
  };
};

export const getOrderExcelAction = (where) => {
  return (dispatch) => {
    let url = folder;
    if (where) {
      url += `?${where}`;
    }
    handleGet(url, (res) => dispatch(setDataExcel(res)));
  };
};

export const getResiAction = () => {
  return (dispatch) => {
    let url = folder + "/filter/resi";
    handleGet(url, (res) => dispatch(setDataResi(res)));
  };
};
export const getStokisAction = () => {
  return (dispatch) => {
    let url = folder + "/filter/stockis";
    handleGet(url, (res) => dispatch(setDataStokis(res)));
  };
};

export const updateResiAction = (data, where, callback) => {
  return (dispatch) => {
    handlePut("penjualan/update_resi", data, (res, msg, status) => {
      dispatch(ModalToggle(false));
      dispatch(ModalType("formResi"));

      console.log(status);
      callback(status);
    });
  };
};
