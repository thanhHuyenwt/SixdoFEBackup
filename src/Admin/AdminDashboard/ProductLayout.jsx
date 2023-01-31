import React, { useState } from "react";
import { Button, Modal } from "antd";
import { Link, Outlet } from "react-router-dom";
function ProductLayout() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditting,setIsEditing] = useState(false); //use to update product infor
    const showNewProductModal = () => {
        setIsEditing(false);
        setModalOpen(true);
    };
    
    const handleCancel = () => {
        setModalOpen(false);
    };
    return (
        <>
            <div>
                <Button onClick={showNewProductModal} size="large"><Link to="/admin/product/new" >New Product</Link></Button>
            </div>
            <Modal
                centered
                title={isEditting?"Update Product":"New Product"}
                open={isModalOpen}
                //afterClose to change status of isEditing, isViewing
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>
                ]}
            >
                <Outlet  />
            </Modal>
            <div>
                Product list with link to each product,search bar and table display name, stock, update date,...
            </div>
        </>
    )
}

export default ProductLayout;