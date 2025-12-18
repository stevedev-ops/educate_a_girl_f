import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePaystackPayment } from 'react-paystack';
import { checkout, createOrder } from '../api';
import { useContent } from '../context/ContentContext';

// Initialize Stripe with env variable or placeholder
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutContent = () => {
    const { cartItems, cartTotal, clearCart, removeFromCart, updateQuantity } = useCart();
    const { allProducts } = useContent();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' or 'paystack'
    const [email, setEmail] = useState('');

    // Helper to get current stock for a cart item
    const getCurrentStock = (itemId) => {
        const currentProduct = allProducts?.find(p => p.id === itemId);
        return currentProduct?.stock ?? 0;
    };

    // Check if any cart items are out of stock
    const hasOutOfStockItems = cartItems.some(item => getCurrentStock(item.id) <= 0);

    const stripe = useStripe();
    const elements = useElements();

    // Paystack Config
    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: email || "user@example.com",
        amount: Math.round(cartTotal * 100), // Amount in kobo/cents
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_8dd8e02cb48f76059d04b5006422896627038e23', // Placeholder or Env
    };

    const initializePaystack = usePaystackPayment(paystackConfig);

    const handleSuccess = async () => {
        try {
            // Call backend to decrement stock
            const items = cartItems.map(item => ({ id: item.id, quantity: item.quantity }));
            await checkout(items);

            // Create order record
            const orderData = {
                email,
                name: `Customer`, // You can add name fields to checkout form
                items: cartItems,
                total: cartTotal,
                payment_method: paymentMethod
            };
            const orderResult = await createOrder(orderData);

            clearCart();
            setIsProcessing(false);
            navigate(`/order-confirmation/${orderResult.orderId}`);
        } catch (error) {
            setIsProcessing(false);
            alert(error.message || "Stock validation failed. Please refresh and try again.");
        }
    };

    const handlePayment = async () => {
        setIsProcessing(true);

        if (paymentMethod === 'paystack') {
            const onClose = () => {
                setIsProcessing(false);
                alert("Payment cancelled.");
            };
            initializePaystack(handleSuccess, onClose);
        } else {
            // Stripe Flow
            if (!stripe || !elements) {
                // Stripe.js has not loaded yet. Make sure to disable
                // form submission until Stripe.js has loaded.
                setIsProcessing(false);
                return;
            }

            const cardElement = elements.getElement(CardElement);

            // In a real app, you would create a PaymentIntent on the server here
            // and confirm it. For this client-only demo, we'll create a token/method
            // to verify interaction.
            const { error, paymentMethod: stripeMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                console.error('[error]', error);
                alert(error.message);
                setIsProcessing(false);
            } else {
                console.log('[PaymentMethod]', stripeMethod);
                // Simulate server confirmation delay
                setTimeout(() => {
                    handleSuccess();
                }, 1000);
            }
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark text-center p-4">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart_off</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
                <Link to="/shop" className="text-primary hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased selection:bg-primary/30">
            <div className="w-full lg:w-[58%] xl:w-[60%] flex flex-col border-r border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark order-2 lg:order-1">
                <header className="px-6 py-6 lg:px-12 lg:pt-8 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="size-8 text-primary">
                            <span className="material-symbols-outlined text-3xl">school</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-primary-dark dark:text-primary">
                            Educate a Rural Girl</h2>
                    </Link>
                </header>
                <div className="px-6 lg:px-12 py-2">
                    <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
                        <Link className="text-primary hover:text-primary-dark transition-colors" to="/shop">Cart</Link>
                        <span className="text-slate-400 material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-bold">Payment</span>
                    </nav>
                </div>
                <div className="flex-1 px-6 lg:px-12 py-6 max-w-2xl mx-auto lg:mx-0 w-full">
                    <section className="mb-10">
                        <div className="flex justify-between items-baseline mb-4">
                            <h2 className="text-xl font-bold tracking-tight">Contact Information</h2>
                        </div>
                        <div className="grid gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Email address</span>
                                <input
                                    className="w-full h-12 px-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow placeholder:text-slate-400"
                                    placeholder="user@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                        </div>
                    </section>
                    <section className="mb-10">
                        <h2 className="text-xl font-bold tracking-tight mb-4">Shipping Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">First name</span>
                                <input className="w-full h-12 px-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow" type="text" />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Last name</span>
                                <input className="w-full h-12 px-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow" type="text" />
                            </label>
                            <label className="block md:col-span-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Address</span>
                                <input className="w-full h-12 px-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow" placeholder="123 Ocean Drive" type="text" />
                            </label>
                        </div>
                    </section>
                    <section className="mb-10">
                        <h2 className="text-xl font-bold tracking-tight mb-4">Payment Method</h2>
                        <p className="text-sm text-slate-500 mb-4">Select your preferred payment gateway.</p>
                        <div className="border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
                            <div className="p-4 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
                                <div className="flex flex-col gap-4">
                                    <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                checked={paymentMethod === 'stripe'}
                                                onChange={() => setPaymentMethod('stripe')}
                                                className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                                                type="radio"
                                                name="payment"
                                            />
                                            <span className="font-bold text-slate-900 dark:text-white">Credit Card (Stripe)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="material-symbols-outlined text-slate-400">credit_card</span>
                                        </div>
                                    </label>

                                    {paymentMethod === 'stripe' && (
                                        <div className="pl-8 pr-4 py-2">
                                            <div className="p-4 border border-border-light dark:border-border-dark rounded bg-white dark:bg-background-dark">
                                                <CardElement options={{
                                                    style: {
                                                        base: {
                                                            fontSize: '16px',
                                                            color: '#424770',
                                                            '::placeholder': {
                                                                color: '#aab7c4',
                                                            },
                                                        },
                                                        invalid: {
                                                            color: '#9e2146',
                                                        },
                                                    },
                                                }} />
                                            </div>
                                        </div>
                                    )}

                                    <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'paystack' ? 'border-secondary bg-secondary/5' : 'border-border-light dark:border-border-dark'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                checked={paymentMethod === 'paystack'}
                                                onChange={() => setPaymentMethod('paystack')}
                                                className="w-5 h-5 text-secondary border-gray-300 focus:ring-secondary"
                                                type="radio"
                                                name="payment"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white">Paystack</span>
                                                <span className="text-xs text-slate-500">Fast and secure payments</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-secondary text-lg">P</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 mt-8">
                        <Link className="flex items-center gap-1 text-primary font-medium hover:underline" to="/shop">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Return to cart
                        </Link>
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing || (!stripe && paymentMethod === 'stripe') || hasOutOfStockItems}
                            className={`w-full md:w-auto px-8 py-3 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 ${hasOutOfStockItems ? 'bg-gray-400 cursor-not-allowed' :
                                paymentMethod === 'paystack' ? 'bg-secondary hover:bg-secondary-dark shadow-secondary/20' : 'bg-primary hover:bg-primary-dark shadow-primary/20'
                                }`}>
                            {hasOutOfStockItems ? 'Remove Out of Stock Items' : isProcessing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-[42%] xl:w-[40%] bg-surface-light dark:bg-surface-dark border-l border-border-light dark:border-border-dark order-1 lg:order-2">
                <div className="sticky top-0 h-full max-h-screen overflow-y-auto sidebar-scroll p-6 lg:p-12 bg-slate-50 dark:bg-surface-dark/50 lg:bg-transparent">
                    {/* Cart Summary Content (Same as before) */}
                    <div className="space-y-6">
                        {cartItems.map(item => {
                            const currentStock = getCurrentStock(item.id);
                            const isOutOfStock = currentStock <= 0;
                            return (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="relative size-16 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark overflow-hidden">
                                        <img alt={item.name} className="w-full h-full object-cover" src={item.images[0]} />
                                        <span className="absolute -top-2 -right-2 size-5 rounded-full bg-slate-500 text-white text-xs font-bold flex items-center justify-center">{item.quantity}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.category}</p>
                                        {isOutOfStock && (
                                            <p className="text-xs font-bold text-red-600 mt-1">⚠️ OUT OF STOCK</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                                                disabled={isOutOfStock || getCurrentStock(item.id) <= item.quantity}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="font-bold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium flex items-center gap-1"
                                            title="Remove from cart"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="border-t border-border-light dark:border-border-dark my-6 pt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                            <span className="font-bold text-slate-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Shipping</span>
                            <span className="text-sm font-medium text-slate-500">Free</span>
                        </div>
                    </div>
                    {hasOutOfStockItems && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
                            <p className="text-sm font-bold text-red-800 dark:text-red-200">⚠️ Some items in your cart are now out of stock. Please remove them before checkout.</p>
                        </div>
                    )}
                    <div className="border-t border-border-light dark:border-border-dark pt-6">
                        <div className="flex justify-between items-baseline">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs text-slate-400">USD</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Checkout = () => (
    <Elements stripe={stripePromise}>
        <CheckoutContent />
    </Elements>
);

export default Checkout;
