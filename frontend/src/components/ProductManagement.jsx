import React, { useState } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const ProductManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    return (
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
    );
};

export default ProductManagement; 