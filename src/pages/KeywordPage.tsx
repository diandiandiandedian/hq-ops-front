// import React, { useState, useEffect } from 'react';
// import { Table, Pagination } from 'antd';
// const App: React.FC = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });
//   useEffect(() => {
//     // userList({}).then((res) => {
//     //   console.log(res);
//     // });
//   }, []);

//   const fetchData = async (page: number, pageSize: number) => {
//     setLoading(true);
//     try {
//       const total = 100; // 假设总记录数
//       const mockData = Array.from({ length: pageSize }, (_, index) => ({
//         key: (page - 1) * pageSize + index + 1,
//         uid: `user_${(page - 1) * pageSize + index + 1}`,
//         nickname: `User ${(page - 1) * pageSize + index + 1}`,
//         platform: 'xhs',
//         ipLocation: '广东',
//         fans: `${Math.floor(Math.random() * 10000)}+`,
//         desc: '描述信息示例，内容可能会较长，因此需要省略显示。',
//         sourceTime: '2024/12/13 16:43',
//       }));

//       setData(mockData);
//       setPagination((prev) => ({
//         ...prev,
//         current: page,
//         total,
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTableChange = (page: number, pageSize: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       current: page,
//       pageSize,
//     }));
//     fetchData(page, pageSize);
//   };

//   useEffect(() => {
//     fetchData(pagination.current, pagination.pageSize);
//   }, []);

//   const columns = [
//     { title: 'UID', dataIndex: 'uid', key: 'uid' },
//     { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
//     { title: '平台', dataIndex: 'platform', key: 'platform' },
//     { title: 'IP位置', dataIndex: 'ipLocation', key: 'ipLocation' },
//     { title: '粉丝数', dataIndex: 'fans', key: 'fans' },
//     { title: '描述', dataIndex: 'desc', key: 'desc', ellipsis: true },
//     { title: '发布时间', dataIndex: 'sourceTime', key: 'sourceTime' },
//   ];

//   return (
//     <div className="h-full">
//       <Table
//         columns={columns}
//         dataSource={data}
//         loading={loading}
//         rowKey="key"
//         pagination={false}
//         scroll={{
//           y: 'calc(100vh - 203px)', // 自适应高度，固定表头
//           x: 'max-content', // 水平滚动，适合列较多
//         }}
//       />
//       <div className=" py-[10px] flex justify-end">
//         <Pagination
//           current={pagination.current}
//           total={pagination.total}
//           pageSize={pagination.pageSize}
//           showSizeChanger
//           onChange={handleTableChange}
//           onShowSizeChange={(current, size) => handleTableChange(current, size)}
//         />
//       </div>
//     </div>
//   );
// };

// export default App;
