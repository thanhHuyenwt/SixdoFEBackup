import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Alert } from 'antd'
import { AccountContext } from '../../../Context/AccountContext';


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
//start with letter + follow by 3-23 letter (lower/upper) or number and "-" or "_"

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
//at least 1 lower, 1 upper case letter, 1 digit, 1 special char, total 8 to 24 letters 

const PHONE_REGEX = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
//10 digit if has 0 first, else 9 digit total + VietName phone number rule

const layout = {
  wrapperCol: {
    span: 24,
  },
};


function SignUp({form,alert,signUpApi}) {

  const onFinish = (values) => {
    console.log('Received values of signup form: ',values);
    signUpApi(values);
  };
  
  return (
    <>
      {alert.show && <Alert message={alert.message} type={alert.type} showIcon />
      }
      <Form {...layout} form={form} name="register" onFinish={onFinish} size="large" validateTrigger='onBlur' >
        <Form.Item
          name="AccountEmail"
          style={{
            width: '100%',
            flexGrow: '1'
          }}
          rules={[
            {
              type: 'email',
              message: 'E-mail không hợp lệ!',
            },
            {
              required: true,
              message: 'Hãy nhập email!',
            },
          ]}
        >
          <Input
            style={{
              width: '100%',
            }}
            placeholder="Email của bạn"
            className='form-input'
          />
        </Form.Item>

        {/* <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: 'Hãy nhập số điện thoại của bạn!',
            },
            {
              validator: (_, value) => {
                if (PHONE_REGEX.test(value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(new Error('Sai định dạng số điện thoại'));
                }
              }
            }
          ]}
        >
          <Input
            className='form-input'
            style={{
              width: '100%',
            }}
            placeholder='Nhập số điện thoại của bạn'
          />
        </Form.Item> */}
        <Form.Item
          name="AccountUserName"
          rules={[
            {
              validator: (_, value) => {
                if(value){
                  if ( USER_REGEX.test(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error('Phải bắt đầu bằng chữ, không có ký tự đặc biệt,3-23 ký tự'));
                  }
                }
                else return Promise.reject(new Error('Hãy nhập tên bạn!'));
                
              }
            }
          ]}
        >
          <Input className='form-input' placeholder='Tên người dùng' />
        </Form.Item>
        <Form.Item
          name="AccountPassword"
          rules={[
            {
              validator: (_, value) => {
                if(value){
                  if (PWD_REGEX.test(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error('Ít nhất 1 chữ in hoa, 1 chữ in thường,1 chữ số, 1 ký tự đặc biệt, 8-24 ký tự'));
                  }
                }
                else return Promise.reject(new Error('Hãy nhập mật khẩu!'));
              }
            }
          ]}
          hasFeedback
        >
          <Input.Password className='form-input' placeholder='Mật khẩu' />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Nhập lại mật khẩu của bạn!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('AccountPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp!'));
              },
            }),
          ]}
        >
          <Input.Password className='form-input' placeholder='Nhập lại mật khẩu' />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol
          }}
        >
          <Button htmlType="submit" className='submit-btn'>
            ĐĂNG KÝ
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default SignUp;