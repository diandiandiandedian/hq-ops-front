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
import {
  queryUnreadMessages,
  sendMessage,
  updateMessageIsRead,
} from '../api/index';

interface SocketContextProps {
  socket: Socket | null;
  userMessages: UserMessage[];
  addMessage: (message: Message) => void;
  setActiveUserId: (activeUserId: string) => void;
  activeUserId: string;
  setUserMessages: (userMessage: UserMessage[]) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  activeUserName: string;
  setActiveUserName: (activeUserName: string) => void;
  // queryLeftUserList: () => void;
  updateMessageRead: (ids: string) => void;
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
  const [activeUserName, setActiveUserName] = useState<string>('');
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);

  const updateMessageRead = (ids: string) => {
    updateMessageIsRead({ ids }).then(() => {
      queryLeftUserList();
      console.log('修改状态成功');
    });
  };

  const queryLeftUserList = () => {
    queryUnreadMessages<UserMessage[]>()
      .then((res) => {
        setUserMessages(res);
      })
      .finally(() => {});
  };

  useEffect(() => {
    queryLeftUserList();
  }, []);
  useEffect(() => {
    console.log('messages', messages);
  }, [messages]);

  useEffect(() => {
    const ss = import.meta.env.VITE_SOCKET_BASE_URL;
    console.log(ss);
    const socketInstance = io(ss, {
      // transports: ['polling'],
      query: {
        Authorization: `Bearer ${token}`,
      },
    });
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('message', (msg: Message) => {
      msg.last = true;
      console.log('messages', messages);
      console.log(msg);

      setMessages((prevMessages) => {
        // 检查是否是当前用户的消息
        if (prevMessages.length > 0 && prevMessages[0].userId === msg.userId) {
          return [...prevMessages, msg];
        }
        // 处理其他逻辑
        return prevMessages;
      });

      if (msg.senderType === 0) {
        setNotifyMessage(msg);
      } else {
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
    if (
      notifyMessage &&
      (currentRouteKey !== 'pre-sale-talk' ||
        notifyMessage.userId !== activeUserId)
    ) {
      let description = notifyMessage.contentValue;
      if (notifyMessage.contentType === 1) {
        description = '[图片]';
      }
      if (notifyMessage.contentType === 2) {
        description = '[视频]';
      }
      queryLeftUserList();
      notification.info({
        message: notifyMessage.userName || '新消息',
        description: description,
        placement: 'topRight',
      });
    } else {
      if (notifyMessage) {
        updateMessageRead(notifyMessage?.id + '');
      }
    }
  }, [notifyMessage]);

  const addMessage = (message: Message) => {
    const again = messages.includes(message);
    if (again) {
      message.sendStatus = 0;
      setMessages([...messages]);
    } else {
      setMessages([...messages, message]);
    }

    sendMessage(message)
      .then((res) => {
        message.sendStatus = 1;
      })
      .catch((e) => {
        message.sendStatus = 2;
      })
      .finally(() => {
        message.last = false;
        if (!again) {
          setMessages([...messages, message]);
        } else {
          setMessages([...messages]);
        }
      });
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
        messages,
        setMessages,
        activeUserName,
        setActiveUserName,
        // queryLeftUserList,
        updateMessageRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
