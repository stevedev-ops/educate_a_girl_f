import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const DonationItemCard = ({ item }) => {
    const { addToCart, cartItems } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleSponsor = () => {
        // Add to cart with special donation flag
        addToCart({ ...item, itemType: 'donation' }, quantity);
        toast.success(`Thank you for sponsoring ${quantity} ${item.name}!`, {
            icon: '💚',
            duration: 3000
        });
        setQuantity(1);
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <div className="group flex flex-col bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                        Donation
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className="bg-white/95 dark:bg-black/80 backdrop-blur-sm text-neutral-700 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        {item.category}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col gap-3 flex-grow">
                <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-2xl text-primary mt-0.5">{item.icon}</span>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white line-clamp-2">
                            {item.name}
                        </h3>
                    </div>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3 flex-grow">
                    {item.description}
                </p>

                {/* Impact Badge */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">eco</span>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-wide mb-1">
                                Impact
                            </p>
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                {item.impact}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Beneficiaries Info */}
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">person</span>
                        {item.beneficiaries}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {item.duration}
                    </span>
                </div>

                {/* Price and Quantity */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Sponsor for</span>
                        <span className="text-2xl font-bold text-primary-dark dark:text-green-400">
                            ${item.price.toFixed(2)}
                        </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1">
                        <button
                            onClick={decrementQuantity}
                            className="h-8 w-8 flex items-center justify-center rounded-md bg-white dark:bg-neutral-600 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-500 transition-colors disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            <span className="material-symbols-outlined text-lg">remove</span>
                        </button>
                        <span className="w-8 text-center font-bold text-neutral-900 dark:text-white">
                            {quantity}
                        </span>
                        <button
                            onClick={incrementQuantity}
                            className="h-8 w-8 flex items-center justify-center rounded-md bg-white dark:bg-neutral-600 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-500 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                        </button>
                    </div>
                </div>

                {/* Sponsor Button */}
                <button
                    onClick={handleSponsor}
                    className="w-full mt-2 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                >
                    <span className="material-symbols-outlined">favorite</span>
                    Sponsor This Item
                </button>
            </div>
        </div>
    );
};

export default DonationItemCard;
