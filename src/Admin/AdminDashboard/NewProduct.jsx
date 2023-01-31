import React, { useState } from "react";
import { Steps, message, Button, Form ,Popconfirm } from "antd";
import ProductForm from "./NewProductForm/ProductForm";
import StockImageForm from "./NewProductForm/StockImageForm";




function NewProduct() {
   //for updating product, receive IsEditing =true from outletcontext => useParam to get id 

    const [productId, setProductId] = useState();
    const [step1Done, setStep1Done] = useState(false);
    const [step2Done, setStep2Done] = useState(false);
    const [nextDisable, setNextDisable] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [needConfirmCondition, setNeedConfirmCondition] = useState(false);
    const [current, setCurrent] = useState(0);

    
    const [productForm] = Form.useForm();
    const [stockForm] = Form.useForm()
    const confirm = () => {
        setOpenConfirm(false);
        clearData();
        message.success('Clear data.');
    };
    const cancel = () => {
        setOpenConfirm(false);
        message.error('Cancel clear.');
    };
    const handleOpenChange = (newOpen) => {
        if (!newOpen) {
            setOpenConfirm(newOpen);
            return;
        }
        if (needConfirmCondition) {
            setOpenConfirm(true);
          } else {
            confirm(); // next step
          }
    };
    const next = () => {
        setCurrent(current + 1);
    };
    const clearData = () => {
        productForm.resetFields();
        stockForm.resetFields();
        setCurrent(0);
        setStep1Done(false);
        setStep2Done(false);
    }
    const handleClearBtn = () => {
        if (step1Done == true && step2Done == false) {
            setNeedConfirmCondition(true);
        }
        else {
            clearData();
        }

    };
    const handleDone = () => {
        message.success('Process complete!')
        clearData();

    }
    const steps = [
        {
            title: 'Product data',
            content: <ProductForm form={productForm} setStep1Done={setStep1Done} setNextDisable={setNextDisable} setProductId={setProductId} />,
        },
        {
            title: 'Stock and Image data',
            content: <StockImageForm form={stockForm} setStep2Done={setStep2Done} setNextDisable={setNextDisable} productId={productId}/>,
        }
    ];
    const items = steps.map((item, index) => ({
        key: index,
        title: item.title,
    }));
    return (
        <div>
            <Steps current={current} items={items} />
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
                {current < steps.length - 1 && (
                    <Button disabled={nextDisable} type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button disabled={nextDisable} type="primary" onClick={handleDone}>
                        Done
                    </Button>
                )}
                <Popconfirm
                    title="Clear data"
                    description="Product not done yet, are you sure to clear?"
                    open={openConfirm}
                    onOpenChange={handleOpenChange}
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" className="clear-form-btn" onClick={() => handleClearBtn()}>Clear</Button>
                </Popconfirm>
            </div>

        </div>
    )
}

export default NewProduct;