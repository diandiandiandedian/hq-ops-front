// import { useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';

// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../redux/store';

// import { setSocket, setSocketConnected } from '../redux/modules/socketSlice';

// interface UseSocketProps {
//   sendMessage?: (message: string) => void;
//   onMessage?: (data: string) => void;
//   token?: string;
// }

// const useSocket = ({ sendMessage, onMessage }: UseSocketProps) => {
//   const dispatch = useDispatch();
//   const { socket, isConnected } = useSelector(
//     (state: RootState) => state.socket.socket
//   );
//   const token = useSelector((state: RootState) => state.auth.token);

//   useEffect(() => {
//     if (token && !isConnected) {
//       // 创建 WebSocket 连接
//       const newSocket: Socket = io('http://127.0.0.1:8081', {
//         transports: ['websocket'],
//         reconnection: true,
//         auth: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       dispatch(setSocket(newSocket));

//       newSocket.on('connect', () => {
//         dispatch(setSocketConnected(true));
//         console.log('WebSocket connected');
//       });

//       newSocket.on('message', (data: string) => {
//         console.log('message:', data);
//         if (onMessage) onMessage(data);
//       });

//       newSocket.on('disconnect', () => {
//         dispatch(setSocketConnected(false));
//         console.log('WebSocket disconnected');
//       });
//     }

//     // 清理 socket 连接
//     return () => {
//       if (socket) {
//         socket.disconnect();
//         dispatch(setSocket(null));
//       }
//     };
//   }, [token, dispatch, socket, isConnected, onMessage]);

//   const sendMessageToSocket = (message: string) => {
//     if (socket && socket.connected) {
//       socket.emit('message', message);
//     } else {
//       console.warn('Socket not connected');
//     }
//   };

//   return { sendMessage: sendMessageToSocket };
// };

// export default useSocket;
