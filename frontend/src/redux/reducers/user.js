import {createReducer} from "@reduxjs/toolkit";

const initialState={
    isAuthenticated: false,
    loading: true,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadUserRequest", (state) => {
            state.loading = true;
        })
        .addCase("LoadUserSuccess", (state, action) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload;
        })
        .addCase("LoadUserFail", (state, action) => {
            state.isAuthenticated = false;
            state.loading = false;
            state.error = action.payload;
            state.user = null;
        })
        .addCase("LogoutSuccess", (state) => {
            state.isAuthenticated = false;
            state.loading = false;
            state.user = null;
            state.error = null;
        })
        .addCase("clearError", (state) => {
            state.error = null;
        });
});