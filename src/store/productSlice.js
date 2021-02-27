import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import memoize from "lodash.memoize";

const slice = createSlice({
  name: "products",
  initialState: { list: [] },
  reducers: {
    productsRequested: (products, action) => {
      products.loading = true;
    },
    productsReceived: (products, action) => {
      products.list = action.payload;
      products.loading = false;
    },
    productsRequestFailed: (products, action) => {
      products.loading = false;
    },
    productAddStart: (products, action) => {
      products.loading = true;
      products.status = "loading";
    },
    productAdded: (products, action) => {
      products.list.push(action.payload);
      products.loading = false;
      products.status = "Added successfully";
    },
    productAddFailed: (products, action) => {
      products.loading = false;
      products.status = "Failed";
    },
    productRemoved: (products, action) => {
      products.list.pop((product) => product._id !== action.payload._id);
    },
  },
});

export const {
  productAdded,
  productsRequested,
  productsReceived,
  productsRequestFailed,
  productAddStart,
  productAddFailed,
  productRemoved,
} = slice.actions;

export default slice.reducer;

//Action creators
export const loadProducts = () => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: "/products",
      // params: params,
      onStart: productsRequested.type,
      onSuccess: productsReceived.type,
      onError: productsRequestFailed.type,
    })
  );
};

export const addproduct = (product) =>
  apiCallBegan({
    url: "/products",
    method: "post",
    data: product,
    onSuccess: productAdded.type,
    onError: productAddFailed.type,
  });

export const removeproduct = (id) =>
  apiCallBegan({
    url: "/products/" + id,
    method: "delete",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
    onSuccess: productRemoved.type,
  });

export const products = (state) => state.app.products.list;
