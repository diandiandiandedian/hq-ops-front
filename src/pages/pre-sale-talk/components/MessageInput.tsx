import React, { useState } from 'react';
import { Message } from '../../../pages/types';
import { useSocket } from '../../../context/SocketContext';

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { activeUserId, addMessage } = useSocket();

  const handleSend = () => {
    if (!input.trim()) return;

    // 创建新的消息对象
    // const message: Message = {
    //   id: Date.now(),
    //   userId: activeUserId,
    //   from: 'admin',
    //   userName: '',
    //   message: input,
    //   time: new Date().toLocaleTimeString(),
    // };

    // addMessage(message);

    // id: number; // 主键ID
    // taskId: string; // 任务ID
    // userId: string; // 用户ID
    // userName: string; // 用户名
    // contentType: number; // 消息类型 (0 = 文本，1 = 图片，2 = 视频)
    // contentValue: string; // 消息内容
    // timestamp: number; // 时间戳
    // status: number; // 消息状态 (0 = 待处理，1 = 成功，2 = 失败)
    // operatorId: number; // 操作员ID
    // senderType: number; // 发送者类型 (0 = 第三方用户，1 = B 端管理员，2 = 系统消息)
    // isRead: number; // 是否已读 (1 = 未读，0 = 已读)
    // createdAt: number; // 创建时间
    // updatedAt: number; // 更新时间

    // last: boolean; // 用于判断是否显示到最后
    setInput('');
  };

  return (
    <div className="p-4 bg-white border-t border-gray-300 shadow-md">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleSend}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
