import { Space, Spin } from 'antd';

function Loading() {
    return (
        <>
            <Space align="center" size="middle">
                <Spin tip="Loading..." size="large" />
            </Space>
        </>
    )
}

export default Loading;