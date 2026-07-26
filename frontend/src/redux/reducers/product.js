import {createReducer} from "@reduxjs/toolkit";

const initialState={
    isLoading:true,
}

export const productReducer= createReducer(initialState, (builder)=>{
    builder
        .addCase("productCreateRequest", (state)=>{
        state.isLoading = true;
        })
        .addCase("productCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.product = action.payload;
            state.success = true;
        })
        .addCase("productCreateFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        // get all products
        .addCase("getAllProductShopRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllProductShopSuccess", (state, action) => {
            state.isLoading = false;
            state.products = action.payload;
        })
        .addCase("getAllProductShopFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // delete the product
        .addCase("deleteProductRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("deleteProductSuccess", (state,action) => {
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase("deleteProductFail", (state,action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase("clearError", (state) => {
            state.error = null;
        });
})