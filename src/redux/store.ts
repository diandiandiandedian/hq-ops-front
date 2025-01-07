import { configureStore } from '@reduxjs/toolkit';
import authReducer, { initializeAuth } from './modules/authSlice';
import chatReducer from './modules/chatSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});
// 初始化 Redux 状态
store.dispatch(initializeAuth());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
