
import React, { useState, useContext, useEffect } from 'react';
import { Tabs,Form } from 'antd';
import SignUp from './SignUp';
import Login from './Login';
import authApi from '../../../api/auth';
import { AccountContext } from '../../../Context/AccountContext';
import './Login.css'

function SignupLogin({ setOpenDrawer }) {
  const { setCurrentAccount } = useContext(AccountContext);
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm()
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: ""
  });
  const loginApi = async (data) => {
    try {
      const result = await authApi.login(data);
      setAlert({ show: true, message: "Đăng nhập thành công", type: "success" });
      localStorage.setItem("access-token", result.accessToken)
      setCurrentAccount({
        accountId: result.accountID,
        accountUserName: result.accountUserName,
        accountRoleId: result.roleId
      })
      setTimeout(()=>{
        loginForm.resetFields();
        setOpenDrawer(false);
      },1500)
      
    }
    catch (error) {
      const result = error.response.data;
      if (result === 0) setAlert({ show: true, message: "Username hoặc email sai", type: "error" });
      else if (result === -4) setAlert({ show: true, message: "Sai password", type: "error" });
      else setAlert({ show: true, message: "Xảy ra lỗi, xin thử lại", type: "error" });
    }
  }
  const signUpApi = async (data) => {
    try {
      await authApi.signup(data);
      //for test, will remove at final
      setAlert({ show: true, message: "Đăng ký thành công", type: "success" });
      
      //login auto 
      const loginData = {AccountUserName: data.AccountUserName,AccountPassword:data.AccountPassword}
      loginApi(loginData);
      //reset field
      //signupForm.resetFields();
    }
    catch (error) {
      console.log(error)
      const result = error.response.data;
      if (result === -1) setAlert({ show: true, message: "Username đã bị sử dụng", type: "error" });
      else if (result === -2) setAlert({ show: true, message: "Email đã bị sử dụng", type: "error" });
      else if (result === -3) setAlert({ show: true, message: "Không được để trống thông tin", type: "warning" });
      else setAlert({ show: true, message: "Xảy ra lỗi, xin thử lại", type: "error" });
    }
  }
  useEffect(()=>{
    loginForm.resetFields();
    signupForm.resetFields();
    setAlert((pre)=>{
      return {
        ...pre,
        show:false
      }
      


    })
  },[])
  return (
    <>
      <Tabs
        defaultActiveKey='1'
        items={[
          {
            label: 'ĐĂNG KÝ',
            key: '1',
            children: <SignUp form={signupForm} alert={alert} signUpApi={signUpApi} />,

          },
          {
            label: "ĐĂNG NHẬP",
            key: '2',
            children: <Login form={loginForm} alert={alert} loginApi={loginApi} />,
          },
        ]}
      >
      </Tabs>
    </>
  )
}

export default SignupLogin;