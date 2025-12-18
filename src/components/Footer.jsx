import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-4 md:px-10">
            <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-2xl">volunteer_activism</span>
                    <span className="font-bold text-xl text-primary">Educate a Rural Girl</span>
                </div>
                <div className="flex gap-6 flex-wrap justify-center">
                    <Link className="text-sm font-medium text-gray-500 hover:text-primary transition-colors" to="/privacy-policy">Privacy Policy</Link>
                    <Link className="text-sm font-medium text-gray-500 hover:text-primary transition-colors" to="/terms-of-service">Terms of Service</Link>
                    <Link className="text-sm font-medium text-gray-500 hover:text-primary transition-colors" to="/contact">Contact Us</Link>
                </div>
                <div className="flex gap-4">
                    <a className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white hover:bg-primary hover:text-white transition-colors" href="#">
                        <span className="material-symbols-outlined text-xl">public</span>
                    </a>
                    <a className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white hover:bg-primary hover:text-white transition-colors" href="#">
                        <span className="material-symbols-outlined text-xl">alternate_email</span>
                    </a>
                </div>
            </div>
            <div className="text-center mt-8 text-xs text-gray-500">
                © 2023 Educate a Rural Girl. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
