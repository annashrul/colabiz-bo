import { REPORT_TRANSAKSI_MEMBER } from "../_constants";
import { handleGet } from "../../handle_http";
import { ModalToggle, ModalType } from "../modal.action";

export function setLoading(load) {
  return {
    type: REPORT_TRANSAKSI_MEMBER.LOADING,
    load,
  };
}
export function setLoadingExcel(load) {
  return {
    type: REPORT_TRANSAKSI_MEMBER.LOADING_EXCEL,
    load,
  };
}

export function setLoadingDetail(load) {
  return {
    type: REPORT_TRANSAKSI_MEMBER.LOADING_DETAIL,
    load,
  };
}
export function setLoadingPost(load) {
  return {
    type: REPORT_TRANSAKSI_MEMBER.LOADING_POST,
    load,
  };
}

export function setData(data = []) {
  return {
    type: REPORT_TRANSAKSI_MEMBER.SUCCESS,
    data,
  };
}
export function setExcel(data = []) {
  return {
    type: REPORT_TRANSAKSI_MEMBER.EXCEL,
    data,
  };
}

export function setDataDetail(data = []) {
  return {
    type: REPORT_TRANSAKSI_MEMBER.DETAIL,
    data,
  };
}

export const getDataReportTransaksi = (where = "") => {
  return (dispatch) => {
    let url = "transaction/report/member";
    if (where !== "") url += `?${where}&perpage=10`;
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};

export const getDetailReportTransaksi = (where = "", isModal = false) => {
  return (dispatch) => {
    dispatch(setLoadingDetail(true));
    let url = "transaction/report";
    if (where !== "") url += `?${where}&perpage=10`;
    handleGet(url, (res) => {
      dispatch(setDataDetail(res));
      if (isModal) {
        dispatch(ModalToggle(true));
        dispatch(ModalType("detailReportTransaksiMember"));
      }
    });
  };
};

export const getExcelReportTransaksi = (where = "") => {
  return (dispatch) => {
    let url = "transaction/report/member";
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setExcel(res));
    });
  };
};
