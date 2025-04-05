import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Modal, message } from 'antd';

const StockOverview = () => {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sellModalVisible, setSellModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sellQuantity, setSellQuantity] = useState(1);

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stock');
            setStock(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stock:', error);
            setError('Failed to fetch stock data');
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
            const response = await axios.post('http://localhost:5000/api/stock/sell', {
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

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    const totalRevenue = stock.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
    const totalItemsSold = stock.reduce((sum, item) => sum + (Number(item.items_sold) || 0), 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
                    <p className="mt-2 text-3xl font-semibold text-indigo-600">{stock.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Total Items Sold</h3>
                    <p className="mt-2 text-3xl font-semibold text-indigo-600">{totalItemsSold}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
                    <p className="mt-2 text-3xl font-semibold text-indigo-600">Rs {totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stock.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.available_stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.items_sold}</td>
                                <td className="px-6 py-4 whitespace-nowrap">Rs {Number(item.revenue || 0).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleSellClick(item)}
                                        disabled={item.available_stock <= 0}
                                        className={`px-3 py-1 text-sm rounded ${
                                            item.available_stock <= 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        Sell
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title="Sell Product"
                visible={sellModalVisible}
                onOk={handleSell}
                onCancel={() => setSellModalVisible(false)}
                okText="Sell"
                cancelText="Cancel"
            >
                {selectedProduct && (
                    <div className="space-y-4">
                        <div>
                            <p className="font-medium">Product: {selectedProduct.name}</p>
                            <p>Available Stock: {selectedProduct.available_stock}</p>
                            <p>Price: Rs {selectedProduct.price}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <Input
                                type="number"
                                min={1}
                                max={selectedProduct.available_stock}
                                value={sellQuantity}
                                onChange={(e) => setSellQuantity(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <p className="font-medium">
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