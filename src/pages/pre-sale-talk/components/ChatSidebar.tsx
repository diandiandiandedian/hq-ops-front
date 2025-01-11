import React from 'react';
import { useSocket } from '../../../context/SocketContext';

const ChatSidebar: React.FC = () => {
  const { activeUserId, userMessages, setActiveUserId } = useSocket();

  // 构造聊天数据
  const chats = userMessages.map((item) => {
    return { id: item.userId, name: item.userName, messages: item.messages };
  });

  // 处理点击聊天项事件
  const handleChatClick = (id: number) => {
    setActiveUserId(id);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-300 shadow-lg h-full">
      <ul className="overflow-y-auto">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`p-4 cursor-pointer flex items-center space-x-3 transition-all duration-200 ease-in-out ${
              chat.id === activeUserId
                ? 'bg-blue-100 text-blue-600 font-semibold shadow-md'
                : 'hover:bg-gray-100 hover:text-gray-700'
            } rounded-lg`}
            onClick={() => handleChatClick(chat.id)}
          >
            {/* 聊天头像（可选） */}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">{chat.name.charAt(0)}</span>
            </div>
            <span>{chat.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
