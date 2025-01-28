import * as actionTypes from "../ActionTypes";

const initialState = {
  recentOrders: [],
};

const recentOrdersReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ORDERS_SUCCESS:
      return { ...state, recentOrders: action.payload };

    case actionTypes.SAVE_ORDER_SUCCESS:
      return { ...state, recentOrders: [...state.recentOrders, action.payload] };

    case actionTypes.CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        recentOrders: state.recentOrders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
      };

    default:
      return state;
  }
};
export default recentOrdersReducer;
