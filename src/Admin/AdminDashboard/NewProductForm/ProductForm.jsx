import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";
const { Option } = Select;
const { TextArea } = Input;

import adminApi from "../../../api/AdminApi";



const fieldData = {
    BrandId:2,
    CategoryTypeId:1,
    Cost:465465447,
    CurrentPrice:12314,
    OriginPrice:23423425,
    ProducerId:1,
    ProductCode:"ew45ye",
    ProductName:"blue dress"
}
const RequiredRule = {
    required: true,
    message: 'Missing infor',
};
function ProductForm({ form, setStep1Done, setNextDisable, setProductId }) {
    const [categoryData,setCategoryData] = useState([]);
    const [brandData,setBrandData] = useState([]);
    const [producerData,setProducerData] = useState([]);
    useEffect(() => {
        setNextDisable(true);
    }, [])
    useEffect(() => {
        getCategoryApi();
        getBrandApi();
        getProducerApi();
    }, [])
    const getCategoryApi=  async()=>{
        try {
            const data = await adminApi.getCategoryTypeData();
            console.log("category:",data)
            setCategoryData(data);
        }
        catch(error) {alert("Xảy ra lỗi khi load data")}
    }
    const getBrandApi=  async()=>{
        try {
            const data = await adminApi.getBrandData();
            setBrandData(data);
        }
        catch(error) {alert("Xảy ra lỗi khi load data")}
    }
    const getProducerApi=  async()=>{
        try {
            const data = await adminApi.getProducerData();
            setProducerData(data);
        }
        catch(error) {alert("Xảy ra lỗi khi load data")}
    }
    //use for update product later
    // useEffect(() => {
    //     form.setFieldsValue(fieldData)
    // })
    
    const onFinish = (values) => {
        console.log("Values from form: ",values);
        newProductApi(values)
    };

    const newProductApi = async(data)=>{
        try {
            const result = await adminApi.addProduct(data);
            setProductId(result);
            setStep1Done(true);
            setNextDisable(false);
        }
        catch(error) {
            const result = error.response.data;
            if(result === -4 ) {alert("Sai thông tin")}
            else if (result === -8) {alert("Mã sản phẩm bị trùng")}
            else {alert("Xảy ra lỗi, xin thử lại")}
        }
    }
    
    return (
        <Form
            form={form}
            layout="horizontal"
            onFinish={onFinish}
        >
            <Form.Item
                name="ProductName"
                label="Tên sản phẩm"
                rules={[RequiredRule]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="ProductCode"
                label="Mã sản phẩm"
                rules={[RequiredRule]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="CategoryTypeId" label="Loại sản phẩm" rules={[RequiredRule]}>
                <Select name="CategoryTypeId"  >
                    {categoryData.map((data) => {
                        return (
                            <Select.Option
                                key={data.categoryTypeId}
                                value={data.categoryTypeId}
                            >
                                {data.categoryTypeCode}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="BrandId" label="Thương hiệu" rules={[RequiredRule]}>
                <Select name="BrandId"  >
                    {brandData.map((data) => {
                        return (
                            <Select.Option
                                key={data.brandId}
                                value={data.brandId}
                            >
                                {data.brandDetail}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="ProducerId" label="Nơi sản xuất" rules={[RequiredRule]}>
                <Select name="ProducerId"  >
                    {producerData.map((data) => {
                        return (
                            <Select.Option
                                key={data.producerId}
                                value={data.producerId}
                            >
                                {data.producerDetail}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="Cost" label="Giá nhập" rules={[RequiredRule]}>
                <InputNumber
                    controls={false}
                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    className="price"
                />
            </Form.Item>
            <Form.Item name="OriginPrice" label="Giá bán ban đầu" >
                <InputNumber
                    controls={false}
                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    className="price"
                />
            </Form.Item>
            <Form.Item name="CurrentPrice" label="Giá bán hiện tại" rules={[RequiredRule]}>
                <InputNumber
                    controls={false}
                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    className="price"
                />
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Tạo sản phẩm
                </Button>
            </Form.Item>
        </Form>
    )
}

export default ProductForm