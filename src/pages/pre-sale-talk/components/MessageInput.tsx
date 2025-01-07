import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { addMessage } from '../../../redux/modules/chatSlice';
import { ChatMessage } from '@/pages/types';
const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const activeChatId = useSelector(
    (state: RootState) => state.chat.activeChatId
  );

  const handleSend = () => {
    if (!input.trim()) return;

    // 添加用户发送的消息
    const userMessage: ChatMessage = {
      id: Date.now(),
      chatId: activeChatId,
      from: 'user',
      content: input,
      time: new Date().toLocaleTimeString(),
    };
    dispatch(addMessage(userMessage));

    // 模拟自动回复
    setTimeout(() => {
      const botReply: ChatMessage = {
        id: Date.now() + 1,
        chatId: activeChatId,
        from: 'customer',
        content: `您说的是：“${input}”吗？`,
        time: new Date().toLocaleTimeString(),
      };
      dispatch(addMessage(botReply));
    }, 1000); // 延迟 1 秒模拟客服回复

    setInput('');
  };

  return (
    <div className="p-4 bg-white border-t border-gray-300">
      <div className="flex items-center">
        <input
          type="text"
          className="flex-grow p-2 border rounded-md"
          placeholder="输入框文本"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleSend}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
