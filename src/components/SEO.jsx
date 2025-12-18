import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'EARG - Educate a Rural Girl',
    description = 'Empowering rural girls through education, mentorship, and vocational training. Join us in transforming futures.',
    keywords = 'education, rural girls, empowerment, NGO, Kenya, charity, donate',
    ogImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhU7Qa5X8bQZAmozj6UOUyhfUtLh0QeRPPzX07Aohu3yhFZMHNT9_eikiL5-idRDYF3vNhzKyHkcbW9ZfEAdBMG81GzeRwgqZfIXkVc3avQvMPq-qTN0z9HHhlWSGXHpBkxe80Vd5YaYimu8V129mTLWFzOBBOowEWGYAkRwNX4LOrMdXlSt1JnLUmsqNPMGAnbu7zGecP1Pubw41J6TqErGnvGT7ZgqXQNvaMcbQhTTys-CzjT_TdiocTr8HkezE5aFvg21HpSt0',
    ogType = 'website',
    twitterCard = 'summary_large_image'
}) => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="EARG" />

            {/* Twitter */}
            <meta property="twitter:card" content={twitterCard} />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="author" content="EARG - Educate a Rural Girl" />
            <link rel="canonical" href={currentUrl} />
        </Helmet>
    );
};

export default SEO;
