import { useState } from 'react';
import { Input, Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { login } from '../api/modules/auth';
import { useDispatch } from 'react-redux';
import { login as reduxLogin } from '../redux/modules/authSlice';
import { LoginProps } from '../redux/types';
import { useSelector } from 'react-redux'; // 引入 Provider
import { RootState } from '@/redux/store';
import { Navigate } from 'react-router-dom';
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    // 模拟登录逻辑
    login<LoginProps>({
      username: values.username,
      password: values.password,
    })
      .then((res) => {
        console.log(res);
        dispatch(reduxLogin(res));
        navigate('/home', { replace: true });
      })
      .catch((_) => {
        // message.error('Invalid credentials');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    // 如果已登录，跳转到 /home
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center items-center  w-full bg-gray-100 flex-1">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            HQ-OPS管理系统
          </h2>
          <Form onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
