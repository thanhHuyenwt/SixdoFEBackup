import React,{useContext} from 'react';
import { Link } from 'react-router-dom';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { AccountContext } from '../../Context/AccountContext';

function AccountManage() {
  const {defaultAccount,currentAccount,setCurrentAccount} = useContext(AccountContext);
  const logOut = ()=>{
    setCurrentAccount(defaultAccount);
    localStorage.removeItem("access-token")
  }
  const items = [
    {
      key: '1',
      label: (
        <Link to="my-profile">Tài khoản của tôi</Link>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" >
          Đơn hàng của tôi
        </a>
        //change to Link later
      )
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={logOut}>
          Đăng xuất
        </a>
      )
    }
  ];
  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {currentAccount.accountUserName || "Username"}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </>
  )
};
export default AccountManage;