import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  employee: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginEmployee: (state, { payload }) => {
      state.isAuthenticated = true;
      state.employee = payload;
    },
    logoutEmployee: (state) => {
      state.isAuthenticated = false;
      state.employee = {};
    },
  },
});

export const { loginEmployee, logoutEmployee } = authSlice.actions;
export default authSlice.reducer;
