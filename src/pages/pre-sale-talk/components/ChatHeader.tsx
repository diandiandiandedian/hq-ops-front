import React from 'react';
import { useSocket } from '../../../context/SocketContext';

const ChatHeader: React.FC = () => {
  const { userMessages, activeUserId } = useSocket();
  const activeUser = userMessages.find((item) => item.userId === activeUserId);

  return (
    <div className="p-4 bg-white border-b border-gray-300 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800 truncate">
        {activeUser?.userName ?? '请选择一个聊天'}
      </h1>
    </div>
  );
};

export default ChatHeader;
