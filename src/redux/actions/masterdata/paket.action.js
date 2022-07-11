import { PAKET } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";

export function setLoadingRegister(load) {
  return {
    type: PAKET.LOADING_REGISTER,
    load,
  };
}
export function setLoadingSmartContract(load) {
  return {
    type: PAKET.LOADING_SMART_CONTRACT,
    load,
  };
}
export function setLoadingHappyShopping(load) {
  return {
    type: PAKET.LOADING_SMART_CONTRACT,
    load,
  };
}
export function setDataRegister(data = []) {
  return {
    type: PAKET.REGISTER,
    data,
  };
}
export function setDataSmartContract(data = []) {
  return {
    type: PAKET.SMART_CONTRACT,
    data,
  };
}
export function setDataHappyShopping(data = []) {
  return {
    type: PAKET.HAPPY_SHOPPING,
    data,
  };
}

export const getPaket = (where, type = "REGISTER") => {
  return (dispatch) => {
    let url = `paket/list/${type}`;
    if (where) {
      url += `?${where}&perpage=10`;
    }
    handleGet(url, (res) => {
      if (type === "REGISTER") {
        dispatch(setDataRegister(res));
      }
      if (type === "SMART_CONTRACT") {
        dispatch(setDataSmartContract(res));
      }
      if (type === "HAPPY_SHOPPING") {
        dispatch(setDataHappyShopping(res));
      }
    });
  };
};
export const postPaket = (data, where, type = "REGISTER") => {
  return (dispatch) => {
    handlePost(`paket`, data, (res, msg, status) => {
      dispatch(getPaket(where, type));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putPaket = (data, detail, type = "REGISTER") => {
  console.log("#####################", type);
  return (dispatch) => {
    handlePut(`paket/${detail.id}`, data, (res, msg, status) => {
      dispatch(getPaket(detail.where, type));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deletePaket = (data, type = "REGISTER") => {
  return (dispatch) => {
    handleDelete(`paket/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getPaket("page=1", type));
      } else {
        dispatch(getPaket(data.where, type));
      }
    });
  };
};
