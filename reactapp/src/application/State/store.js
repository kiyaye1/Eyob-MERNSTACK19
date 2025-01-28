import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "./User/UserReducer";
import studentReducer from "./Student/StudentReducer";
import productReducer from "./Product/ProductReducer";
import cartReducer from "./Cart/CartReducer";
import couponReducer from "./Coupon/CouponReducer";
import recentOrdersReducer from "./RecentOrder/recentOrdersReducer";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["userReducer", "studentReducer", "cartReducer", "recentOrdersReducer"],
};

const rootReducer = combineReducers({
    userReducer,
    studentReducer,
    productReducer,
    cartReducer,
    couponReducer,
    recentOrdersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);