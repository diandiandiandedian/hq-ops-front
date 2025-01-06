import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  FilterOutlined,
  TableOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
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
          <img src="/vite.svg" />
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
              icon: <AppstoreOutlined />,
              label: '爬虫外围',
              children: [
                {
                  key: 'crawler-note-comment',
                  label: '关键词',
                  icon: <SearchOutlined />,
                },
                {
                  key: 'crawler-wlist-management',
                  label: '白名单管理',
                  icon: <TableOutlined />,
                },
                {
                  key: 'crawler-blist-management',
                  label: '黑名单管理',
                  icon: <TableOutlined />,
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
            // {
            //   key: 'conversation',
            //   icon: <VideoCameraOutlined />,
            //   label: '对话外围',
            //   children: [
            //     {
            //       key: 'conversation-order',
            //       label: '售中订单表',
            //       icon: <SettingOutlined />,
            //     },
            //   ],
            // },
            {
              key: 'system',
              icon: <SettingOutlined />,
              label: '系统管理',
              children: [
                {
                  key: 'system-product',
                  label: '推销商品管理',
                  icon: <AppstoreOutlined />,
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
      </Layout>
    </Layout>
  );
};

export default Home;
