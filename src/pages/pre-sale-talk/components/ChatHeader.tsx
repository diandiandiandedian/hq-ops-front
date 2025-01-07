import React from 'react';

interface ChatHeaderProps {
  activeChat: {
    id: number;
    name: string;
  } | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ activeChat }) => {
  return (
    <div className="p-4 bg-white border-b border-gray-300">
      <h1 className="text-lg font-semibold">
        {activeChat ? activeChat.name : '请选择一个聊天'}
      </h1>
    </div>
  );
};

export default ChatHeader;
