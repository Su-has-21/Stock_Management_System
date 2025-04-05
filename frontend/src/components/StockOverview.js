import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Input, Button, Modal, message, Table, Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, AppstoreOutlined } from '@ant-design/icons';

const StockOverview = () => {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sellModalVisible, setSellModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sellQuantity, setSellQuantity] = useState(1);
    const [sortOrder, setSortOrder] = useState('ascend');
    const [sortField, setSortField] = useState(null);

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        try {
            const response = await axios.get('/api/stock');
            setStock(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stock:', error);
            message.error('Failed to fetch stock data');
            setLoading(false);
        }
    };

    const handleSellClick = (product) => {
        setSelectedProduct(product);
        setSellQuantity(1);
        setSellModalVisible(true);
    };

    const handleSell = async () => {
        if (!selectedProduct || sellQuantity <= 0) {
            message.error('Invalid quantity');
            return;
        }

        if (sellQuantity > selectedProduct.available_stock) {
            message.error('Insufficient stock');
            return;
        }

        try {
            await axios.post('/api/stock/sell', {
                product_id: selectedProduct.id,
                quantity: sellQuantity
            });

            message.success('Sale recorded successfully');
            setSellModalVisible(false);
            fetchStock();
        } catch (error) {
            console.error('Error recording sale:', error);
            message.error(error.response?.data?.message || 'Failed to record sale');
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get('/api/stock/export', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stock_export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            message.error('Failed to export stock data');
        }
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
        },
        {
            title: 'Available Stock',
            dataIndex: 'available_stock',
            key: 'available_stock',
            sorter: true,
        },
        {
            title: 'Items Sold',
            dataIndex: 'items_sold',
            key: 'items_sold',
            sorter: true,
        },
        {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue',
            sorter: true,
            render: (value) => `Rs ${Number(value || 0).toFixed(2)}`
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handleSellClick(record)}
                    disabled={record.available_stock <= 0}
                >
                    Sell
                </Button>
            )
        }
    ];

    const totalRevenue = stock.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
    const totalItemsSold = stock.reduce((sum, item) => sum + (Number(item.items_sold) || 0), 0);

    const handleTableChange = (pagination, filters, sorter) => {
        setSortField(sorter.field);
        setSortOrder(sorter.order);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Products"
                            value={stock.length}
                            prefix={<AppstoreOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Items Sold"
                            value={totalItemsSold}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={totalRevenue}
                            precision={2}
                            prefix={<DollarOutlined />}
                            suffix="Rs"
                        />
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: '16px', marginBottom: '16px' }}>
                <Col>
                    <Button type="primary" onClick={handleExport} style={{ marginRight: '8px' }}>
                        Export CSV
                    </Button>
                    <Button type="default" onClick={() => message.info('Import functionality coming soon')}>
                        Import CSV
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={stock}
                rowKey="id"
                loading={loading}
                onChange={handleTableChange}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Sell Product"
                open={sellModalVisible}
                onOk={handleSell}
                onCancel={() => setSellModalVisible(false)}
                okText="Sell"
                cancelText="Cancel"
            >
                {selectedProduct && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <p style={{ fontWeight: 500 }}>Product: {selectedProduct.name}</p>
                            <p>Available Stock: {selectedProduct.available_stock}</p>
                            <p>Price: Rs {selectedProduct.price}</p>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Quantity</label>
                            <Input
                                type="number"
                                min={1}
                                max={selectedProduct.available_stock}
                                value={sellQuantity}
                                onChange={(e) => setSellQuantity(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <p style={{ fontWeight: 500 }}>
                                Total: Rs {(selectedProduct.price * sellQuantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StockOverview; 