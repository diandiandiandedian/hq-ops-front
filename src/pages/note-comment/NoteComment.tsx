import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Popconfirm } from 'antd';
import {
  queryNotesCommentsByPage,
  removeFilterType,
  updateRuleDisabledStatus,
} from '../../api/modules/crawler';
import { BasePage } from '@/redux/types';
import { NotesComments } from '../types';
import { SearchOutlined } from '@ant-design/icons';

interface ComponentProps {
  filterType?: number;
}
const App: React.FC<ComponentProps> = ({ filterType }) => {
  const [data, setData] = useState<NotesComments[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    queryNotesCommentsByPage<BasePage<NotesComments>>({
      page: pagination.current,
      size: pagination.size,
      filterType: filterType,
    })
      .then((res) => {
        res.records.forEach((item) => (item.removeLoading = false));
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

  const handleRemove = (record: NotesComments) => {
    record.removeLoading = true;
    setData([...data]);

    removeFilterType({ id: record.id })
      .then((_) => {
        fetchData();
      })
      .catch((err) => {
        console.error('Remove error:', err);
      })
      .finally(() => {
        record.removeLoading = false;
        setData([...data]);
      });
  };

  const allColumns = [
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
    {
      title: '操作',
      fixed: 'right' as 'right',
      key: 'action',
      width: 100,
      align: 'center' as 'center',
      render: (_: any, record: NotesComments) => (
        <div>
          {/* <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            修改
          </Button> */}
          <Popconfirm
            title="确定移除这条记录吗?"
            onConfirm={() => handleRemove(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button loading={record.removeLoading} type="link" danger>
              移除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const columns = !(filterType === 0 || filterType === 1)
    ? allColumns.filter((item) => item.key !== 'action')
    : allColumns;

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
    </div>
  );
};

export default App;
