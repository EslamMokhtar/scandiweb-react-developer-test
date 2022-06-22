import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currency: JSON.parse(localStorage.getItem("currency")) || {
    label: "USD",
    symbol: "$",
  },
};
const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    changeCurrency(state, action) {
      localStorage.setItem("currency", JSON.stringify(action.payload));
      state.currency = action.payload;
    },
  },
});
export const currencyActions = currencySlice.actions;
export default currencySlice;
