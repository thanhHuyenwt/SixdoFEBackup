import React, { useEffect, useState } from "react";
import { message, Button, Form, Space, Input, InputNumber, Select, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import SizeForm from "./SizeForm";
import adminApi from "../../../api/AdminApi";


function StockImageForm({ productId, form, setStep2Done, setNextDisable }) {
    const [colorData,setColorData] = useState([]);

    useEffect(() => {
        setStep2Done(false);
        setNextDisable(true);
    }, [])
    useEffect(()=>{
        getColorApi();
    },[])
    const getColorApi=  async()=>{
        try {
            const data = await adminApi.getColorData();
            setColorData(data);
        }
        catch(error) {alert("Xảy ra lỗi khi load data")}
    }
    const onFinish = (values) => {
        console.log('Received values of form:', values);
        values.stockAndColor.forEach((value)=>{
            const base64Array= value.images.map((file)=>{
                return file.base64
            })
            base64Array.forEach((base64,index)=>{
                const imageData = {productId:productId,colorId:value.colorId,ProductImgBase64:base64,imageOrder:index+1}
                console.log("image data send to server: ",imageData)
                newProductImagesApi(imageData);
            })
            
            value.size.forEach((attr)=>{
                const stockData = {productId:productId,colorId:value.colorId,sizeId:attr.SizeId,stock:attr.stock}
                console.log("stock data send to server: ",stockData)
                newProductAttrApi(stockData);
            })
        })
        setStep2Done(true);
        setNextDisable(false);
    };
    const newProductAttrApi=  async(data)=>{
        try {
            let result = await adminApi.addAttribute(data);
        }
        catch(error) {
            const result = error.response.data;
            if(result === -4 ) {alert("Sai thông tin size,color")}
            else {alert("Xảy ra lỗi, xin thử lại")}
        }
    }
    const newProductImagesApi=  (data)=>{
        try {
            const result =  adminApi.addImages(data);
        }
        catch(error) {
            const result = error.response.data;
            if(result === -4 ) {alert("Sai thông tin size,color/Thiếu thông tin hình ảnh")}
            else {alert("Xảy ra lỗi, xin thử lại")}
        }
    }
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return Upload.LIST_IGNORE;
        }
        return false;
    };
    const handleChange = (info) => {
        let fileList = [...info.fileList];

        fileList.forEach(function (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                file.base64 = e.target.result;
            };
            reader.readAsDataURL(file.originFileObj);
        });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.List name="stockAndColor">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space
                                direction="vertical"
                                key={key}
                                style={{
                                    display: 'flex',
                                    marginBottom: 8,
                                }}
                                align="baseline"
                            >
                                <Form.Item
                                    name={[name, "colorId"]}
                                    // key={[key, "colorKey"]}
                                    label="Chọn màu:"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing infor',
                                        },
                                    ]}
                                >
                                    <Select name="colorId" style={{
                                        width: 230,
                                    }} >
                                        {colorData.map((data) => {
                                            return (
                                                <Select.Option
                                                    key={data.colorId}
                                                    value={data.colorId}
                                                >
                                                    {data.colorDetail}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>

                                {/* Nested form for quantity each size */}
                                <Form.Item>
                                    <SizeForm fieldKey={name} />
                                </Form.Item>

                                {/* Nested form for image upload for each color */}
                                <Form.Item
                                    name={[name, "images"]}
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    extra="only accept JPG <2M"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing images',
                                        },
                                        {
                                            validator: (_, value) => {
                                              if (value.length == 2) {
                                                return Promise.resolve();
                                              } else {
                                                return Promise.reject(new Error('Need 2 images!'));
                                              }
                                            }
                                          }
                                    ]}
                                >
                                    {/* <ImageUpload fieldKey={name} /> */}
                                    <Upload
                                        
                                        listType="picture"
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        maxCount={2}
                                        accept="image/jpeg"
                                        multiple
                                    >
                                        <Button icon={<UploadOutlined />}>Upload (Max: 2)</Button>
                                    </Upload>
                                </Form.Item>

                                <Button onClick={() => remove(name)} >Remove color</Button>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add color
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>


            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default StockImageForm