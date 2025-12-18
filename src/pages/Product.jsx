import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProductReviews, submitReview } from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Product = () => {
    const { id } = useParams();
    const { addToCart, cartItems } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ user_name: '', user_email: '', rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const cartItem = cartItems.find(item => item.id === parseInt(id));
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    const isLimitReached = product && (quantityInCart >= product.stock);

    const handleAddToCart = () => {
        if (isLimitReached) {
            toast.error('You have reached the stock limit for this item in your cart.');
            return;
        }
        addToCart(product, quantity);
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchProductById(id),
            fetchProductReviews(id)
        ]).then(([productData, reviewsData]) => {
            setProduct(productData);
            setReviews(reviewsData);
            setLoading(false);
        });
    }, [id]);

    // Update quantity selector max
    const handleQuantityChange = (val) => {
        const newQty = parseInt(val) || 1;
        if (product && (quantityInCart + newQty > product.stock)) {
            toast.error(`Only ${product.stock - quantityInCart} more items can be added.`);
            setQuantity(Math.max(1, product.stock - quantityInCart));
            return;
        }
        setQuantity(newQty);
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!product) return <div className="text-center py-20 text-xl font-bold">Product not found</div>;

    // ... return JSX changes ...
    // Note: I will need to replace the specific quantity buttons/input and add-to-cart button
    // The previous replace_file_content call needs to be more specific or use multi_replace.
    // I'll use multi_replace for accuracy.


    const handleWishlistClick = async () => {
        if (isInWishlist(product.id)) {
            const item = wishlistItems.find(item => item.product_id === product.id);
            if (item) {
                await removeFromWishlist(item.id);
                toast.success('Removed from wishlist');
            }
        } else {
            const success = await addToWishlist(product.id);
            if (success) toast.success('Added to wishlist');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewForm.user_name || !reviewForm.comment) {
            toast.error('Please fill in name and comment');
            return;
        }
        setSubmittingReview(true);
        try {
            await submitReview({ ...reviewForm, product_id: id });
            toast.success('Review submitted! It will appear after admin approval.');
            setReviewForm({ user_name: '', user_email: '', rating: 5, comment: '' });
        } catch (err) {
            toast.error('Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : product.rating;

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO
                title={`${product.name} - ${product.category} | EARG Shop`}
                description={product.description.substring(0, 160)}
                keywords={`${product.name}, ${product.category}, fair trade, charity shop, EARG`}
            />
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link to="/shop" className="hover:text-primary hover:underline">Shop</Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <Link to="/shop" className="hover:text-primary hover:underline">{product.category}</Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">{product.name}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
                <div className="flex flex-col gap-4">
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 relative group">
                        <div className="absolute top-4 left-4 z-10 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            Fair Trade
                        </div>
                        <img
                            alt={`${product.name} - Main view`}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            src={product.images[activeImage]}
                            loading="eager"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`aspect-square overflow-hidden rounded-lg border-2 ${activeImage === idx ? 'border-primary ring-offset-2' : 'border-transparent'} hover:border-slate-300 transition-colors`}>
                                <img alt={`View ${idx + 1}`} className="h-full w-full rounded-md object-cover" src={img} />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Artisan Collection</span>
                            <div className="flex items-center gap-1 text-amber-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`material-symbols-outlined text-[18px] fill-current ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}`}>star</span>
                                ))}
                                <span className="ml-1 text-slate-500 dark:text-slate-400">({product.reviews} reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                            {product.name}
                        </h1>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="mb-8 rounded-xl bg-secondary/10 border border-secondary/20 p-4 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
                            <span className="material-symbols-outlined">volunteer_activism</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Impact Purchase</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{product.impact}</p>
                        </div>
                    </div>
                    <p className="mb-8 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                        {product.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-slate-200 dark:border-slate-700 pb-10">
                        <div className="flex h-12 w-32 items-center rounded-lg border border-slate-300 dark:border-slate-600 bg-surface-light dark:bg-surface-dark bg-white dark:bg-gray-800">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                                className="flex h-full w-10 items-center justify-center text-slate-600 hover:text-primary dark:text-slate-400 disabled:opacity-30">
                                <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <input
                                className="h-full w-full border-none bg-transparent text-center font-medium text-slate-900 dark:text-white focus:ring-0"
                                type="number"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(e.target.value)}
                            />
                            <button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={product && (quantityInCart + quantity >= product.stock)}
                                className="flex h-full w-10 items-center justify-center text-slate-600 hover:text-primary dark:text-slate-400 disabled:opacity-30">
                                <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={isLimitReached}
                            className={`flex-1 h-12 ${isLimitReached ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'} text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg ${!isLimitReached && 'shadow-primary/20'}`}>
                            <span className="material-symbols-outlined">{isLimitReached ? 'block' : 'shopping_cart'}</span>
                            {isLimitReached ? 'Stock Limit Reached' : 'Add to Cart'}
                        </button>
                        <button
                            onClick={handleWishlistClick}
                            className={`h-12 w-12 flex items-center justify-center rounded-lg border-2 transition-all ${isInWishlist(product.id)
                                ? 'border-red-500 bg-red-50 text-red-500'
                                : 'border-slate-300 text-slate-400 hover:border-red-400 hover:text-red-400'
                                }`}
                            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <span className={`material-symbols-outlined ${isInWishlist(product.id) ? 'fill-current' : ''}`}>
                                favorite
                            </span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <details className="group rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 open:ring-1 open:ring-primary/20 bg-white dark:bg-gray-800">
                            <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium text-slate-900 dark:text-white group-open:text-primary transition-colors">
                                <span>Product Details</span>
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="border-t border-slate-100 dark:border-slate-700 p-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Material: {product.material}</li>
                                    <li>Dimensions: {product.dimensions}</li>
                                    <li>Origin: {product.origin}</li>
                                    {product.details && product.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        </details>

                        {product.story && (
                            <details className="group rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800">
                                <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium text-slate-900 dark:text-white hover:text-primary transition-colors">
                                    <span>The Artisan Story</span>
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                                </summary>
                                <div className="border-t border-slate-100 dark:border-slate-700 p-4">
                                    <div className="flex gap-4 items-start">
                                        <img
                                            alt={`Featured Artisan: ${product.story.author}`}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                            src={product.story.image}
                                            loading="lazy"
                                        />
                                        <div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                                {product.story.text}
                                            </p>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">– {product.story.author}</p>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Customer Reviews</h2>

                {/* Review Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name *</label>
                                <input
                                    type="text"
                                    value={reviewForm.user_name}
                                    onChange={(e) => setReviewForm({ ...reviewForm, user_name: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-neutral-900 dark:text-white dark:border-slate-600"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email (optional)</label>
                                <input
                                    type="email"
                                    value={reviewForm.user_email}
                                    onChange={(e) => setReviewForm({ ...reviewForm, user_email: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-neutral-900 dark:text-white dark:border-slate-600"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating *</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        className="text-2xl transition-colors"
                                    >
                                        <span className={`material-symbols-outlined ${star <= reviewForm.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}>star</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Review *</label>
                            <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-neutral-900 dark:text-white dark:border-slate-600"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={submittingReview}
                            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark disabled:bg-gray-400 transition-colors"
                        >
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>

                {/* Reviews Display */}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">No reviews yet. Be the first to review this product!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{review.user_name}</h4>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`material-symbols-outlined text-[16px] fill-current ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}>star</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Product;
