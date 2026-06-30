import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },

    autoLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
  },
});

export default AuthSlice.reducer;
export const { login, logout, autoLogin } = AuthSlice.actions;
