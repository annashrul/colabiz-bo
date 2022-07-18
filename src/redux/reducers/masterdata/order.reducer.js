import { ORDER } from "../../actions/_constants";

const initialState = {
  loadingMaster: false,
  loadingExcel: false,
  dataMaster: [],
  dataExcel: [],
  paginationMaster: [],
  paginationExcel: [],
  dataResi: [],
  dataStokis: [],
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER.DATA_RESI:
      return Object.assign({}, state, {
        dataResi: action.data.data,
      });
    case ORDER.DATA_STOKIS:
      return Object.assign({}, state, {
        dataStokis: action.data.data,
      });
    case ORDER.DATA_MASTER:
      return Object.assign({}, state, {
        dataMaster: action.data.data,
        paginationMaster: action.data.pagination,
      });
    case ORDER.DATA_EXCEL:
      return Object.assign({}, state, {
        dataExcel: action.data.data,
        paginationExcel: action.data.pagination,
      });

    case ORDER.LOADING_MASTER:
      return Object.assign({}, state, {
        loadingMaster: action.load,
      });
    case ORDER.LOADING_EXCEL:
      return Object.assign({}, state, {
        loadingExcel: action.load,
      });

    default:
      return state;
  }
};
