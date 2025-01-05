import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button } from 'antd';
import {
  queryNotesCommentsByPage,
  addNotesComment,
  updateNotesComment,
} from '../../api/modules/crawler';
import { BasePage } from '@/redux/types';
import { KeywordsManagement } from '../types';
import KeywordsManagementModal from './component/NoteCommentModal';
import FilterModal from './component/FilterModal';
import { SearchOutlined } from '@ant-design/icons';

interface ComponentProps {
  filterType?: number;
}
const App: React.FC<ComponentProps> = ({ filterType }) => {
  const [data, setData] = useState<KeywordsManagement[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [currentRule, _] = useState<KeywordsManagement | null>(null); // 当前选中的规则
  const [modalVisible, setModalVisible] = useState(false); // 控制弹窗的显示
  const [filterModalVisible, setFilterModalVisible] = useState(false); // 控制弹窗的显示

  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    queryNotesCommentsByPage<BasePage<KeywordsManagement>>({
      page: pagination.current,
      size: pagination.size,
      filterType: filterType,
    })
      .then((res) => {
        setData(res.records);
        setPagination((prev) => ({
          ...prev,
          total: res.total,
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTableChange = (page: number, size: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      size,
    }));
  };
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size]);

  useEffect(() => {
    fetchData();
  }, []);

  // 在显示弹窗前执行业务逻辑
  // const handleBeforeShowModal = async (rule: KeywordsManagement | null) => {
  //   // 执行一些业务逻辑，如数据获取或表单初始化
  //   console.log('Before showing modal:', rule);
  //   if (rule) {
  //     // 例如获取编辑相关数据，或者做一些校验
  //     // 可以通过API获取更多数据，设置初始值等
  //     // await fetchSomeData(rule.id);
  //   }
  //   setModalVisible(true);
  // };

  // const handleAdd = () => {
  //   const record = {
  //     productId: undefined,
  //     keyword: undefined,
  //     priority: undefined,
  //     autoExpand: undefined,
  //     enableBlacklist: undefined,
  //     whitelistOnly: undefined,
  //     smartBlacklisted: undefined,
  //     smartWhitelisted: undefined,
  //   };
  //   setCurrentRule(record); // 设置当前规则数据，表示是编辑
  //   handleBeforeShowModal(record);
  // };

  // const filter = () => {
  // setFilterModalVisible(true);
  // const record = {
  //   productId: undefined,
  //   keyword: undefined,
  //   priority: undefined,
  //   autoExpand: undefined,
  //   enableBlacklist: undefined,
  //   whitelistOnly: undefined,
  //   smartBlacklisted: undefined,
  //   smartWhitelisted: undefined,
  // };
  // setCurrentRule(record); // 设置当前规则数据，表示是编辑
  // handleBeforeShowModal(record);
  // };
  // const handleEdit = (record: KeywordsManagement) => {
  //   console.log('Edit', record);
  //   setCurrentRule(record); // 设置当前规则数据，表示是编辑
  //   handleBeforeShowModal(record);
  // };
  // const handleDelete = (record: KeywordsManagement) => {
  //   setModalLoading(true);
  //   deleteNotesComment({ id: record.id })
  //     .then((_) => {
  //       fetchData();
  //     })
  //     .catch((err) => {
  //       console.error('Delete rror:', err);
  //     })
  //     .finally(() => {
  //       setModalLoading(true);
  //     });
  // };

  // useEffect(() => {
  //   const calculateScrollHeight = () => {
  //     const tableContainer = document.getElementById(
  //       'table-container'
  //     ) as HTMLElement;

  //     if (tableContainer) {
  //       const containerHeight = tableContainer.clientHeight; // 外部容器高度
  //       const tableHeader = tableContainer.querySelector(
  //         '.ant-table-header'
  //       ) as HTMLElement;
  //       const tablePagination = tableContainer.querySelector(
  //         '.ant-pagination'
  //       ) as HTMLElement;

  //       const headerHeight = tableHeader?.offsetHeight || 48; // 表头高度，默认 48px
  //       const paginationHeight = tablePagination?.offsetHeight || 50; // 分页高度，默认 50px

  //       const contentHeight = containerHeight - headerHeight - paginationHeight; // 动态计算内容高度
  //       console.log(containerHeight);
  //       // setTableScrollY(contentHeight);
  //     }
  //   };

  //   window.addEventListener('resize', calculateScrollHeight); // 窗口大小改变时重新计算
  //   calculateScrollHeight(); // 初始化计算

  //   return () => window.removeEventListener('resize', calculateScrollHeight); // 清除监听器
  // }, []);

  const filterModalHandleOk = () => {
    setFilterModalVisible(false);
    fetchData();
  };
  const modalHandleOk = (record: KeywordsManagement) => {
    console.log('record', record);
    let method = null;
    if (record.id) {
      method = updateNotesComment;
    } else {
      method = addNotesComment;
    }
    setModalLoading(true);
    method({
      id: record.id,
      productId: record.productId,
      keyword: record.keyword,
      priority: record.priority,
      autoExpand: record.autoExpand,
      enableBlacklist: record.enableBlacklist,
      whitelistOnly: record.whitelistOnly,
      smartBlacklisted: record.smartBlacklisted,
      smartWhitelisted: record.smartWhitelisted,
    })
      .then((_) => {
        setModalVisible(false);
        fetchData();
      })
      .catch((err) => {
        console.error('Update error:', err);
      })
      .finally(() => {
        setModalLoading(false);
      });
  };

  const columns = [
    {
      title: '采集者昵称',
      dataIndex: 'colName',
      key: 'colName',
      align: 'center' as 'center',
    },
    // {
    //   title: '采集者头像',
    //   dataIndex: 'colImage',
    //   key: 'colImage',
    //   align: 'center' as 'center',
    // },
    {
      title: '笔记类型',
      dataIndex: 'noteType',
      key: 'noteType',
      align: 'center' as 'center',
    },
    // {
    //   title: '笔记封面',
    //   dataIndex: 'noteCover',
    //   align: 'center' as 'center',
    //   key: 'noteCover',
    // },
    {
      title: '笔记标题',
      dataIndex: 'noteTitle',
      align: 'center' as 'center',
      key: 'noteTitle',
    },
    {
      title: '作者昵称',
      dataIndex: 'noteUserName',
      align: 'center' as 'center',
      key: 'noteUserName',
    },
    // {
    //   title: '作者头像',
    //   dataIndex: 'noteUserImage',
    //   align: 'center' as 'center',
    //   key: 'noteUserImage',
    // },
    // {
    //   title: '评论标识',
    //   dataIndex: 'colCursor',
    //   align: 'center' as 'center',
    //   key: 'colCursor',
    // },
    // {
    //   title: '采集者Token',
    //   dataIndex: 'colToken',
    //   align: 'center' as 'center',
    //   key: 'colToken',
    // },
    {
      title: '评论内容',
      dataIndex: 'comContent',
      align: 'center' as 'center',
      key: 'comContent',
      width: 200,
    },
    // {
    //   title: '评论时间',
    //   dataIndex: 'comCreateTime',
    //   align: 'center' as 'center',
    //   key: 'comCreateTime',
    // },
    {
      title: '评论点赞数',
      dataIndex: 'comLikeCount',
      align: 'center' as 'center',
      key: 'comLikeCount',
    },
    {
      title: '评论回复数',
      dataIndex: 'comSubCommentCount',
      align: 'center' as 'center',
      key: 'comSubCommentCount',
    },
    {
      title: '评论者昵称',
      dataIndex: 'comUserNickname',
      align: 'center' as 'center',
      key: 'comUserNickname',
    },
    // {
    //   title: '评论者头像',
    //   dataIndex: 'comUserImage',
    //   align: 'center' as 'center',
    //   key: 'comUserImage',
    //   render: (text: number) => (text === 0 ? '禁用' : text),
    // },
    // {
    //   title: '评论者Token',
    //   dataIndex: 'comUserToken',
    //   align: 'center' as 'center',
    //   key: 'comUserToken',
    // },
    // {
    //   title: '操作',
    //   fixed: 'right' as 'right',
    //   key: 'action',
    //   align: 'center' as 'center',
    //   render: (_: any, record: KeywordsManagement) => (
    //     <div>
    //       {/* <Button
    //         type="link"
    //         onClick={() => handleEdit(record)}
    //         style={{ marginRight: 8 }}
    //       >
    //         修改
    //       </Button> */}
    //       {/* <Popconfirm
    //         title="确定删除这条记录吗?"
    //         onConfirm={() => handleDelete(record)}
    //         okText="确定"
    //         cancelText="取消"
    //       >
    //         <Button type="link" danger>
    //           删除
    //         </Button>
    //       </Popconfirm> */}
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="h-full">
      <div className="flex  items-center pb-2">
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={fetchData}
          loading={loading}
        >
          查询
        </Button>

        {/* <Button
          className=" ml-2"
          type="primary"
          size="middle"
          onClick={handleAdd}
        >
          添加关键字
        </Button> */}

        {/* <Button className=" ml-2" type="primary" size="middle" onClick={filter}>
          {filterType === 0 ? '匹配黑名单' : '匹配白名单'}
        </Button> */}

        {/* <Button
          className=" ml-2"
          type="primary"
          size="middle"
          onClick={handleAdd}
        >
          匹配白名单
        </Button> */}
      </div>
      <Table
        columns={columns}
        style={{ width: '100%' }}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id!}
        bordered
        size="middle"
        pagination={false}
        rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : 'odd-row')}
        // 64 + 20 + 40 + 8 + 52 + 10 + 135 + 16
        scroll={{
          y: 'calc(100vh - 345px)', // 自适应高度，固定表头
          x: 'max-content', // 水平滚动，适合列较多
        }}
      />
      <div className=" py-[10px] flex justify-end">
        <Pagination
          current={pagination.current}
          total={pagination.total}
          pageSize={pagination.size}
          pageSizeOptions={['10', '20', '30', '40', '50']}
          showSizeChanger
          onChange={handleTableChange}
          onShowSizeChange={(current, size) => handleTableChange(current, size)}
        />
      </div>

      <FilterModal
        loading={modalLoading}
        onCancel={() => {
          setFilterModalVisible(false);
        }}
        open={filterModalVisible} // 控制弹窗的显示
        onOk={filterModalHandleOk}
        initialValues={{ filterType }}
      />

      <KeywordsManagementModal
        loading={modalLoading}
        onCancel={() => {
          setModalVisible(false);
        }}
        open={modalVisible} // 控制弹窗的显示
        onOk={modalHandleOk}
        initialValues={currentRule}
      />
    </div>
  );
};

export default App;
