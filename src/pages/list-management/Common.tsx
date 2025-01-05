import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Popconfirm, Space } from 'antd';
import {
  queryListManagementByPage,
  deleteListManagement,
  updateListManagement,
  addListManagement,
} from '../../api/modules/crawler';
import { BasePage } from '@/redux/types';
import { formatTimestamp } from '../../utils/dateUtils';
import { ListManagement } from '../../pages/types';
import BlackListModal from './component/Modal';

interface ComponentProps {
  type: number;
}

const App: React.FC<ComponentProps> = ({ type }) => {
  const [data, setData] = useState<ListManagement[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentRule, setCurrentRule] = useState<ListManagement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // // Search parameters
  // const [searchParams, setSearchParams] = useState({
  //   platform: '',
  //   uuid: '',
  //   nickname: '',
  // });

  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
  });

  // Fetch data based on current pagination and search parameters
  const fetchData = async () => {
    setLoading(true);
    const params = {
      page: pagination.current,
      size: pagination.size,
      type: type,
      // ...searchParams, // Include search parameters in request
    };
    queryListManagementByPage<BasePage<ListManagement>>(params)
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

  const handleBeforeShowModal = async (_: ListManagement | null) => {
    setModalVisible(true);
  };

  const handleAdd = () => {
    const record = {
      platform: '',
      uuid: '',
      nickname: '',
      reason: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      type: 0,
    };
    setCurrentRule(record);
    handleBeforeShowModal(record);
  };

  const handleEdit = (record: ListManagement) => {
    setCurrentRule(record);
    handleBeforeShowModal(record);
  };

  const handleDelete = (record: ListManagement) => {
    setModalLoading(true);
    deleteListManagement({ id: record.id })
      .then(() => {
        fetchData();
      })
      .catch((err) => {
        console.error('Delete error:', err);
      })
      .finally(() => {
        setModalLoading(false);
      });
  };

  const modalHandleOk = (record: ListManagement) => {
    let method = record.id ? updateListManagement : addListManagement;
    setModalLoading(true);
    method({
      id: record.id,
      platform: record.platform,
      uuid: record.uuid,
      nickname: record.nickname,
      reason: record.reason,
      type: type,
    })
      .then(() => {
        setModalVisible(false);
        fetchData();
      })
      .catch((err) => {
        console.error('Error:', err);
      })
      .finally(() => {
        setModalLoading(false);
      });
  };

  const handleSearch = () => {
    // Reset pagination to the first page when searching
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const columns = [
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      align: 'center' as 'center',
    },
    {
      title: '用户唯一标识',
      dataIndex: 'uuid',
      key: 'uuid',
      align: 'center' as 'center',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center' as 'center',
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center' as 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center' as 'center',
      render: (text: any) => formatTimestamp(text),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as 'center',
      render: (_: any, record: ListManagement) => (
        <div>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            修改
          </Button>
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
    <>
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
          <Button type="primary" onClick={handleAdd}>
            新增
          </Button>
        </Space>
        <Table
          columns={columns}
          style={{ width: '100%' }}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.id!}
          bordered
          size="middle"
          pagination={false}
          rowClassName={(_, index) =>
            index % 2 !== 0 ? 'even-row' : 'odd-row'
          }
          scroll={{
            y: 'calc(100vh - 203px)', // 自适应高度，固定表头
            x: 'max-content', // 水平滚动，适合列较多
          }}
        />
        <div className="py-[10px] flex justify-end">
          <Pagination
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.size}
            pageSizeOptions={['10', '20', '30', '40', '50']}
            showSizeChanger
            onChange={handleTableChange}
            onShowSizeChange={(current, size) =>
              handleTableChange(current, size)
            }
          />
        </div>
      </div>
      <BlackListModal
        open={modalVisible}
        loading={modalLoading}
        onOk={modalHandleOk}
        onCancel={() => setModalVisible(false)}
        initialValues={currentRule}
      />
    </>
  );
};

export default App;
