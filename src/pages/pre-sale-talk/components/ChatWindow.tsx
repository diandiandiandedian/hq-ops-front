import React, { useEffect, useRef } from 'react';
import { useSocket } from '../../../context/SocketContext';

const ChatWindow: React.FC = () => {
  const { userMessages, activeUserId } = useSocket();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 获取当前活跃聊天用户的消息
  const filteredMessages =
    userMessages.find((item) => item.userId === activeUserId)?.messages || [];

  // 自动滚动到底部
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredMessages.length]);

  return (
    <div className="flex-grow p-4 bg-gray-100 overflow-y-auto rounded-lg shadow-lg">
      {filteredMessages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.from === 'admin' ? 'justify-end' : 'justify-start'
          } mb-3`}
        >
          <div
            className={`max-w-xs p-3 rounded-lg shadow-sm ${
              message.from === 'admin'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            <p className="text-sm">{message.message}</p>
          </div>
          <span className="text-xs text-gray-400 ml-2 self-end">
            {message.time}
          </span>
        </div>
      ))}

      {/* 滚动到底部的参考元素 */}
      <div ref={chatEndRef} />
    </div>
  );
};

export default React.memo(ChatWindow);
