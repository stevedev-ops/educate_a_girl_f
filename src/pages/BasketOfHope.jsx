import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import DonationItemCard from '../components/DonationItemCard';
import SEO from '../components/SEO';

const BasketOfHope = () => {
    const { allProducts, isLoading } = useContent();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const donationItems = useMemo(() => {
        return allProducts
            .filter(product => product.itemType === 'donation')
            .map(item => ({
                ...item,
                // Flatten details for the card
                beneficiaries: item.details?.beneficiaries,
                duration: item.details?.duration,
                icon: item.details?.icon,
                // Use subCategory for display/filtering if available
                category: item.details?.subCategory || item.category,
                // Ensure image is a string for the card
                image: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : (typeof item.images === 'string' ? item.images : '')
            }));
    }, [allProducts]);

    const donationCategories = useMemo(() => {
        const cats = new Set(donationItems.map(i => i.category));
        return ['All', ...Array.from(cats)].sort();
    }, [donationItems]);

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'All') {
            return donationItems;
        }
        return donationItems.filter(item => item.category === selectedCategory);
    }, [selectedCategory, donationItems]);

    // Calculate stats
    const totalItemsAvailable = donationItems.length;
    const categoriesCount = donationCategories.length - 1; // Exclude "All"

    return (
        <div className="w-full">
            <SEO
                title="Basket of Hope - Sponsor Essential Items | EARG"
                description="Sponsor essential items like sanitary pads, school supplies, and uniforms that are donated directly to girls in need. Make a tangible difference today."
                keywords="donate, sponsor, sanitary pads, school supplies, education, girls empowerment, charity"
            />

            {/* Hero Section */}
            <section className="relative w-full bg-gradient-to-br from-primary to-primary-dark text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                            <span className="material-symbols-outlined text-yellow-300">stars</span>
                            <span className="text-sm font-bold">Direct Impact Donations</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
                            Basket of Hope
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                            Sponsor essential items that are donated directly to girls in need. You pay for the item, but instead of receiving it yourself, it goes straight to a girl who needs it most.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[140px]">
                                <p className="text-3xl font-bold mb-1">{totalItemsAvailable}+</p>
                                <p className="text-sm text-white/80">Items Available</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[140px]">
                                <p className="text-3xl font-bold mb-1">{categoriesCount}</p>
                                <p className="text-sm text-white/80">Categories</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[140px]">
                                <p className="text-3xl font-bold mb-1">100%</p>
                                <p className="text-sm text-white/80">Direct Impact</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-12 fill-current text-background-light dark:text-background-dark" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                    </svg>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="w-full py-16 bg-background-light dark:bg-background-dark">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                            Your sponsorship makes a direct, tangible impact on a girl's education and well-being.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-4xl text-primary">shopping_cart</span>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">1. Choose Items</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Browse essential items and select what you'd like to sponsor for girls in need.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6">
                            <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-4xl text-secondary">payments</span>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">2. Complete Payment</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Checkout securely. Your payment goes directly toward purchasing the items.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6">
                            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-4xl text-green-600">volunteer_activism</span>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">3. Items Delivered</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                We purchase and deliver the items directly to girls in our programs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Items Section */}
            <section className="w-full py-16 bg-white dark:bg-neutral-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                            Essential Items You Can Sponsor
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                            Every item makes a real difference in a girl's ability to attend school and thrive.
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {donationCategories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <DonationItemCard key={item.id} item={item} />
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-neutral-300 dark:text-neutral-600 mb-4">
                                inventory_2
                            </span>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                No items found in this category.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Impact Section */}
            <section className="w-full py-16 bg-neutral-50 dark:bg-neutral-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-white">
                        <div className="max-w-3xl mx-auto text-center">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-80">favorite</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Your Impact Matters
                            </h2>
                            <p className="text-lg text-white/90 mb-8">
                                When you sponsor an item through the Basket of Hope, you're not just giving a gift—you're removing barriers to education and empowering a girl to reach her full potential.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link
                                    to="/shop"
                                    className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-neutral-100 transition-colors shadow-md"
                                >
                                    Browse Shop
                                </Link>
                                <Link
                                    to="/donate"
                                    className="px-8 py-3 bg-white/10 backdrop-blur-md border-2 border-white text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    Make a Donation
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BasketOfHope;
