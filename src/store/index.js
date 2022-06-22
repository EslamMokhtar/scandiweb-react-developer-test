import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cart-slice";
import currencySlice from "./currency-slice";

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    currency: currencySlice.reducer,
  },
});

export default store;
