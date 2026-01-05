import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Code splitting - lazy load route components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Donate = lazy(() => import('./pages/Donate'));
const Shop = lazy(() => import('./pages/Shop'));
const Product = lazy(() => import('./pages/Product'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Programs = lazy(() => import('./pages/Programs'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Admin = lazy(() => import('./pages/Admin'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const NotFound = lazy(() => import('./pages/NotFound'));


// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p className="text-neutral-600 dark:text-neutral-400 font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary title="Application Error" message="The app encountered an unexpected error.">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin Route - Standalone with own error boundary */}
          <Route path="/admin" element={
            <ErrorBoundary title="Admin Panel Error" message="The admin panel encountered an error.">
              <Admin />
            </ErrorBoundary>
          } />

          {/* Public Routes - With Header/Footer Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="programs" element={<Programs />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="donate" element={<Donate />} />

            {/* Shop routes with error boundary */}
            <Route path="shop" element={
              <ErrorBoundary title="Shop Error" message="We couldn't load the shop.">
                <Shop />
              </ErrorBoundary>
            } />
            <Route path="product/:id" element={
              <ErrorBoundary title="Product Error" message="We couldn't load this product.">
                <Product />
              </ErrorBoundary>
            } />

            <Route path="wishlist" element={<Wishlist />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Checkout Routes - Standalone */}
          <Route path="/checkout" element={
            <ErrorBoundary title="Checkout Error" message="There was an issue with checkout.">
              <Checkout />
            </ErrorBoundary>
          } />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
