import { ALOKASI } from "../_constants";
import { ModalToggle, ModalType } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePatch,
  handlePost,
  handlePut,
} from "../../handle_http";

const folder = "alokasi";

export function setLoading(load) {
  return {
    type: ALOKASI.LOADING,
    load,
  };
}
export function setData(data = []) {
  return {
    type: ALOKASI.SUCCESS,
    data,
  };
}

export const getAlokasi = (where) => {
  return (dispatch) => {
    let url = folder;
    if (where) {
      url += `?${where}&perpage=10`;
    }
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};

export const postAlokasi = (data, where) => {
  return (dispatch) => {
    handlePost(folder, data, (res, msg, status) => {
      dispatch(getAlokasi(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putAlokasi = (data, detail) => {
  return (dispatch) => {
    handlePut(`${folder}/${detail.id}`, data, (res, msg, status) => {
      dispatch(getAlokasi(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const putBankAlokasi = (data, detail) => {
  return (dispatch) => {
    handlePut(`${folder}/${detail.id}`, data, (res, msg, status) => {
      dispatch(getAlokasi(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deleteAlokasi = (data) => {
  return (dispatch) => {
    handleDelete(`${folder}/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getAlokasi("page=1"));
      } else {
        dispatch(getAlokasi(data.where));
      }
    });
  };
};
