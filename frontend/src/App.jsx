import React, { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import StockOverview from './components/StockOverview';
import SalesDashboard from './components/SalesDashboard';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('stock');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('stock')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        activeTab === 'stock'
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Stock Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        activeTab === 'dashboard'
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Sales Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        activeTab === 'products'
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Product Management
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {activeTab === 'stock' ? (
                    <StockOverview />
                ) : activeTab === 'dashboard' ? (
                    <SalesDashboard />
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold text-gray-900">Product Management</h1>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setShowForm(true);
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Add Product
                            </button>
                        </div>

                        {showForm && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <ProductForm
                                    product={editingProduct}
                                    onSave={() => {
                                        setShowForm(false);
                                        setEditingProduct(null);
                                    }}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditingProduct(null);
                                    }}
                                />
                            </div>
                        )}

                        <ProductList onEdit={handleEdit} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
