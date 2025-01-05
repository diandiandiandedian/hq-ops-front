import React, { useState, useEffect, useRef } from 'react';
import { Table, Pagination, Button, Popconfirm, Input, InputRef } from 'antd';
import {
  queryProductListByPage,
  addProduct,
  deleteProduct,
  updateProduct,
} from '../../api/modules/crawler';
import { BasePage } from '@/redux/types';
import { Product } from '@/pages/types';
import ProductModal from './component/ProductModal';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';

const App: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [currentRule, setCurrentRule] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
  });

  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchData = async () => {
    setLoading(true);
    queryProductListByPage<BasePage<Product>>({
      page: pagination.current,
      size: pagination.size,
      keywords: searchKeyword,
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
    if (!searchKeyword) {
      handleSearch();
    }
    inputRef.current?.focus();
  }, [searchKeyword]);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleAdd = () => {
    const record = {
      name: '',
      description: '',
      targetPlatform: '',
      orderPlatform: '',
    };
    setCurrentRule(record);
    setModalVisible(true);
  };

  const handleEdit = (record: Product) => {
    setCurrentRule(record);
    setModalVisible(true);
  };

  const handleDelete = (record: Product) => {
    setModalLoading(true);
    deleteProduct({ id: record.id })
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

  const modalHandleOk = (record: Product) => {
    const method = record.id ? updateProduct : addProduct;
    setModalLoading(true);
    method({
      id: record.id,
      name: record.name,
      description: record.description,
      targetPlatform: record.targetPlatform,
      orderPlatform: record.orderPlatform,
    })
      .then(() => {
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
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as 'center',
    },
    {
      title: '商品描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center' as 'center',
    },
    {
      title: '目标平台',
      dataIndex: 'targetPlatform',
      key: 'targetPlatform',
      align: 'center' as 'center',
    },
    {
      title: '订单平台',
      dataIndex: 'orderPlatform',
      key: 'orderPlatform',
      align: 'center' as 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as 'center',
      render: (_: any, record: Product) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    // 在值变化后手动聚焦输入框
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center pb-2">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="请输入关键字"
            value={searchKeyword}
            ref={inputRef}
            onChange={handleChange}
            style={{ width: 200 }}
            suffix={
              searchKeyword ? (
                <CloseCircleOutlined
                  onClick={() => setSearchKeyword('')} // 清空内容
                  style={{ cursor: 'pointer', color: '#ccc' }}
                />
              ) : null
            }
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            loading={loading}
            onClick={handleSearch}
          >
            查询
          </Button>
          <Button type="primary" size="middle" onClick={handleAdd}>
            添加商品
          </Button>
        </div>
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
        scroll={{ y: 'calc(100vh - 203px)', x: 'max-content' }}
      />

      <div className="py-[10px] flex justify-end">
        <Pagination
          current={pagination.current}
          total={pagination.total}
          pageSize={pagination.size}
          pageSizeOptions={['10', '20', '30', '40', '50']}
          showSizeChanger
          onChange={handleTableChange}
        />
      </div>

      <ProductModal
        loading={modalLoading}
        onCancel={() => setModalVisible(false)}
        open={modalVisible}
        onOk={modalHandleOk}
        initialValues={currentRule}
      />
    </div>
  );
};

export default App;
