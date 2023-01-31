import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AccountInforProvider } from './Context/AccountContext'
import 'antd/dist/antd.css';
import './css/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AccountInforProvider>
      <App />
    </AccountInforProvider>
  </BrowserRouter>,
)
