import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  admin: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAdmin: (state, { payload }) => {
      state.isAuthenticated = true;
      state.admin = payload;
    },
    logoutAdmin: (state) => {
      state.isAuthenticated = false;
      state.admin = {};
    },
  },
});

export const { loginAdmin, logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
