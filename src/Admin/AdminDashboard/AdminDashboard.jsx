import React from 'react';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Button, Layout, Menu } from 'antd';
import './Admin.css'

const { Header, Content, Sider } = Layout;

function AdminDashboard() {
    return (
        <>
            <Layout>
                <Header className="admin-header">
                    <h2>Admin Dashboard</h2>
                    <Button className='home-page-btn'><Link to="/">Home Page</Link></Button>
                </Header>
                <Layout>
                    <Sider width={180} className="site-layout-background">
                        <Menu
                            mode="inline"
                            style={{
                                height: '100%',
                                borderRight: 0,
                            }}
                            defaultSelectedKeys={['Product']}
                        >
                            <Menu.Item key="Product"><Link to="product" >Product</Link></Menu.Item>
                            <Menu.Item key="Account">Account</Menu.Item>
                            <Menu.Item key="Bill">Bill</Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout
                        style={{
                            padding: '0 24px 24px',
                        }}
                    >
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            <Outlet/>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
            
        </>
    )
}

export default AdminDashboard;