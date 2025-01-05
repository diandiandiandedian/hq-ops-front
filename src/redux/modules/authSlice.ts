import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginProps, UserInfo } from '../types';
import { AUTH_TOKEN, USER_INFO } from '../../constants/storage';
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userInfo: UserInfo | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginProps>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      localStorage.setItem(AUTH_TOKEN, action.payload.token); // 存储 token
      localStorage.setItem(USER_INFO, JSON.stringify(action.payload.userInfo)); // 存储 token
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem(AUTH_TOKEN); // 删除 token
      localStorage.removeItem(USER_INFO); // 删除 token
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem(AUTH_TOKEN);
      state.isAuthenticated = !!token;
      state.token = token;
      state.userInfo = JSON.parse(localStorage.getItem(USER_INFO)!);
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
