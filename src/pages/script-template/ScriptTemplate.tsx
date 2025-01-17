import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Popconfirm, Switch, Space } from 'antd';
import {
  queryScriptTemplateByPage,
  deleteScriptTemplate,
  updateScriptTemplate,
  addScriptTemplate,
  updateRuleDisabledStatus,
} from '../../api';
import { BasePage } from '@/redux/types';
import { ScriptTemplate } from '../../pages/types';
import ScriptTemplateModal from './component/ScriptTemplateModal';
import { SearchOutlined } from '@ant-design/icons';

const App: React.FC = () => {
  const [data, setData] = useState<ScriptTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentRule, setCurrentRule] = useState<ScriptTemplate | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const fetchData = async () => {
    setLoading(true);
    const params = {
      page: pagination.current,
      size: pagination.size,
      query: searchQuery, // Pass search query to the API if needed
    };
    queryScriptTemplateByPage<BasePage<ScriptTemplate>>(params)
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
  }, [pagination.current, pagination.size, searchQuery]);

  const handleBeforeShowModal = async (_: ScriptTemplate | null) => {
    setModalVisible(true);
  };

  const handleAdd = () => {
    const record = {
      keyType: undefined,
      content: '',
      isDel: 0,
      isDisabled: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentRule(record);
    handleBeforeShowModal(record);
  };

  const handleEdit = (record: ScriptTemplate) => {
    setCurrentRule(record);
    handleBeforeShowModal(record);
  };

  const handleDelete = (record: ScriptTemplate) => {
    setModalLoading(true);
    deleteScriptTemplate({ id: record.id })
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

  const modalHandleOk = (record: ScriptTemplate) => {
    let method = record.id ? updateScriptTemplate : addScriptTemplate;
    setModalLoading(true);
    method({
      id: record.id,
      keyType: record.keyType,
      content: record.content,
      isDel: record.isDel,
      isDisabled: record.isDisabled,
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

  const handleDisable = (record: ScriptTemplate, flag: boolean) => {
    const originalDisabled = record.isDisabled;
    record.rowLoading = true;
    record.isDisabled = flag ? 1 : 0;
    setData([...data]); // Force UI refresh

    updateRuleDisabledStatus({
      id: record.id,
      disabled: flag ? 1 : 0,
    })
      .then(() => {
        fetchData();
      })
      .catch((err) => {
        console.error('Error disabling:', err);
        record.isDisabled = originalDisabled; // Restore original state
        setData([...data]); // Refresh table UI
      })
      .finally(() => {
        record.rowLoading = false;
        setData([...data]); // Update table data
      });
  };

  const columns = [
    {
      title: '招呼话术类型',
      dataIndex: 'keyType',
      key: 'keyType',
      align: 'center' as 'center',
    },
    {
      title: '招呼话术内容',
      dataIndex: 'content',
      key: 'content',
      align: 'center' as 'center',
    },
    {
      title: '是否禁用',
      dataIndex: 'isDisabled',
      key: 'isDisabled',
      align: 'center' as 'center',
      render: (_: any, record: ScriptTemplate) => (
        <Switch
          onChange={(e) => handleDisable(record, e)}
          checked={record.isDisabled === 1}
          loading={record.rowLoading}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as 'center',
      render: (_: any, record: ScriptTemplate) => (
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

  const handleSearch = () => {
    fetchData(); // Trigger data fetch with the search query
  };

  return (
    <>
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
          >
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
            y: 'calc(100vh - 203px)',
            x: 'max-content',
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
      <ScriptTemplateModal
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
