import React from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { Provider, useSelector } from 'react-redux';
import store from '../../redux/store';
import { RootState } from '../../redux/store';

const App: React.FC = () => {
  const activeChatId = useSelector(
    (state: RootState) => state.chat.activeChatId
  );

  const chats = [
    { id: 1, name: '客户001' },
    { id: 2, name: '客户002' },
  ];

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  return (
    <Provider store={store}>
      <div className="flex h-full bg-gray-100">
        <ChatSidebar />
        <div className="flex flex-col flex-grow">
          {/* 将 activeChat 传递给 ChatHeader */}
          <ChatHeader activeChat={activeChat} />
          <ChatWindow />
          <MessageInput />
        </div>
      </div>
    </Provider>
  );
};

export default App;
