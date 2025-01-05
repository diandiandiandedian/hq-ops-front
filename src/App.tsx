import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Dashboard from './pages/Home';
import Login from './pages/Login';
import store from './redux/store'; // 引入 Redux store
import { RootState } from './redux/store';
import PrivateRoute from './pages/PrivateRoute';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider, useSelector } from 'react-redux'; // 引入 Provider
const App: React.FC = () => {
  const RootRedirect = () => {
    const isAuthenticated = useSelector(
      (state: RootState) => state.auth.isAuthenticated
    );
    // 根据登录状态决定重定向路径
    return isAuthenticated ? (
      <Navigate to="/home" replace />
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <Router>
          <Routes>
            {/* Redirect "/" to "/login" */}
            <Route path="/" element={<RootRedirect />} />

            {/* <Route path="/" element={<Navigate to="/login" />} /> */}
            {/* Login route */}
            <Route path="/login" element={<Login />} />
            {/* Home (Dashboard) route */}
            {/* <Route path="/:parent/*" element={<Dashboard />} /> */}
            <Route
              path="/home/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </Provider>
    </ConfigProvider>
  );
};

export default App;
