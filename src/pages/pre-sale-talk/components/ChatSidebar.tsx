import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChat } from '../../../redux/modules/chatSlice';
import { RootState } from '../../../redux/store';

const ChatSidebar: React.FC = () => {
  const activeChatId = useSelector(
    (state: RootState) => state.chat.activeChatId
  );
  const dispatch = useDispatch();

  const chats = [
    { id: 1, name: '客户001' },
    { id: 2, name: '客户002' },
  ];

  const handleChatClick = (id: number) => {
    dispatch(setActiveChat(id));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-300">
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`p-4 cursor-pointer ${
              chat.id === activeChatId ? 'bg-gray-200' : ''
            }`}
            onClick={() => handleChatClick(chat.id)}
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
