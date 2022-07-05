import { STOCKIS } from "../../actions/_constants";

const initialState = {
  loadingPost: false,
  loadingGet: true,
  loadingDetail: true,
  total: [],
  meta: [],
  data: [],
  pagination: [],
  dataDetail: [],
  paginationDetail: [],
};

export const stockisReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOCKIS.GET:
      return Object.assign({}, state, {
        total: action.data.total,
        meta: action.data.meta,
        data: action.data.data,
        pagination: action.data.pagination,
      });
    case STOCKIS.GET_DETAIL:
      return Object.assign({}, state, {
        dataDetail: action.data.data,
        paginationDetail: action.data.pagination,
      });
    case STOCKIS.LOADING_DETAIL:
      return Object.assign({}, state, {
        loadingDetail: action.load,
      });
    case STOCKIS.LOADING_GET:
      return Object.assign({}, state, {
        loadingGet: action.load,
      });
    case STOCKIS.LOADING_POST:
      return Object.assign({}, state, {
        loadingPost: action.load,
      });
    default:
      return state;
  }
};
