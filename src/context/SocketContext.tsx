// src/context/SocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Message, UserMessage } from '../pages/types';
import { notification } from 'antd';
import { queryUnreadMessages } from '../api/index';
// import useMessage from 'antd/es/message/useMessage';

interface SocketContextProps {
  socket: Socket | null;
  userMessages: UserMessage[];
  addMessage: (message: Message) => void;
  setActiveUserId: (activeUserId: string) => void;
  activeUserId: string;
  setUserMessages: (userMessage: UserMessage[]) => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// interface UserMessage {
//   userId: number;
//   userName: string;
//   messages: Message[];
// }

export const SocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifyMessage, setNotifyMessage] = useState<Message>();
  // const [currentUser, setCurrentUser] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const currentRouteKey = location.pathname.split('/')[2];
  const [activeUserId, setActiveUserId] = useState<string>('');

  const [userMessages, setUserMessages] = useState<UserMessage[]>([
    // { userId: '1', userName: '用户1', messages: [] },
    // { userId: '2', userName: '用户2', messages: [] },
    // { userId: '3', userName: '用户3', messages: [] },
  ]);

  const [userLoading, setUserLoading] = useState<boolean>(false);

  const query = () => {
    setUserLoading(true);
    queryUnreadMessages<UserMessage[]>()
      .then((res) => {
        setUserMessages(res);
      })
      .finally(() => {
        setUserLoading(false);
      });
  };

  useEffect(() => {
    query();
  }, []);

  useEffect(() => {
    const ss = import.meta.env.VITE_SOCKET_BASE_URL;
    console.log(ss);
    const socketInstance = io(ss, {
      transports: ['polling'],
      query: {
        Authorization: `Bearer ${token}`,
      },
    });
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('message', (msg: Message) => {
      console.log(msg);
      let userMessage = userMessages.find((item) => item.userId === msg.userId);
      if (userMessage) {
        userMessage.messages.push(msg);
        setUserMessages(userMessages);
      } else {
        // TODO
        userMessage = {
          userId: msg.userId,
          userName: msg.userName,
          unReadCount: 1,
          messages: [msg],
        };
        setUserMessages([...userMessages, userMessage]);
      }
      if (msg.senderType === 0) {
        setNotifyMessage(msg);
      }
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection Error:', error.message, error);
    });

    socketInstance.on('error', (error) => {
      console.error('Socket.IO Error:', error.message, error);
    });

    // 其他调试事件
    socketInstance.on('reconnect_attempt', (attempt) => {
      console.log(`Reconnect attempt #${attempt}`);
    });

    socketInstance.on('reconnect_error', (error) => {
      console.error('Reconnect Error:', error.message, error);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Reconnect failed. Could not establish connection.');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (notifyMessage && currentRouteKey !== 'pre-sale-talk') {
      notification.info({
        // message: messages[messages.length - 1].title,
        message: '新消息',
        description: notifyMessage.contentValue,
        placement: 'topRight',
      });
    }
  }, [notifyMessage]);

  // const handleSetCurrentUser = (user: string) => {
  // setCurrentUser(user);
  // 在这里可以添加逻辑来获取该用户的聊天记录
  // fetchChatHistory(user);
  // };

  // const fetchChatHistory = async (user: string) => {
  //   try {
  //     // 假设有一个 API 获取用户聊天记录
  //     const chatHistory = await fetch(`/api/chat-history/${user}`).then((res) =>
  //       res.json()
  //     );
  //     setMessages(chatHistory);
  //   } catch (error) {
  //     console.error('Error fetching chat history:', error);
  //   }
  // };

  const addMessage = (msg: Message) => {
    let userMessage = userMessages.find((item) => item.userId === msg.userId);
    if (userMessage) {
      socket?.emit('message', JSON.stringify(msg), (res: any) => {
        console.log('socket-res', res);
        userMessage?.messages.push(msg);
        setUserMessages([...userMessages]);
      });
    } else {
      userMessage = {
        userId: msg.userId,
        userName: msg.userName,
        messages: [msg],
        unReadCount: 1,
      };
      setUserMessages([...userMessages, userMessage]);
    }
  };
  return (
    <SocketContext.Provider
      value={{
        socket,
        userMessages,
        addMessage,
        activeUserId,
        setActiveUserId,
        setUserMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
