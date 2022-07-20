import { REWARD } from "../_constants";
import { ModalToggle, ModalType } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";

export function setData(data = []) {
  return {
    type: REWARD.GET,
    data,
  };
}

export const getReward = (where = "") => {
  return (dispatch) => {
    let url = "reward?perpage=10";
    if (where !== "") {
      url += `&${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};

export const postReward = (data, where) => {
  return (dispatch) => {
    handlePost(`reward`, data, (res, msg, status) => {
      dispatch(getReward(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putReward = (data, detail) => {
  return (dispatch) => {
    handlePut(`reward/${detail.id}`, data, (res, msg, status) => {
      dispatch(getReward(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deleteReward = (data) => {
  return (dispatch) => {
    handleDelete(`reward/${data.id}`, () => {
      dispatch(getReward("page=1"));
    });
  };
};
