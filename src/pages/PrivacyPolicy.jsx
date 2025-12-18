import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <div className="layout-container py-12 md:py-20 max-w-[960px] mx-auto">
            <SEO
                title="Privacy Policy | EARG"
                description="Learn how Educate A Rural Girl (EARG) protects your personal information and respects your privacy."
            />
            <h1 className="text-4xl font-black text-text-main-light dark:text-white mb-8">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">1. Introduction</h2>
                    <p>
                        Educate a Rural Girl Organization ("EARG", "we", "our", or "us") is committed to protecting your privacy.
                        This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website
                        and donate to our cause.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">2. Integration of Information</h2>
                    <p className="mb-4">We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or modify your donation preferences.</li>
                        <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">3. Use of Your Information</h2>
                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Process your donations and issue tax receipts.</li>
                        <li>Send you information about our programs, success stories, and upcoming campaigns.</li>
                        <li>Respond to your comments, questions, and requests.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">4. Disclosure of Your Information</h2>
                    <p>
                        We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.
                        This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you,
                        so long as those parties agree to keep this information confidential.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">5. Security of Your Information</h2>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information.
                        While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts,
                        no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">6. Contact Us</h2>
                    <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                    <address className="not-italic mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <strong>Educate a Rural Girl Organization</strong><br />
                        Tharaka Nithi County, Kenya<br />
                        Email: info@educatearuralgirl.org<br />
                        Phone: +254 700 000 000
                    </address>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
