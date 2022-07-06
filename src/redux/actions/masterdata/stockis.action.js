import { STOCKIS } from "../_constants";
import { ModalToggle, ModalType } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";

export function setLoading(load) {
  return {
    type: STOCKIS.LOADING_GET,
    load,
  };
}
export function setData(data = []) {
  return {
    type: STOCKIS.GET,
    data,
  };
}
export function setLoadingDetail(load) {
  return {
    type: STOCKIS.LOADING_DETAIL,
    load,
  };
}
export function setDataDetail(data = []) {
  return {
    type: STOCKIS.GET_DETAIL,
    data,
  };
}

export const getStockis = (where = "") => {
  return (dispatch) => {
    let url = "stockis?perpage=10";
    if (where !== "") {
      url += `&${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};
export const getDetailStockis = (where = "", id) => {
  return (dispatch) => {
    let url = `stockis/get/${id}`;
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      dispatch(ModalToggle(true));
      dispatch(ModalType("detailStokis"));
      dispatch(setDataDetail(res));
    });
  };
};
export const postStockis = (data, where) => {
  return (dispatch) => {
    handlePost(`stockis`, data, (res, msg, status) => {
      dispatch(getStockis(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const approveStockis = (detail) => {
  return (dispatch) => {
    handlePut(
      `transaction/aktivasi_stockis/${detail.id}/approve`,
      {},
      (res, msg, status) => {
        dispatch(getStockis(detail.where));
      }
    );
  };
};
export const putStockis = (data, detail) => {
  return (dispatch) => {
    handlePut(`stockis/${detail.id}`, data, (res, msg, status) => {
      dispatch(getStockis(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deleteStockis = (data) => {
  return (dispatch) => {
    handleDelete(`stockis/${data.id}`, () => {
      dispatch(getStockis("page=1"));
    });
  };
};
