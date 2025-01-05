import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Popconfirm } from 'antd';
import {
  queryKeywordsManagementByPage,
  addKeywordsManagement,
  deleteKeywordsManagement,
  updateKeywordsManagement,
} from '../../api/modules/crawler';
import { BasePage } from '@/redux/types';
import { KeywordsManagement } from '../../pages/types';
import KeywordsManagementModal from './component/KeywordsManagementModal';
import { SearchOutlined } from '@ant-design/icons';
const App: React.FC = () => {
  const [data, setData] = useState<KeywordsManagement[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [currentRule, setCurrentRule] = useState<KeywordsManagement | null>(
    null
  ); // 当前选中的规则
  const [modalVisible, setModalVisible] = useState(false); // 控制弹窗的显示

  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    queryKeywordsManagementByPage<BasePage<KeywordsManagement>>({
      page: pagination.current,
      size: pagination.size,
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
  const handleBeforeShowModal = async (rule: KeywordsManagement | null) => {
    // 执行一些业务逻辑，如数据获取或表单初始化
    console.log('Before showing modal:', rule);
    if (rule) {
      // 例如获取编辑相关数据，或者做一些校验
      // 可以通过API获取更多数据，设置初始值等
      // await fetchSomeData(rule.id);
    }
    setModalVisible(true);
  };

  const handleAdd = () => {
    const record = {
      productId: undefined,
      keyword: undefined,
      priority: undefined,
      autoExpand: undefined,
      enableBlacklist: undefined,
      whitelistOnly: undefined,
      smartBlacklisted: undefined,
      smartWhitelisted: undefined,
    };
    setCurrentRule(record); // 设置当前规则数据，表示是编辑
    handleBeforeShowModal(record);
  };
  // const handleEdit = (record: KeywordsManagement) => {
  //   console.log('Edit', record);
  //   setCurrentRule(record); // 设置当前规则数据，表示是编辑
  //   handleBeforeShowModal(record);
  // };
  const handleDelete = (record: KeywordsManagement) => {
    setModalLoading(true);
    deleteKeywordsManagement({ id: record.id })
      .then((_) => {
        fetchData();
      })
      .catch((err) => {
        console.error('Delete rror:', err);
      })
      .finally(() => {
        setModalLoading(true);
      });
  };

  const modalHandleOk = (record: KeywordsManagement) => {
    console.log('record', record);
    let method = null;
    if (record.id) {
      method = updateKeywordsManagement;
    } else {
      method = addKeywordsManagement;
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
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      align: 'center' as 'center',
    },
    {
      title: '所属商品',
      dataIndex: 'productName',
      key: 'productName',
      align: 'center' as 'center',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center' as 'center',
    },
    {
      title: '自动拓展',
      dataIndex: 'autoExpand',
      align: 'center' as 'center',
      key: 'autoExpand',
      render: (text: number) => (text === 1 ? '是' : '否'),
    },
    {
      title: '启用黑名单',
      dataIndex: 'enableBlacklist',
      align: 'center' as 'center',
      key: 'enableBlacklist',
      render: (text: number) => (text === 1 ? '是' : '否'),
    },
    {
      title: '启用白名单',
      dataIndex: 'enableWhitelist',
      align: 'center' as 'center',
      key: 'enableWhitelist',
      render: (text: number) => (text === 1 ? '是' : '否'),
    },
    {
      title: '智能拉黑',
      dataIndex: 'smartBlacklisted',
      align: 'center' as 'center',
      key: 'smartBlacklisted',
      render: (text: number) => (text === 0 ? '禁用' : text),
    },
    {
      title: '智能加白',
      dataIndex: 'smartWhitelisted',
      align: 'center' as 'center',
      key: 'smartWhitelisted',
      render: (text: number) => (text === 0 ? '禁用' : text),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as 'center',
      render: (_: any, record: KeywordsManagement) => (
        <div>
          {/* <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            修改
          </Button> */}
          <Popconfirm
            title="确定删除这条记录吗?"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
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

        <Button
          className=" ml-2"
          type="primary"
          size="middle"
          onClick={handleAdd}
        >
          添加关键字
        </Button>
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
        scroll={{
          y: 'calc(100vh - 203px)', // 自适应高度，固定表头
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
