import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RadarChartOutlined,
  FilterOutlined,
  SafetyOutlined,
  TagsOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  DatabaseOutlined,
  UnorderedListOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Tooltip, theme, notification } from 'antd';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import FilterPage from './FilterPage';
import BlackRule from './rule/BlackRule';
import WhiteRule from './rule/WhiteRule';
import BlackListManagement from './note-comment/BlackListManagement';
import WhiteListManagement from './note-comment/WhiteListManagement';
import OrderPage from './OrderPage';
import NoteComment from './note-comment/NoteComment';
import Product from './product/Product';
import UserProfile from '../components/UserProfile';
import Chat from './pre-sale-talk/Chat';
// import useSocket from '../hooks/useSocket';
import { SocketProvider } from '../context/SocketContext';

const { Header, Sider, Content } = Layout;

const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const currentRouteKey = location.pathname.split('/')[2];

  // const [lastMessage, setLastMessage] = useState<string>();

  // WebSocket initialization
  // const { sendMessage } = useSocket({
  //   onMessage: (data: string) => {
  //     // 如果当前不是聊天界面，显示通知
  //     // if (currentRouteKey !== 'pre-sale-talk') {
  //     //   setLastMessage(data);
  //     // }
  //   },
  // });

  // 使用 useEffect 来触发通知，避免并发模式下的警告
  // useEffect(() => {
  //   if (lastMessage) {
  //     notification.info({
  //       message: '新消息',
  //       description: lastMessage,
  //       placement: 'topRight',
  //     });
  //   }
  // }, [lastMessage]);

  useEffect(() => {
    if (openKeys.length === 0) {
      if (currentRouteKey?.startsWith('crawler')) {
        setOpenKeys(['crawler']);
      } else if (currentRouteKey?.startsWith('conversation')) {
        setOpenKeys(['conversation']);
      } else if (currentRouteKey?.startsWith('system')) {
        setOpenKeys(['system']);
      }
    }
  }, [currentRouteKey]);

  const handleMenuClick = (e: any) => {
    navigate(`/home/${e.key}`);
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: '#f3f4f6' }}
      >
        <div
          className="logo flex justify-center items-center"
          style={{ height: 64, margin: '16px' }}
        >
          <img src="/vite.svg" alt="Logo" />
        </div>
        <Menu
          mode="inline"
          theme="light"
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          selectedKeys={[currentRouteKey]}
          onSelect={handleMenuClick}
          items={[
            {
              key: 'crawler',
              icon: <DatabaseOutlined />,
              label: '爬虫外围',
              children: [
                {
                  key: 'crawler-note-comment',
                  label: '原始数据',
                  icon: <UnorderedListOutlined />,
                },
                {
                  key: 'crawler-wlist-management',
                  label: '白名单管理',
                  icon: <SafetyOutlined />,
                },
                {
                  key: 'crawler-blist-management',
                  label: '黑名单管理',
                  icon: <TagsOutlined />,
                },
                {
                  key: 'crawler-black-rule',
                  label: '黑名单规则',
                  icon: <FilterOutlined />,
                },
                {
                  key: 'crawler-white-rule',
                  label: '白名单规则',
                  icon: <FilterOutlined />,
                },
              ],
            },
            {
              key: 'yunyingguanli',
              icon: <RadarChartOutlined />,
              label: '运营管理',
              children: [
                {
                  key: 'pre-sale-talk',
                  label: '售前咨询',
                  icon: <CustomerServiceOutlined />,
                },
              ],
            },
            {
              key: 'system',
              icon: <SettingOutlined />,
              label: '系统管理',
              children: [
                {
                  key: 'system-product',
                  label: '推销商品管理',
                  icon: <BarsOutlined />,
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 20,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <UserProfile />
        </Header>
        <SocketProvider>
          <Content
            style={{
              padding: 20,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route
                path="/"
                element={<Navigate to="crawler-note-comment" replace />}
              />
              <Route path="crawler-note-comment" element={<NoteComment />} />
              <Route path="crawler-filter" element={<FilterPage />} />
              <Route path="crawler-black-rule" element={<BlackRule />} />
              <Route path="crawler-white-rule" element={<WhiteRule />} />
              <Route path="conversation-order" element={<OrderPage />} />
              <Route path="system-product" element={<Product />} />
              <Route path="pre-sale-talk" element={<Chat />} />
              <Route
                path="crawler-wlist-management"
                element={<WhiteListManagement />}
              />
              <Route
                path="crawler-blist-management"
                element={<BlackListManagement />}
              />
            </Routes>
          </Content>
        </SocketProvider>
      </Layout>
    </Layout>
  );
};

export default Home;
