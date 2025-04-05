import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockOverview = () => {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleSell = async (productId, quantity) => {
        try {
            await axios.post('http://localhost:5000/api/stock/sell', {
                product_id: productId,
                quantity: quantity
            });
            fetchStock();
        } catch (error) {
            console.error('Error recording sale:', error);
            setError('Failed to record sale');
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
                                        onClick={() => handleSell(item.id, 1)}
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
        </div>
    );
};

export default StockOverview; 