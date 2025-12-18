import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound = () => {
    const popularPages = [
        { name: 'Home', path: '/', icon: 'home' },
        { name: 'Shop', path: '/shop', icon: 'shopping_bag' },
        { name: 'About Us', path: '/about', icon: 'info' },
        { name: 'Programs', path: '/programs', icon: 'school' },
        { name: 'Contact', path: '/contact', icon: 'mail' },
    ];

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <SEO
                title="Page Not Found | EARG"
                description="The page you're looking for doesn't exist. Explore our programs, shop, or get in touch with EARG."
            />

            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                {/* 404 Animation/Illustration */}
                <div className="mb-8 relative">
                    <div className="text-[180px] md:text-[220px] font-black text-primary/10 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-8xl md:text-9xl animate-bounce">
                            sentiment_dissatisfied
                        </span>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                    Oops! Page Not Found
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                    The page you're looking for seems to have wandered off. But don't worry—there are plenty of ways to continue your journey with us!
                </p>

                {/* Search or Main CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <Link
                        to="/"
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform active:scale-95"
                    >
                        <span className="material-symbols-outlined">home</span>
                        Go to Homepage
                    </Link>
                    <Link
                        to="/donate"
                        className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform active:scale-95"
                    >
                        <span className="material-symbols-outlined">volunteer_activism</span>
                        Make a Donation
                    </Link>
                </div>

                {/* Popular Pages */}
                <div className="mt-16">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        Or explore these popular pages:
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {popularPages.map(page => (
                            <Link
                                key={page.path}
                                to={page.path}
                                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all hover:shadow-md group"
                            >
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">{page.icon}</span>
                                </div>
                                <span className="font-bold text-sm text-slate-900 dark:text-white">
                                    {page.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-12 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                        <span className="font-bold">Need help?</span> If you believe this is an error, please{' '}
                        <Link to="/contact" className="underline hover:text-primary">
                            contact us
                        </Link>{' '}
                        and we'll assist you right away.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
