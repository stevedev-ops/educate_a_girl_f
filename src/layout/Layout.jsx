import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet, useLocation, Link } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const isDonatePage = location.pathname === '/donate';

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Sticky Mobile CTA */}
            {!isDonatePage && (
                <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
                    <Link
                        to="/donate"
                        className="flex items-center justify-center gap-2 w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-4 px-6 rounded-full shadow-2xl animate-bounce-subtle"
                    >
                        <span className="material-symbols-outlined">volunteer_activism</span>
                        Support Our Mission
                    </Link>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Layout;
