import { useContext, useState } from 'react'
import { Navigate, Routes, Route, useNavigate,Outlet } from 'react-router-dom'
import { AccountContext } from './Context/AccountContext'
import AdminDashboard from './Admin/AdminDashboard/AdminDashboard'

import ProductLayout from './Admin/AdminDashboard/ProductLayout';
import NewProduct from './Admin/AdminDashboard/NewProduct';
import Header from './Components/Header'
import Footer from './Components/Footer'
import {Body} from './Components/Body'
import SearchResult from './Components/SearchResult';
import AppItem from './Components/Items/AppItem';
import AccountProfile from './Components/Items/AccountProfile';

import './css/Admin.css'
import './App.css'
function BasicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  const userContext = useContext(AccountContext)
  const ProtectedRoute = ({ children }) => {
    if (!userContext.hasLogined) {
      return <Navigate to="/" replace />;
    }
    return children;
  };
  const AdminOnlyRoute = ({ children }) => {
    if (!userContext.isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };
  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={<BasicLayout />} >
          <Route path="/" element={<Body />}/>
          <Route path="search" element={<SearchResult/>}/>
          <Route path="product-item/:id" element={<AppItem />}></Route>
          <Route path="/my-profile/" element={<ProtectedRoute><AccountProfile /></ProtectedRoute> }></Route>
          {/* <Route index element={<AccountProfile />}/> */}
        </Route>
        <Route path="/admin/" element={<AdminOnlyRoute> <AdminDashboard /></AdminOnlyRoute> } >
            <Route path='product' element={<ProductLayout />} >
              <Route path='new' element={<NewProduct />} />
              {/* <Route path=':id' element={<ProductUpdate />} /> =>useParam to get id */}
            </Route>
        </Route>
        {/*
        <Route path="/account-bag/" element={<Bag />}></Route>
        <Route path="/my-order/" element={<MyOrder />}></Route>
        <Route path="/my-profile/" element={<AccountProfile />}></Route>
        <Route path="/create-order" element={<CreateOrder />}></Route>
        <Route path="/printf" element={<PrintBill />}></Route> */}
      </Routes>
      
    </div>
  )
}

export default App
