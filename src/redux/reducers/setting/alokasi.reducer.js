import { ALOKASI } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  data: [],
  pagination: [],
};

export const alokasiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALOKASI.SUCCESS:
      return Object.assign({}, state, {
        data: action.data.data,
        pagination: action.data.pagination,
      });

    case ALOKASI.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });

    default:
      return state;
  }
};
