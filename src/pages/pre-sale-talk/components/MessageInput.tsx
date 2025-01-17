import React, { useState } from 'react';
import { Message } from '../../../pages/types';
import { useSocket } from '../../../context/SocketContext';
import { uploadChatFile } from '../../../api/index';
import { v4 as uuidv4 } from 'uuid';
import { Button } from 'antd';

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { activeUserId, addMessage, activeUserName } = useSocket();
  const [uploading, setUploading] = useState<boolean>(false); // For managing loading state during file upload
  const handleSendText = () => {
    const value = input.trim();
    if (!value) return; // Prevent sending empty messages

    const uuid = uuidv4();
    // Create a new message object for text
    const message: Message = {
      userId: activeUserId,
      userName: activeUserName,
      contentType: 0, // Text message
      contentValue: value,
      senderType: 1,
      sendStatus: 0,
      requestId: uuid,
      last: true,
    };

    addMessage(message); // Add message to the list
    // sendMessage(message); // Send the text message

    setInput(''); // Clear the input
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); // Set loading state

    const uuid = uuidv4();
    uploadChatFile<any>(file, {})
      .then((response) => {
        // Assuming the server returns the image URL in the response
        const imageUrl = response.fullurl;

        // Create a new message object for image
        const message: Message = {
          userId: activeUserId,
          userName: activeUserName,
          contentType: 1, // Image message
          contentValue: imageUrl,
          senderType: 1,
          sendStatus: 0,
          requestId: uuid,
          last: true,
        };

        addMessage(message); // Add message to the list
      })
      .catch((err) => {
        console.error('Image upload failed:', err);
      })
      .finally(() => {
        setUploading(false); // Reset loading state
      });
  };

  const handleButtonClick = () => {
    // Trigger file input when the button is clicked
    const inputElement = document.getElementById(
      'imageInput'
    ) as HTMLInputElement;
    inputElement?.click();
  };

  return (
    <div className="p-4 bg-white border-t border-gray-300 shadow-md">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
        />

        {/* File input for image upload, hidden by default */}
        {!uploading && (
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="imageInput"
            onChange={handleImageChange}
          />
        )}

        {/* Button for selecting and sending the image */}
        <Button
          type="primary"
          icon={<i className="fas fa-image"></i>} // Add an icon for image
          loading={uploading} // Display loading state
          onClick={handleButtonClick} // Trigger file input click
        >
          {uploading ? '上传中...' : '图片'}
        </Button>

        <Button
          type="primary"
          onClick={handleSendText} // Handle text send
        >
          发送
        </Button>
      </div>

      {/* {image && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(image)} // Display local image path
            alt="Preview"
            className="max-w-[100px] max-h-[100px] object-cover"
          />
        </div>
      )} */}
    </div>
  );
};

export default MessageInput;
