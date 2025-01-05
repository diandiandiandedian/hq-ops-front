import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">后台管理系统</div>
      <div>欢迎回来</div>
    </div>
  );
};

export default Header;
