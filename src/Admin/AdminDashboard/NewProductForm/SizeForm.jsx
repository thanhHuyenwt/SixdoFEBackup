import React, { useState,useEffect } from "react";
import { message, Button, Form, Space, Input, InputNumber, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined,UploadOutlined } from '@ant-design/icons';
import adminApi from "../../../api/AdminApi";

function SizeForm({ fieldKey }) {
    const [sizeData,setSizeData] = useState([]);

    useEffect(()=>{
        getSizeApi();
    },[])
    const getSizeApi=  async()=>{
        try {
            const data = await adminApi.getSizeData();
            setSizeData(data);
        }
        catch(error) {alert("Xảy ra lỗi khi load data")}
    }
    return (
        <Form.List name={[fieldKey, "size"]}>
            {(sizes, { add, remove }) => (
                <>
                    {sizes.map((field, index) => (
                        <Space
                            key={index}
                            align="baseline"
                            style={{ display: "flex", marginBottom: 8 }}
                        >
                            <Form.Item
                                // {...field}
                                label="Size"
                                name={[field.name, 'SizeId']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing infor',
                                    },
                                ]}
                            >
                                <Select name="SizeId"
                                    // disabled={!form.getFieldValue('color')}
                                    style={{
                                        width: 130,
                                    }}
                                >
                                    {(sizeData).map((item) => (
                                        <Select.Option key={item.sizeId} value={item.sizeId}>
                                            {item.sizeDetail}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                // {...field}
                                label="Stock"
                                name={[field.name, 'stock']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing infor',
                                    },
                                ]}
                            >
                                <InputNumber min={0} />
                            </Form.Item>
                            
                            {/* hide if update product, update later when add product Attr status table */}
                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Space>
                    ))}

                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add sizes
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    )
}

export default SizeForm;