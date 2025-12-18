import React from 'react';
import SEO from '../components/SEO';

const TermsOfService = () => {
    return (
        <div className="layout-container py-12 md:py-20 max-w-[960px] mx-auto">
            <SEO
                title="Terms of Service | EARG"
                description="Read the terms and conditions for using the Educate A Rural Girl (EARG) website and donation services."
            />
            <h1 className="text-4xl font-black text-text-main-light dark:text-white mb-8">Terms of Service</h1>
            <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">1. Agreement to Terms</h2>
                    <p>
                        These Terms of Service constitute a legally binding agreement between you, whether personally or on behalf of an entity (“you”) and
                        Educate a Rural Girl Organization ("EARG", "we", "us", or "our"), concerning your access to and use of the website
                        as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">2. Intellectual Property Rights</h2>
                    <p>
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">3. User Representations</h2>
                    <p>By using the Site, you represent and warrant that:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>All registration information you submit will be true, accurate, current, and complete.</li>
                        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                        <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                        <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">4. Donations and Payments</h2>
                    <p>
                        We accept the following forms of payment: Credit Card, M-Pesa. You agree to provide current, complete, and accurate purchase and account information for all donations made via the Site.
                        All donations are final and non-refundable unless otherwise required by law or decided by EARG at our sole discretion.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">5. Prohibited Activities</h2>
                    <p>
                        You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">6. Modifications and Interruptions</h2>
                    <p>
                        We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice.
                        We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-primary mb-4">7. Contact Us</h2>
                    <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:</p>
                    <address className="not-italic mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <strong>Educate a Rural Girl Organization</strong><br />
                        Tharaka Nithi County, Kenya<br />
                        Email: info@educatearuralgirl.org
                    </address>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
