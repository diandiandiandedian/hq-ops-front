import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { Message } from '@/pages/types';
import { queryMessageListByPage } from '../../../api/index';
import { BasePage } from '@/redux/types';
import dayjs from 'dayjs';

const ChatWindow: React.FC = () => {
  const { activeUserId } = useSocket();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
  const formatTimestamp = (timestamp: number) =>
    dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm');

  const fetchMessages = useCallback(
    async (pageNum: number) => {
      if (loading) return;
      if (pageNum === 1) {
        setMessages([]);
      }
      const chatContainer = chatEndRef.current?.parentElement;

      // 记录当前滚动高度
      const scrollHeightBefore = chatContainer?.scrollHeight || 0;

      setLoading(true);
      try {
        const res = await queryMessageListByPage<BasePage<Message>>({
          page: pageNum,
          size: 20,
          userId: activeUserId,
        });
        setHasMore(!res.isLastPage);
        setIsFirstPage(res.isFirstPage);
        if (res.records.length !== 0) {
          setMessages((prevMessages) => [
            ...res.records.reverse(), // 新消息插入到顶部
            ...prevMessages,
          ]);
        }

        // 等待 DOM 更新后恢复滚动高度
        setTimeout(() => {
          if (chatContainer) {
            const scrollHeightAfter = chatContainer.scrollHeight;
            chatContainer.scrollTop += scrollHeightAfter - scrollHeightBefore;
          }
        }, 0);
      } finally {
        setLoading(false);
      }
    },
    [activeUserId]
  );

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // 增加页码
  };

  useEffect(() => {
    if (!activeUserId) {
      return;
    }
    console.log('page', page);
    fetchMessages(page);
  }, [page]);

  useEffect(() => {
    if (!activeUserId) {
      return;
    }
    console.log('activeUserId', activeUserId);
    setPage(1); // 重置页码
    fetchMessages(1);
  }, [activeUserId]);

  useEffect(() => {
    if (messages.length > 0 && chatEndRef.current) {
      if (messages[messages.length - 1].last) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  const shouldShowTimestamp = (index: number) => {
    if (index === 0) return true;
    const currentTimestamp = messages[index].timestamp;
    const previousTimestamp = messages[index - 1]?.timestamp;
    // return currentTimestamp - previousTimestamp > 300; // 超过5分钟显示时间
    return currentTimestamp - previousTimestamp > 60; // 超过5分钟显示时间
  };

  const MessageItem: React.FC<{ message: Message; showTimestamp: boolean }> = ({
    message,
    showTimestamp,
  }) => (
    <>
      {showTimestamp && (
        <div className="text-center text-xs text-gray-500 my-2">
          {formatTimestamp(message.timestamp)}
        </div>
      )}
      <div
        className={`flex ${
          message.senderType === 1 ? 'justify-end' : 'justify-start'
        } mb-3`}
      >
        <div
          className={`max-w-xs p-3 rounded-lg shadow-sm ${
            message.senderType === 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          <p className="text-sm">{message.contentValue}</p>
        </div>
        {/* <span className="text-xs text-gray-400 ml-2 self-end">
          {dayjs.unix(message.timestamp).format('HH:mm')}
        </span> */}
      </div>
    </>
  );

  return (
    <div className="flex-grow p-4 bg-gray-100 overflow-y-auto rounded-lg shadow-lg">
      {/* {hasMore && (page > 1 || loading) && ( */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="text-sm text-gray-500 py-2 px-4 mx-auto block bg-white rounded-md shadow-md hover:bg-gray-100"
        >
          {loading ? '加载中...' : '加载更多'}
        </button>
      )}

      {activeUserId && !hasMore && !isFirstPage && (
        <div className="text-center text-sm text-gray-500 mt-2">
          没有更多消息了
        </div>
      )}

      {messages.length === 0 && !loading && (
        <div className="text-center text-gray-500 text-sm mt-4">
          暂无消息，请开始聊天。
        </div>
      )}
      {/* <div className="flex flexc flex-col-reverse"> */}
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          showTimestamp={shouldShowTimestamp(index)}
        />
      ))}
      {/* </div> */}
      <div ref={chatEndRef} />
    </div>
  );
};

export default React.memo(ChatWindow);
