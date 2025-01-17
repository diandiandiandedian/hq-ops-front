import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Avatar } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from '../redux/modules/authSlice';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 使用 Hook 形式的 navigate
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [user, setUser] = useState(userInfo);

  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  const handleLogout = () => {
    dispatch(logout()); // 触发 Redux 的 logout 方法
    navigate('/login', { replace: true }); // 跳转到登录页
  };

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="d-flex justify-content-end align-items-center">
      {user ? (
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <div className="flex items-center" style={{ cursor: 'pointer' }}>
            {/* <Avatar src={user.profilePictureUrl} size={30} /> */}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">
                {user.username.charAt(0)}
              </span>
            </div>
            <span className="ms-2">{user.username}</span>
          </div>
        </Dropdown>
      ) : (
        <div>请登录</div>
      )}
    </div>
  );
};

export default UserProfile;
