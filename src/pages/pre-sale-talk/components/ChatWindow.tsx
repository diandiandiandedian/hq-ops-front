import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { Message } from '@/pages/types';
import { queryMessageListByPage } from '../../../api/index';
import { BasePage } from '@/redux/types';
import dayjs from 'dayjs';
import { Button, Image, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ChatWindow: React.FC = () => {
  const { activeUserId, messages, setMessages, addMessage, updateMessageRead } =
    useSocket();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const formatTimestamp = (timestamp: number) =>
    dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm');

  const fetchMessages = useCallback(
    async (pageNum: number) => {
      if (loading) return;
      if (pageNum === 1) {
        setMessages([]);
      }
      const chatContainer = chatEndRef.current?.parentElement;

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
          if (pageNum === 1) {
            setMessages(res.records.reverse());
          } else {
            const records: Message[] = res.records.reverse() as Message[];
            // @ts-ignore
            setMessages((prevMessages: Message[]) => [
              ...records,
              ...prevMessages,
            ]);
          }
          const unReadId = res.records
            .filter((item) => item.isRead === 1)
            .map((item) => item.id)
            .join();
          updateMessageRead(unReadId);
        }

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

  const closePreview = () => {
    setIsPreviewVisible(false);
    setPreviewImage(null);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (!activeUserId) {
      return;
    }
    fetchMessages(page);
  }, [page]);

  useEffect(() => {
    if (!activeUserId) {
      return;
    }
    setMessages([]);
    setPage(1);
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
    const currentTimestamp = messages[index].timestamp ?? 0;
    const previousTimestamp = messages[index - 1]?.timestamp ?? 0;
    return currentTimestamp - previousTimestamp > 60;
  };

  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setIsPreviewVisible(true);
  };

  const handleVideoClick = (url: string) => {
    setVideoUrl(url);
  };

  const closeVideoModal = () => {
    setVideoUrl(null);
  };

  const MessageItem: React.FC<{ message: Message; showTimestamp: boolean }> = ({
    message,
    showTimestamp,
  }) => (
    <>
      {showTimestamp && (
        <div className="text-center text-xs text-gray-500 my-2">
          {message.timestamp ? formatTimestamp(message.timestamp) : ''}
        </div>
      )}
      <div
        className={`flex ${
          message.senderType === 1 || message.senderType === 2
            ? 'justify-end'
            : 'justify-start'
        } mb-3`}
      >
        <Button
          type="link"
          onClick={() => {
            addMessage(message);
          }}
          icon={
            message.sendStatus === 2 ? (
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            ) : null
          }
          className="self-center mr-5"
          loading={message.sendStatus === 0}
        />
        <div
          className={`max-w-xs p-3 rounded-lg shadow-sm ${
            message.senderType === 1 || message.senderType === 2
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          {message.contentType === 0 && (
            <p className="text-sm">{message.contentValue}</p>
          )}
          {message.contentType === 1 && (
            <div className="relative flex justify-center items-center h-48 w-48 bg-gray-200 overflow-hidden">
              <Image
                src={message.contentValue}
                alt="Message Image"
                preview={false}
                onClick={() => handleImageClick(message.contentValue)}
                className="cursor-pointer object-contain max-w-full max-h-full"
                loading="lazy"
              />
            </div>
          )}
          {message.contentType === 2 && (
            <div className="relative">
              <div
                className="h-48 w-48 bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={() => handleVideoClick(message.contentValue)}
              >
                <span className="text-gray-600">点击播放视频</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex-grow p-4 bg-gray-100 overflow-y-auto rounded-lg shadow-lg">
      {hasMore && activeUserId && (
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

      {messages.length === 0 && activeUserId && !loading && (
        <div className="text-center text-gray-500 text-sm mt-4">
          暂无消息，请开始聊天。
        </div>
      )}

      {messages.map((message, index) => (
        <MessageItem
          key={message.id || message.requestId}
          message={message}
          showTimestamp={shouldShowTimestamp(index)}
        />
      ))}
      <div className="h-1" ref={chatEndRef} />

      <Modal
        open={isPreviewVisible}
        footer={null}
        onCancel={closePreview}
        centered
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage || ''} />
      </Modal>

      <Modal
        open={!!videoUrl}
        footer={null}
        onCancel={closeVideoModal}
        centered
        width={800}
      >
        {videoUrl && (
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{ width: '100%', borderRadius: '8px' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default React.memo(ChatWindow);
