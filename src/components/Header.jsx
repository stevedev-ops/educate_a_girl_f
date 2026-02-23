import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useContent } from '../context/ContentContext';

const Header = () => {
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { programs } = useContent();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState(null);

    const toggleMobileDropdown = (name) => {
        setMobileDropdown(mobileDropdown === name ? null : name);
    };

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
                        {/* About Dropdown */}
                        <div className="relative group">
                            <Link to="/about" className={`${linkClass('/about')} flex items-center gap-1`}>
                                About
                                <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">expand_more</span>
                            </Link>
                            <div className="absolute top-full left-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden p-2">
                                    {[
                                        { label: 'Our Story', id: 'our-story', icon: 'auto_stories' },
                                        { label: 'Vision & Mission', id: 'vision-mission', icon: 'visibility' },
                                        { label: 'Core Values', id: 'core-values', icon: 'diamond' },
                                        { label: 'Our Approach', id: 'our-approach', icon: 'handshake' },
                                        { label: 'Our Journey', id: 'our-journey', icon: 'timeline' },
                                        { label: 'Our Impact', id: 'our-impact', icon: 'trending_up' },
                                        { label: 'Meet The Team', id: 'meet-team', icon: 'groups' }
                                    ].map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={`/about#${item.id}`}
                                            className="block px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors flex items-center"
                                        >
                                            <span className="material-symbols-outlined text-lg mr-3 opacity-70">{item.icon}</span>
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Programs Dropdown */}
                        <div className="relative group">
                            <Link to="/programs" className={`${linkClass('/programs')} flex items-center gap-1`}>
                                Programs
                                <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">expand_more</span>
                            </Link>
                            <div className="absolute top-full left-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden p-2">
                                    {programs.length > 0 ? (
                                        programs.map(program => (
                                            <a
                                                key={program.id}
                                                href={`/programs#${program.id}`}
                                                className="block px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                                            >
                                                {program.dropdown_title || program.title}
                                            </a>
                                        ))
                                    ) : (
                                        <span className="block px-4 py-3 text-sm text-slate-400 italic">No programs available</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Link to="/gallery" className={linkClass('/gallery')}>Gallery</Link>
                        <Link to="/blog" className={linkClass('/blog')}>Blog</Link>
                        <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                        <Link to="/shop" className={linkClass('/shop')}>Shop</Link>
                        <Link to="/basket-of-hope" className={linkClass('/basket-of-hope')}>Basket of Hope</Link>
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
                        <Link to="/about" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white flex justify-between items-center" onClick={(e) => { e.preventDefault(); toggleMobileDropdown('about'); }}>
                            About
                            <span className={`material-symbols-outlined transition-transform duration-300 ${mobileDropdown === 'about' ? 'rotate-180' : ''}`}>expand_more</span>
                        </Link>
                        <div className={`overflow-hidden transition-all duration-300 ${mobileDropdown === 'about' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-6 space-y-2 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg py-2">
                                <Link onClick={() => setIsMenuOpen(false)} to="/about" className="block p-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary">Overview</Link>
                                {[
                                    'Our Story', 'Vision & Mission', 'Core Values', 'Our Approach', 'Our Journey', 'Our Impact', 'Meet The Team'
                                ].map((item, idx) => {
                                    const id = item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                                    return (
                                        <a key={idx} onClick={() => setIsMenuOpen(false)} href={`/about#${id}`} className="block p-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary">
                                            {item}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        <Link to="/programs" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white flex justify-between items-center" onClick={(e) => { e.preventDefault(); toggleMobileDropdown('programs'); }}>
                            Programs
                            <span className={`material-symbols-outlined transition-transform duration-300 ${mobileDropdown === 'programs' ? 'rotate-180' : ''}`}>expand_more</span>
                        </Link>
                        <div className={`overflow-hidden transition-all duration-300 ${mobileDropdown === 'programs' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-6 space-y-2 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg py-2">
                                <Link onClick={() => setIsMenuOpen(false)} to="/programs" className="block p-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary">All Programs</Link>
                                {programs.map(program => (
                                    <a
                                        key={program.id}
                                        onClick={() => setIsMenuOpen(false)}
                                        href={`/programs#${program.id}`}
                                        className="block p-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary"
                                    >
                                        {program.dropdown_title || program.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <Link onClick={() => setIsMenuOpen(false)} to="/gallery" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">Gallery</Link>
                        <Link onClick={() => setIsMenuOpen(false)} to="/blog" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">Blog</Link>
                        <Link onClick={() => setIsMenuOpen(false)} to="/shop" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">Shop</Link>
                        <Link onClick={() => setIsMenuOpen(false)} to="/basket-of-hope" className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white">Basket of Hope</Link>
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
