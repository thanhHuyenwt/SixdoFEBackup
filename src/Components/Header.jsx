import "../css/Header.css"
import { React, useRef,useState , useEffect,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import {SearchOutlined,ShoppingCartOutlined  } from "@ant-design/icons"
import { Button, Drawer } from 'antd';
import SignupLogin from "./HomePage/Login/SignupLogin";
import { AccountContext } from "../Context/AccountContext";
import AccountManage from "./HomePage/AccountManage";
import logo from "../resour/logo.png"

function Header() {
  
  return (
    <div className="header">
      <div className="app-header">
        <HeaderLeft />
        <HeaderRight />
      </div>
    </div>
  );
}

function HeaderLeft() {

  return (
    <>
      <div className="app-header-left float-left">
        <a href={"/"}>
          <img className="shop-logo" id="logo-header" src={logo} alt="logo" /></a>
      </div>
    </>
  );
}
function HeaderRight() {
  const {isAdmin,hasLogined,currentAccount,setCurrentAccount} = useContext(AccountContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };
  const searchContent = useRef(undefined)
  return (
    <>
      <div className="app-header-right float-left">
        <div className="web-option">
          <div className="header-webOpt">
            <div className="header-goForm loGin-after hoverCommon">
              {hasLogined?<AccountManage ></AccountManage>:<button className='login-btn' onClick={showDrawer}>
                  LOG IN
              </button>}
            </div>
            <div className="header-goForm afterRight-1px header-fb">
              <span>.NET-ReactJS-Antd</span>
            </div>
            {isAdmin && <Link to="/admin" >Admin Dashboard</Link>}
          </div>
        </div>
        <div className="navigator-header">
          <div className="input-search">
            <input 
              ref={searchContent} 
              placeholder="Bạn đang tìm gì?" 
              name="name" 
              className="question" 
              id="nme" 
              required 
            />
          </div>
          <a href="/">
            <SearchOutlined 
              onClick={(e) => {
                e.preventDefault();
                const search = searchContent.current.value.trim();
                if(search.length > 0){
                  navigate({
                    pathname: "/search",
                    search: `?q=${search}`,
                  })
                }
                
              }} 
              className="search-icon" />
          </a>
          <a href="/account-bag">
            <ShoppingCartOutlined 
              onClick={()=>{localStorage.removeItem('page')}} 
              className="bag-home" 
            />
          </a>
          <div className="total-bag">
            <span>{localStorage.getItem('totalbag')}</span>
          </div>
        </div>
      </div>
      <div className="drawer-container">
        <Drawer title="TÀI KHOẢN" placement="right" onClose={onClose} open={openDrawer}>
          <SignupLogin setOpenDrawer={setOpenDrawer} />
        </Drawer>
      </div>
      
    </>
  );
}

export default Header;
