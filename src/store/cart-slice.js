import { createSlice } from "@reduxjs/toolkit";
const initialState = { items: JSON.parse(localStorage.getItem("items")) || [] };
const compare = (arr1, arr2) => {
  let objectsAreSame = 0;
  for (const propertyName1 in arr1) {
    for (const propertyName2 in arr2) {
      if (
        arr1[propertyName1].value === arr2[propertyName2].value &&
        arr1[propertyName1].name === arr2[propertyName2].name
      ) {
        objectsAreSame++;
        break;
      }
    }
  }
  return objectsAreSame === arr1.length;
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct(state, action) {
      const foundItem = state.items.find((product) => {
        return (
          product.id === action.payload.id &&
          compare(action.payload.selectedAttributes, product.selectedAttributes)
        );
      });

      if (foundItem) {
        foundItem.quantity++;
      } else {
        state.items.push(action.payload);
      }

      localStorage.setItem("items", JSON.stringify(state.items));
    },
    addQuantity(state, action) {
      const foundItem = state.items.find(
        (product) =>
          product.id === action.payload.id &&
          JSON.stringify(product.selectedAttributes) ===
            JSON.stringify(action.payload.selectedAttributes)
      );
      foundItem.quantity++;
      localStorage.setItem("items", JSON.stringify(state.items));
    },
    subQuantity(state, action) {
      const foundItem = state.items.find(
        (product) =>
          product.id === action.payload.id &&
          JSON.stringify(product.selectedAttributes) ===
            JSON.stringify(action.payload.selectedAttributes)
      );

      if (foundItem.quantity > 1) {
        foundItem.quantity--;
      } else {
        state.items = state.items.filter((item) => {
          return (
            item.id !== foundItem.id ||
            JSON.stringify(item.selectedAttributes) !==
              JSON.stringify(foundItem.selectedAttributes)
          );
        });
      }
      localStorage.setItem("items", JSON.stringify(state.items));
    },
    removeProduct(state, action) {
      const foundItem = state.items.find(
        (product) =>
          product.id === action.payload.id &&
          JSON.stringify(product.selectedAttributes) ===
            JSON.stringify(action.payload.selectedAttributes)
      );

      state.items = state.items.filter((item) => {
        return (
          item.id !== foundItem.id ||
          JSON.stringify(item.selectedAttributes) !==
            JSON.stringify(foundItem.selectedAttributes)
        );
      });
      localStorage.setItem("items", JSON.stringify(state.items));
    },
  },
});
export const cartActions = cartSlice.actions;
export default cartSlice;
