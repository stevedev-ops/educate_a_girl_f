import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;
    const linkClass = (path) => `text-sm font-bold transition-colors ${isActive(path) ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none text-slate-900 dark:text-white">EARG</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">Educate a Rural Girl</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8 bg-slate-50 dark:bg-slate-800/50 px-6 py-2.5 rounded-full border border-slate-100 dark:border-slate-700">
                        <Link to="/" className={linkClass('/')}>Home</Link>
                        <Link to="/about" className={linkClass('/about')}>About</Link>
                        <Link to="/programs" className={linkClass('/programs')}>Programs</Link>
                        <Link to="/gallery" className={linkClass('/gallery')}>Gallery</Link>
                        <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                        <Link to="/shop" className={linkClass('/shop')}>Shop</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/wishlist" className="group relative p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-2xl">favorite</span>
                            {wishlistCount > 0 && (
                                <span className="absolute top-0 right-0 size-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/checkout" className="group relative p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 size-5 bg-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 transform scale-100 transition-transform group-hover:scale-110">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/donate" className="hidden md:flex bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5">
                            <span>Donate</span>
                            <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-2xl">{isMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 absolute w-full left-0 shadow-xl">
                    <nav className="flex flex-col p-4 space-y-2">
                        <Link onClick={() => setIsMenuOpen(false)} to="/" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">Home</Link>
                        <Link onClick={() => setIsMenuOpen(false)} to="/about" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">About</Link>
                        <Link onClick={() => setIsMenuOpen(false)} to="/programs" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">Programs</Link>
                        <Link onClick={() => setIsMenuOpen(false)} to="/gallery" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">Gallery</Link>
                        <Link onClick={() => setIsMenuOpen(false)} to="/shop" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">Shop</Link>
                        <Link onClick={() => setIsMenuOpen(false)} to="/contact" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">Contact</Link>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                        <Link onClick={() => setIsMenuOpen(false)} to="/donate" className="p-3 text-center rounded-lg bg-primary text-white font-bold">Donate Now</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
