import React, { useState } from 'react';
import { Message } from '../../../pages/types';
import { useSocket } from '../../../context/SocketContext';

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { activeUserId, addMessage } = useSocket();

  const handleSend = () => {
    if (!input.trim()) return;

    // 创建新的消息对象
    const message: Message = {
      id: Date.now(),
      userId: activeUserId,
      from: 'admin',
      userName: '',
      message: input,
      time: new Date().toLocaleTimeString(),
    };
    addMessage(message);
    setInput('');
  };

  return (
    <div className="p-4 bg-white border-t border-gray-300 shadow-md">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleSend}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
