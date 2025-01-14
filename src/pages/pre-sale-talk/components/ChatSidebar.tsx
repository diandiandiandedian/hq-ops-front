import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../context/SocketContext';

import { Badge } from 'antd'; // 引入 Ant Design 的 Badge 组件
import { UserMessage } from '@/pages/types';

const ChatSidebar: React.FC = () => {
  const { activeUserId, userMessages, setActiveUserId } = useSocket();

  // 处理点击聊天项事件
  const handleChatClick = (id: string) => {
    setActiveUserId(id);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-300 shadow-lg h-full overflow-y-scroll">
      <ul>
        {userMessages.map((item) => (
          <li
            key={item.userId}
            className={`p-4 cursor-pointer flex items-center space-x-3 transition-all duration-200 ease-in-out ${
              item.userId === activeUserId
                ? 'bg-blue-100 text-blue-600 font-semibold shadow-md'
                : 'hover:bg-gray-100 hover:text-gray-700'
            } rounded-lg`}
            onClick={() => handleChatClick(item.userId)}
          >
            <Badge
              count={item.unReadCount}
              style={{ backgroundColor: '#f5222d' }} // 红色背景
            >
              {/* 聊天头像（可选） */}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">
                  {item.userName.charAt(0)}
                </span>
              </div>
            </Badge>
            {/* 用户名和未读消息数量 */}
            <div className="flex items-center space-x-2">
              <span>{item.userName}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
