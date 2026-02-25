import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  registerToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRegisterToken(state, action) {
      state.registerToken = action.payload;
    },
    clearRegisterToken(state) {
      state.registerToken = null;
    },
    loginSuccess(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout, setRegisterToken, clearRegisterToken } = authSlice.actions;
export default authSlice.reducer;
