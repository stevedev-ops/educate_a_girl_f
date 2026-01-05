import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Donate from './pages/Donate';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Programs from './pages/Programs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary title="Application Error" message="The app encountered an unexpected error.">
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
    </ErrorBoundary>
  );
}

export default App;
