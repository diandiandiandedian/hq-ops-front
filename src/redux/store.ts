import { configureStore } from '@reduxjs/toolkit';
import authReducer, { initializeAuth } from './modules/authSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
// 初始化 Redux 状态
store.dispatch(initializeAuth());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
