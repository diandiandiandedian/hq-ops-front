// src/components/Menu.tsx
import { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchMenu } from '../api/modules/auth'; // 导入封装的 API 请求

const { Sider } = Layout;

interface MenuItem {
  title: string;
  key: string;
  children?: MenuItem[];
}

const MenuComponent = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const navigate = useNavigate();

  // 获取菜单数据
  useEffect(() => {
    const getMenu = async () => {
      try {
        const response = await fetchMenu(); // 调用封装的 API 请求
        setMenuData(response.data); // 设置菜单数据
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    getMenu();
  }, []);

  // 点击菜单项时跳转
  const handleMenuClick = (e: any) => {
    navigate(`/${e.key}`);
  };

  // 渲染菜单项
  const renderMenuItems = (menuItems: MenuItem[]) => {
    return menuItems.map((item) => (
      <Menu.SubMenu key={item.key} title={item.title}>
        {item.children ? (
          renderMenuItems(item.children) // 渲染子菜单
        ) : (
          <Menu.Item key={item.key}>{item.title}</Menu.Item>
        )}
      </Menu.SubMenu>
    ));
  };

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['crawler']}
        style={{ height: '100%', borderRight: 0 }}
        onClick={handleMenuClick}
      >
        {renderMenuItems(menuData)}
      </Menu>
    </Sider>
  );
};

export default MenuComponent;
