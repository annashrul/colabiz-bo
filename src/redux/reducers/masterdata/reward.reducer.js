import { REWARD } from "../../actions/_constants";

const initialState = {
  total: [],
  meta: [],
  data: [],
  pagination: [],
};

export const rewardReducer = (state = initialState, action) => {
  switch (action.type) {
    case REWARD.GET:
      return Object.assign({}, state, {
        total: action.data.total,
        meta: action.data.meta,
        data: action.data.data,
        pagination: action.data.pagination,
      });
    default:
      return state;
  }
};
