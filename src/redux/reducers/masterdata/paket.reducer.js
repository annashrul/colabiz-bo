import { PAKET } from "../../actions/_constants";

const initialState = {
  loadingRegister: true,
  metaRegister: [],
  dataRegister: [],
  paginationRegister: [],
  loadingSmartContract: true,
  metaSmartContract: [],
  dataSmartContract: [],
  paginationSmartContract: [],
  loadingHappyShopping: true,
  metaHappyShopping: [],
  dataHappyShopping: [],
  paginationHappyShopping: [],
};

export const paketReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAKET.REGISTER:
      return Object.assign({}, state, {
        metaRegister: action.data.meta,
        dataRegister: action.data.data,
        paginationRegister: action.data.pagination,
      });

    case PAKET.LOADING_REGISTER:
      return Object.assign({}, state, {
        loadingRegister: action.load,
      });
    case PAKET.SMART_CONTRACT:
      return Object.assign({}, state, {
        metaSmartContract: action.data.meta,
        dataSmartContract: action.data.data,
        paginationSmartContract: action.data.pagination,
      });

    case PAKET.LOADING_SMART_CONTRACT:
      return Object.assign({}, state, {
        loadingSmartContract: action.load,
      });
    case PAKET.HAPPY_SHOPPING:
      return Object.assign({}, state, {
        metaHappyShopping: action.data.meta,
        dataHappyShopping: action.data.data,
        paginationHappyShopping: action.data.pagination,
      });

    case PAKET.LOADING_HAPPY_SHOPPING:
      return Object.assign({}, state, {
        loadingHappyShopping: action.load,
      });
    default:
      return state;
  }
};
