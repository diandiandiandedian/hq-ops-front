import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const ChatWindow: React.FC = () => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const activeChatId = useSelector(
    (state: RootState) => state.chat.activeChatId
  );

  const filteredMessages = messages.filter(
    (msg) => msg.chatId === activeChatId
  );

  return (
    <div className="flex-grow p-4 bg-gray-50 overflow-y-auto">
      {filteredMessages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.from === 'user' ? 'justify-end' : 'justify-start'
          } mb-2`}
        >
          <div
            className={`max-w-xs p-2 rounded-md ${
              message.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {message.content}
          </div>
          <span className="text-xs text-gray-400 ml-2">{message.time}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
