import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input,Alert } from 'antd';
const Login = ({form,alert,loginApi}) => {
  const onFinish = (values) => {
    console.log('Received values of login form: ', values);
    loginApi(values);
  };
  return (
    <>
      {alert.show && <Alert message={alert.message} type={alert.type} showIcon />
      }
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        size="large"
        // initialValues={{
        //   remember: true,
        // }}
        onFinish={onFinish}
      >
        <Form.Item
          name="AccountUserName"
          rules={[
            {
              required: true,
              message: 'Hãy nhập tên hoặc email của bạn!',
            },
          ]}
        >
          <Input
            className='form-input'
            style={{
              width: '100%',
            }}
            // prefix={<UserOutlined 
            // className="site-form-item-icon" />} 
            placeholder="Tên người dùng hoặc email"
          />
        </Form.Item>
        <Form.Item
          name="AccountPassword"
          rules={[
            {
              required: true,
              message: 'Hãy nhập mật khẩu!!',
            },
          ]}
        >
          <Input.Password
            // prefix={<LockOutlined className="site-form-item-icon" />}
            
            placeholder="Mật khẩu"
            className="form-input"
          />
        </Form.Item>
        <Form.Item>
          <a className="login-form-forgot" href="">
            Quên Mật khẩu?
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-btn">
            ĐĂNG NHẬP
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default Login;