import React, { useState, useRef } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ProductManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const productListRef = useRef();

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleSave = () => {
        setShowForm(false);
        setEditingProduct(null);
        // Trigger product list refresh
        if (productListRef.current) {
            productListRef.current.fetchProducts();
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h1 style={{ margin: 0, fontSize: '24px' }}>Product Management</h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingProduct(null);
                            setShowForm(true);
                        }}
                    >
                        Add Product
                    </Button>
                </div>

                {showForm && (
                    <Card style={{ marginBottom: '16px' }}>
                        <ProductForm
                            product={editingProduct}
                            onSave={handleSave}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingProduct(null);
                            }}
                        />
                    </Card>
                )}

                <ProductList 
                    ref={productListRef}
                    onEdit={handleEdit}
                />
            </Card>
        </div>
    );
};

export default ProductManagement; 