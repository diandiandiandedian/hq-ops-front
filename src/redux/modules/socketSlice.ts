// socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  activeChatId: number | null;
}

const initialState: SocketState = {
  socket: null,
  isConnected: false,
  activeChatId: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<Socket | null>) => {
      state.socket = action.payload; // Immer will handle immutability correctly
    },
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<number | null>) => {
      state.activeChatId = action.payload; // Immer will handle immutability correctly
    },
    addMessage: (state, action: PayloadAction<any | null>) => {
      // initialState.messages
      // console.log(action.payload);
      // state.activeChatId = action.payload; // Immer will handle immutability correctly
    },
  },
});

export const { setSocket, setSocketConnected, setActiveChat, addMessage } =
  socketSlice.actions;
export default socketSlice.reducer;
