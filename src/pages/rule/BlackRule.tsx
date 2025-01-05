// import React, { useState, useEffect } from 'react';
// import { Table, Pagination, Button, Popconfirm } from 'antd';
// import {
//   queryBlacklistRuleByPage,
//   addBlacklistRule,
//   deleteBlacklistRule,
//   updateBlacklistRule,
// } from '@/api/modules/crawler';
// import { BasePage } from '@/redux/types';
// import { formatTimestamp } from '@/utils/dateUtils';
// import { BlackListRule } from '@/pages/types';
// import BlackListModal from './component/BlackListModal';
// import { SearchOutlined } from '@ant-design/icons';
// const App: React.FC = () => {
//   const [data, setData] = useState<BlackListRule[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);

//   const [currentRule, setCurrentRule] = useState<BlackListRule | null>(null); // 当前选中的规则
//   const [modalVisible, setModalVisible] = useState(false); // 控制弹窗的显示

//   const [pagination, setPagination] = useState({
//     current: 1,
//     size: 10,
//     total: 0,
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     queryBlacklistRuleByPage<BasePage<BlackListRule>>({
//       page: pagination.current,
//       size: pagination.size,
//     })
//       .then((res) => {
//         setData(res.records);
//         setPagination((prev) => ({
//           ...prev,
//           total: res.total,
//         }));
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleTableChange = (page: number, size: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       current: page,
//       size,
//     }));
//   };
//   useEffect(() => {
//     fetchData();
//   }, [pagination.current, pagination.size]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // 在显示弹窗前执行业务逻辑
//   const handleBeforeShowModal = async (rule: BlackListRule | null) => {
//     // 执行一些业务逻辑，如数据获取或表单初始化
//     console.log('Before showing modal:', rule);
//     if (rule) {
//       // 例如获取编辑相关数据，或者做一些校验
//       // 可以通过API获取更多数据，设置初始值等
//       // await fetchSomeData(rule.id);
//     }
//     setModalVisible(true);
//   };

//   const handleAdd = () => {
//     const record = { fieldName: undefined, alias: '', regexPattern: '' };
//     setCurrentRule(record); // 设置当前规则数据，表示是编辑
//     handleBeforeShowModal(record);
//   };
//   const handleEdit = (record: BlackListRule) => {
//     console.log('Edit', record);
//     setCurrentRule(record); // 设置当前规则数据，表示是编辑
//     handleBeforeShowModal(record);
//   };
//   const handleDelete = (record: BlackListRule) => {
//     setModalLoading(true);
//     deleteBlacklistRule({ id: record.id })
//       .then((res) => {
//         fetchData();
//       })
//       .catch((err) => {
//         console.error('Delete rror:', err);
//       })
//       .finally(() => {
//         setModalLoading(true);
//       });
//   };

//   const modalHandleOk = (record: BlackListRule) => {
//     let method = null;
//     if (record.id) {
//       method = updateBlacklistRule;
//     } else {
//       method = addBlacklistRule;
//     }
//     setModalLoading(true);
//     method({
//       id: record.id,
//       fieldName: record.fieldName,
//       alias: record.alias,
//       regexPattern: record.regexPattern,
//     })
//       .then((res) => {
//         setModalVisible(false);
//         fetchData();
//       })
//       .catch((err) => {
//         console.error('Update error:', err);
//       })
//       .finally(() => {
//         setModalLoading(false);
//       });
//   };

//   const columns = [
//     {
//       title: '匹配字段',
//       dataIndex: 'fieldName',
//       key: 'fieldName',
//       align: 'center' as 'center',
//     },
//     {
//       title: '别名',
//       dataIndex: 'alias',
//       key: 'alias',
//       align: 'center' as 'center',
//     },
//     {
//       title: '正则表达式',
//       dataIndex: 'regexPattern',
//       key: 'regexPattern',
//       align: 'center' as 'center',
//       width: 300,
//       render: (text: string) => (
//         <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
//           {text}
//         </div>
//       ),
//     },
//     {
//       title: '创建时间',
//       dataIndex: 'createdAt',
//       align: 'center' as 'center',
//       key: 'createdAt',
//       render: (text: number) => formatTimestamp(text),
//     },
//     {
//       title: '操作',
//       key: 'action',
//       align: 'center' as 'center',
//       render: (_: any, record: BlackListRule) => (
//         <div>
//           <Button
//             type="link"
//             onClick={() => handleEdit(record)}
//             style={{ marginRight: 8 }}
//           >
//             修改
//           </Button>
//           <Popconfirm
//             title="确定删除这条记录吗?"
//             onConfirm={() => handleDelete(record)}
//             okText="确定"
//             cancelText="取消"
//           >
//             <Button type="link" danger>
//               删除
//             </Button>
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="h-full">
//       <div className="flex  items-center pb-2">
//         <Button
//           type="primary"
//           icon={<SearchOutlined />}
//           onClick={fetchData}
//           loading={loading}
//         >
//           查询
//         </Button>

//         <Button
//           className=" ml-2"
//           type="primary"
//           size="middle"
//           onClick={handleAdd}
//         >
//           添加规则
//         </Button>
//       </div>
//       <Table
//         columns={columns}
//         style={{ width: '100%' }}
//         dataSource={data}
//         loading={loading}
//         rowKey={(record) => record.id!}
//         bordered
//         size="middle"
//         pagination={false}
//         rowClassName={(record, index) =>
//           index % 2 !== 0 ? 'even-row' : 'odd-row'
//         }
//         scroll={{
//           y: 'calc(100vh - 203px)', // 自适应高度，固定表头
//           x: 'max-content', // 水平滚动，适合列较多
//         }}
//       />
//       <div className=" py-[10px] flex justify-end">
//         <Pagination
//           current={pagination.current}
//           total={pagination.total}
//           pageSize={pagination.size}
//           pageSizeOptions={['10', '20', '30', '40', '50']}
//           showSizeChanger
//           onChange={handleTableChange}
//           onShowSizeChange={(current, size) => handleTableChange(current, size)}
//         />
//       </div>

//       <BlackListModal
//         loading={modalLoading}
//         onCancel={() => {
//           setModalVisible(false);
//         }}
//         open={modalVisible} // 控制弹窗的显示
//         onOk={modalHandleOk}
//         initialValues={currentRule}
//       />
//     </div>
//   );
// };

// export default App;

import React from 'react';

import Rule from './Common';

const ComponentName: React.FC = () => {
  return <Rule type={0} />;
};

export default ComponentName;
