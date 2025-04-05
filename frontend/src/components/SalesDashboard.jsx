import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Spin, Alert } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, StockOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';

const SalesDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/stock/dashboard');
            setDashboardData(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert message={error} type="error" />;
    }

    const summaryCards = [
        {
            title: 'Total Revenue',
            value: `$${dashboardData?.summary?.total_revenue?.toFixed(2) || 0}`,
            icon: <DollarOutlined />,
            color: '#52c41a'
        },
        {
            title: 'Total Items Sold',
            value: dashboardData?.summary?.total_items_sold || 0,
            icon: <ShoppingCartOutlined />,
            color: '#1890ff'
        },
        {
            title: 'Total Transactions',
            value: dashboardData?.summary?.total_transactions || 0,
            icon: <BarChartOutlined />,
            color: '#722ed1'
        },
        {
            title: 'Available Stock',
            value: dashboardData?.summary?.total_available_stock || 0,
            icon: <StockOutlined />,
            color: '#faad14'
        }
    ];

    const topProductsColumns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Items Sold',
            dataIndex: 'items_sold',
            key: 'items_sold',
        },
        {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (value) => `$${value.toFixed(2)}`
        }
    ];

    const recentSalesColumns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total Price',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (value) => `$${value.toFixed(2)}`
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => new Date(date).toLocaleString()
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[16, 16]}>
                {summaryCards.map((card, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                        <Card>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ 
                                    fontSize: '24px', 
                                    marginRight: '16px',
                                    color: card.color
                                }}>
                                    {card.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)' }}>
                                        {card.title}
                                    </div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                        {card.value}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} md={12}>
                    <Card title="Top Selling Products">
                        <Table
                            dataSource={dashboardData?.topProducts}
                            columns={topProductsColumns}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Recent Sales">
                        <Table
                            dataSource={dashboardData?.recentSales}
                            columns={recentSalesColumns}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SalesDashboard; 