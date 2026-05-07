import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'Educate A Rural Girl Organization | EARG | Tharaka Nithi, Kenya',
    description = 'Educate A Rural Girl Organization (EARG) is a community-based NGO in Tharaka Nithi County, Kenya, dedicated to empowering women and girls through education, agriculture, and advocacy.',
    keywords = 'Educate A Rural Girl, Educate A Rural Girl Organization, EARG, EARG NGO, E.A.R.G, Rural Girl NGO, Educate A Rural Girl Kenya, Tharaka Nithi NGO, women empowerment Kenya, girl child education Kenya, rural girl empowerment, Tharaka Nithi women groups, SRHR awareness Kenya, climate action Tharaka Nithi, agribusiness for women Kenya, gender equality advocacy Kenya, rural development NGO Africa',
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
            <meta name="author" content="Educate A Rural Girl Organization" />
            <link rel="canonical" href={currentUrl} />
        </Helmet>
    );
};

export default SEO;
