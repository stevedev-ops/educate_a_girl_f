import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import Pagination from '../components/Pagination';

const Shop = () => {
    const { allProducts, categories } = useContent();
    const { cartItems, addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    // Filter products
    const products = useMemo(() => {
        return allProducts;
    }, [allProducts]);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(product => {
            // 1. Category Filter
            const matchesCategory = filter === 'All' || product.category === filter;

            // 2. Search Filter (Name or Description)
            const query = searchQuery.toLowerCase();
            const matchesSearch = product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query);

            // 3. Price Range Filter
            const price = product.price;
            const min = minPrice !== '' ? parseFloat(minPrice) : 0;
            const max = maxPrice !== '' ? parseFloat(maxPrice) : Infinity;
            const matchesPrice = price >= min && price <= max;

            return matchesCategory && matchesSearch && matchesPrice;
        });
    }, [filter, searchQuery, minPrice, maxPrice, products]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, minPrice, maxPrice]);

    const handleClearFilters = () => {
        setFilter('All');
        setSearchQuery('');
        setMinPrice('');
        setMaxPrice('');
        setCurrentPage(1);
    };

    return (
        <div className="w-full">
            <SEO
                title="Shop for a Cause - Fair Trade Products | EARG"
                description="Shop 100% fair trade handmade products. All proceeds support education programs for rural girls in Kenya. Browse sustainable crafts, apparel, and jewelry."
                keywords="fair trade, shop, handmade, sustainable, crafts, jewelry, apparel, eco-friendly, donate"
            />
            <section className="relative">
                <div className="w-full flex flex-col gap-6 bg-cover bg-center bg-no-repeat min-h-[360px] items-center justify-center p-8"
                    style={{ backgroundImage: 'linear-gradient(rgba(20, 83, 45, 0.7) 0%, rgba(20, 83, 45, 0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8V2Y0FPs9AQ-wkvMriEOsh6jc1DXkcceSvB6Wz6g69DuoqeYJw7xON0WZHUeb6oNHo2eEdoYAVqDMx3iiPTQlL1bmoy9F5YVRZT0EFKcJsPo-tUcOh9B4Fp-oN1SBBOPJg_29FKD-ugLND0FouT-wDlv8zZP6ijpQod34V5qn23wcEFap1b_mXCPxQvwBx9bog4wCxMl1ve70i9aJCQFEOnZJeACnolaHTrxzbpalfOd8bcZBtqj7eVDz0GzaKWJ-HNd_15WdCA0")' }}>
                    <div className="flex flex-col gap-3 text-center max-w-[700px] animate-fade-in-up">
                        <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] drop-shadow-md">
                            Shop with Purpose
                        </h1>
                        <h2 className="text-gray-100 text-base md:text-lg font-normal leading-relaxed drop-shadow-sm max-w-[500px] mx-auto">
                            Every purchase supports our mission. 100% of proceeds go directly to the field.
                        </h2>
                    </div>
                </div>
            </section>
            <div className="flex-grow layout-container w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                    <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
                        {/* Search Section */}
                        <div>
                            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-border-light dark:border-border-dark mb-4 text-gray-900 dark:text-white">
                                Search
                            </h2>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                            </div>
                        </div>

                        {/* Price Range Section */}
                        <div>
                            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-border-light dark:border-border-dark mb-4 text-gray-900 dark:text-white">
                                Price Range
                            </h2>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="space-y-1 flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Min</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full pl-6 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <span className="text-gray-400 mt-5">-</span>
                                <div className="space-y-1 flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Max</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full pl-6 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories Section */}
                        <div>
                            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-border-light dark:border-border-dark mb-4 text-gray-900 dark:text-white">
                                Categories
                            </h2>
                            <ul className="space-y-3">
                                {['All', ...categories].map(cat => (
                                    <li key={cat}>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={filter === cat}
                                                onChange={() => setFilter(cat)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary dark:bg-background-dark dark:border-gray-600"
                                            />
                                            <span className={`text-sm font-medium transition-colors ${filter === cat ? 'text-primary' : 'text-gray-700 dark:text-gray-300'} group-hover:text-primary`}>
                                                {cat === 'All' ? 'All Products' : cat}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={handleClearFilters}
                            className="w-full py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">filter_alt_off</span>
                            Reset Filters
                        </button>
                    </aside>
                    <main className="flex-1 flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <p className="text-sm text-gray-500 font-medium">
                                Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                                <p className="text-gray-500 max-w-sm">Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedProducts.map(product => (
                                        <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border-light dark:border-border-dark bg-white dark:bg-gray-800">
                                            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                {/* Handle JSON parsed images vs potential array issues, though API ensures array */}
                                                <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-[0.8] group-hover:saturate-100" src={product.images && product.images[0]} alt={product.name} loading="lazy" />
                                                {product.stock <= 0 && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <span className="text-white font-black text-2xl tracking-wider">OUT OF STOCK</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-text-main-light dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px] text-primary">volunteer_activism</span>
                                                        Fair Trade
                                                    </span>
                                                    {product.stock <= 0 && (
                                                        <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>
                                                {product.stock > 0 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const cartItem = cartItems.find(item => item.id === product.id);
                                                            const quantityInCart = cartItem ? cartItem.quantity : 0;
                                                            if (quantityInCart >= product.stock) {
                                                                toast.error('Stock limit reached for this item in your cart.');
                                                                return;
                                                            }
                                                            addToCart(product);
                                                        }}
                                                        className="absolute bottom-4 right-4 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110">
                                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col gap-2 flex-grow">
                                                <h3 className="text-base font-bold text-text-main-light dark:text-white line-clamp-1">{product.name}</h3>
                                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark line-clamp-1 text-gray-500">{product.impact}</p>
                                                {product.stock > 0 && product.stock <= 5 && (
                                                    <span className="text-xs font-bold text-orange-600">⚠️ Only {product.stock} left!</span>
                                                )}
                                                {product.stock > 5 && product.stock <= 20 && (
                                                    <span className="text-xs text-green-600">✓ In Stock</span>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const inWishlist = wishlistItems.some(item => item.product_id === product.id);
                                                        if (inWishlist) {
                                                            const wishlistItem = wishlistItems.find(item => item.product_id === product.id);
                                                            removeFromWishlist(wishlistItem.id);
                                                            toast.success('Removed from wishlist');
                                                        } else {
                                                            addToWishlist(product.id);
                                                            toast.success('Added to wishlist!');
                                                        }
                                                    }}
                                                    className="absolute bottom-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition-transform"
                                                >
                                                    <span className={`material-symbols-outlined ${wishlistItems.some(item => item.product_id === product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}>
                                                        favorite
                                                    </span>
                                                </button>
                                                <div className="flex items-center justify-between mt-auto pt-2">
                                                    <div className="flex flex-col">
                                                        {product.offerPrice ? (
                                                            <>
                                                                <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
                                                                <span className="text-lg font-bold text-red-600">${product.offerPrice.toFixed(2)}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-lg font-bold text-secondary">${product.price.toFixed(2)}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={`material-symbols-outlined text-[16px] fill-current ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}`}>star</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredProducts.length}
                                    onItemsPerPageChange={(newSize) => {
                                        setItemsPerPage(newSize);
                                        setCurrentPage(1);
                                    }}
                                    pageSizeOptions={[12, 24, 48]}
                                />
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
