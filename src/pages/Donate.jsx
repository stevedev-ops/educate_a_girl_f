import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePaystackPayment } from 'react-paystack';
import SEO from '../components/SEO';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const DonateContent = () => {
    const [amount, setAmount] = useState('50');
    const [customAmount, setCustomAmount] = useState('');
    const [frequency, setFrequency] = useState('once');
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [email, setEmail] = useState(''); // Need email for Paystack
    const [isProcessing, setIsProcessing] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    const finalAmountValue = parseFloat(customAmount || amount);

    // Paystack Config
    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: email || "donor@example.com", // Fallback if user doesn't enter email
        amount: Math.round(finalAmountValue * 100),
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_8dd8e02cb48f76059d04b5006422896627038e23',
    };

    const initializePaystack = usePaystackPayment(paystackConfig);

    const handleSuccess = () => {
        setIsProcessing(false);
        alert(`Thank you for your generous ${frequency} donation of $${finalAmountValue}!`);
    };

    const handleDonate = async () => {
        if (!finalAmountValue) {
            alert('Please select or enter a donation amount.');
            return;
        }

        setIsProcessing(true);

        if (paymentMethod === 'paystack') {
            const onClose = () => {
                setIsProcessing(false);
                alert("Donation cancelled.");
            };
            initializePaystack(handleSuccess, onClose);
        } else {
            // Stripe Flow
            if (!stripe || !elements) {
                setIsProcessing(false);
                return;
            }

            const cardElement = elements.getElement(CardElement);

            const { error, paymentMethod: stripeMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                alert(error.message);
                setIsProcessing(false);
            } else {
                console.log('[PaymentMethod]', stripeMethod);
                setTimeout(() => {
                    handleSuccess();
                }, 1000);
            }
        }
    };

    return (
        <div className="w-full">
            <SEO
                title="Donate - Support Rural Girls' Education | EARG"
                description="Your donation provides scholarships, books, and safe learning environments for girls in rural Kenya. Empower her future today."
                keywords="donate, support, charity, Kenya, education, girls empowerment, EARG, scholarships"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        {/* Hero content same as before */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-dark dark:text-secondary text-xs font-bold uppercase tracking-wider border border-secondary/20">
                                <span className="material-symbols-outlined text-sm">local_library</span>
                                Education Fund
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                                Empower Her Future.<br /><span className="text-primary">Change the World.</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                                Millions of girls in rural areas are denied their right to education. Your contribution funds scholarships, books, and safe learning environments for girls who need it most.
                            </p>
                        </div>
                        {/* ... images ... */}
                    </div>
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-24">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl shadow-green-900/10 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="flex border-b border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setFrequency('once')}
                                        className={`flex-1 py-4 text-center font-bold text-sm tracking-wide border-b-2 transition-all ${frequency === 'once'
                                            ? 'border-primary text-primary dark:text-white bg-primary/5 dark:bg-slate-800/50'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-secondary hover:bg-slate-50 dark:hover:bg-slate-800/20'
                                            }`}>
                                        Give Once
                                    </button>
                                    <button
                                        onClick={() => setFrequency('monthly')}
                                        className={`flex-1 py-4 text-center font-bold text-sm tracking-wide border-b-2 transition-all ${frequency === 'monthly'
                                            ? 'border-secondary text-secondary dark:text-white bg-secondary/5 dark:bg-slate-800/50'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-secondary hover:bg-slate-50 dark:hover:bg-slate-800/20'
                                            }`}>
                                        Monthly <span className={`text-xs font-normal px-1.5 py-0.5 rounded-full ml-1 ${frequency === 'monthly' ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary-dark'
                                            }`}>Impact x12</span>
                                    </button>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                            Select {frequency === 'monthly' ? 'Monthly' : ''} Amount
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['25', '50', '100'].map(val => (
                                                <label key={val} className="cursor-pointer">
                                                    <input
                                                        className="peer sr-only"
                                                        name="amount"
                                                        type="radio"
                                                        value={val}
                                                        checked={amount === val && !customAmount}
                                                        onChange={(e) => {
                                                            setAmount(e.target.value);
                                                            setCustomAmount('');
                                                        }}
                                                    />
                                                    <div className={`h-12 flex items-center justify-center rounded-lg border-2 bg-transparent font-bold transition-all peer-checked:bg-opacity-5 hover:bg-opacity-50 ${frequency === 'monthly'
                                                        ? 'peer-checked:border-secondary peer-checked:bg-secondary/5 peer-checked:text-secondary border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-secondary/50'
                                                        : 'peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary/50'
                                                        }`}>
                                                        ${val}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="mt-3 relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                            <input
                                                className={`w-full pl-7 pr-4 py-2.5 rounded-lg border-slate-200 dark:border-slate-600 bg-transparent focus:ring-1 dark:text-white placeholder:text-slate-400 text-sm font-medium transition-colors ${frequency === 'monthly' ? 'focus:border-secondary focus:ring-secondary' : 'focus:border-primary focus:ring-primary'
                                                    }`}
                                                placeholder="Other Amount"
                                                type="number"
                                                value={customAmount}
                                                onChange={(e) => {
                                                    setCustomAmount(e.target.value);
                                                    setAmount('');
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Payment Method</label>
                                        <div className="flex gap-4">
                                            <label className="flex-1 cursor-pointer">
                                                <input type="radio" name="paymethod" className="peer sr-only" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                                                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 peer-checked:border-primary peer-checked:bg-primary/5 text-center text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    Card
                                                </div>
                                            </label>
                                            <label className="flex-1 cursor-pointer">
                                                <input type="radio" name="paymethod" className="peer sr-only" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} />
                                                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 peer-checked:border-secondary peer-checked:bg-secondary/5 text-center text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    Paystack
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Email for receipt (required for Paystack) */}
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary outline-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    {paymentMethod === 'stripe' && (
                                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800">
                                            <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770' } } }} />
                                        </div>
                                    )}

                                    <button
                                        onClick={handleDonate}
                                        disabled={isProcessing || !stripe && paymentMethod === 'stripe'}
                                        className={`w-full text-white font-bold py-3.5 rounded-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group ${frequency === 'monthly' || paymentMethod === 'paystack'
                                            ? 'bg-secondary hover:bg-secondary-dark shadow-secondary/25'
                                            : 'bg-primary hover:bg-primary-dark shadow-primary/25'
                                            }`}>
                                        {isProcessing ? 'Processing...' : `Donate $${finalAmountValue} ${frequency === 'monthly' ? '/ mo' : ''}`}
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Donate = () => (
    <Elements stripe={stripePromise}>
        <DonateContent />
    </Elements>
);

export default Donate;
