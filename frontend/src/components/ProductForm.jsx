import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { Form, Input, InputNumber, Button, Card, message, Space } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ProductForm = ({ product, onSave, onCancel }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                name: product.name,
                category: product.category,
                price: product.price,
                quantity: product.quantity,
                description: product.description || ''
            });
        } else {
            form.resetFields();
        }
    }, [product, form]);
    
    useEffect(() => {
       
    }, [ ]);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (product) {
                await axiosInstance.put(`/api/products/${product.id}`, values);
                message.success('Product updated successfully');
            } else {
                await axiosInstance.post('/api/products', values);
                message.success('Product created successfully');
            }
            form.resetFields();
            onSave();
        } catch (error) {
            console.error('Error saving product:', error);
            message.error(error.response?.data?.message || 'An error occurred while saving the product');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card title={product ? 'Edit Product' : 'Add New Product'}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    name: '',
                    category: '',
                    price: '',
                    quantity: '',
                    description: ''
                }}
            >
                <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[
                        { required: true, message: 'Please enter the product name' },
                        { max: 100, message: 'Name cannot be longer than 100 characters' }
                    ]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[
                        { required: true, message: 'Please enter the category' },
                        { max: 50, message: 'Category cannot be longer than 50 characters' }
                    ]}
                >
                    <Input placeholder="Enter product category" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                        { required: true, message: 'Please enter the price' },
                        { type: 'number', min: 0, message: 'Price must be greater than or equal to 0' },
                        { type: 'number', max: 99999999.99, message: 'Price cannot exceed 99,999,999.99' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter price"
                        step="0.01"
                        prefix="Rs"
                    />
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[
                        { required: true, message: 'Please enter the quantity' },
                        { type: 'number', min: 0, message: 'Quantity must be greater than or equal to 0' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter quantity"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <TextArea
                        rows={4}
                        placeholder="Enter product description (optional)"
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmitting}
                            icon={<SaveOutlined />}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            onClick={onCancel}
                            icon={<CloseOutlined />}
                        >
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ProductForm; 