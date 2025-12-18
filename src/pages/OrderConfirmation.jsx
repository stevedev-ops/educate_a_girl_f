import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`https://eduacate-a-girl-b-1.onrender.com/api/orders/${orderId}`);
            const data = await response.json();
            if (data.message === 'success') {
                setOrder(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-white rounded-lg">
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h1>
                        <p className="text-gray-600 dark:text-gray-300">Your order has been successfully placed</p>
                    </div>

                    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                                <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                                <p className="font-bold text-gray-900 dark:text-white">{order.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                <p className="font-bold text-gray-900 dark:text-white">{order.customer_email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Order Items</h2>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span className="text-gray-900 dark:text-white">Total</span>
                            <span className="text-primary">${order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white"
                        >
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
