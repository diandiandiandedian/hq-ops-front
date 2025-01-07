import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '@/pages/types';
// export interface ChatMessage {
//   id: number;
//   chatId: number; // 绑定到特定聊天
//   from: 'user' | 'customer';
//   content: string;
//   time: string;
// }

interface ChatState {
  messages: ChatMessage[];
  activeChatId: number; // 当前选中的聊天
}

const initialState: ChatState = {
  messages: [],
  activeChatId: 1, // 默认选中第一个聊天
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setActiveChat: (state, action: PayloadAction<number>) => {
      state.activeChatId = action.payload;
    },
  },
});

export const { addMessage, setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
