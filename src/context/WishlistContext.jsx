import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGuestId } from '../utils/identity';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [sessionId] = useState(() => {
        return getGuestId();
    });

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await fetch(`https://eduacate-a-girl-b-1.onrender.com/api/wishlist/${sessionId}`, { cache: 'no-store' });
            const data = await response.json();
            if (data.message === 'success') {
                setWishlistItems(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        }
    };

    const addToWishlist = async (product_id) => {
        try {
            const response = await fetch('https://eduacate-a-girl-b-1.onrender.com/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, product_id })
            });
            const data = await response.json();
            if (data.message === 'success') {
                await fetchWishlist();
                return true;
            }
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
            return false;
        }
    };

    const removeFromWishlist = async (id) => {
        try {
            const response = await fetch(`https://eduacate-a-girl-b-1.onrender.com/api/wishlist/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.message === 'success') {
                setWishlistItems(prev => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    const isInWishlist = (product_id) => {
        return wishlistItems.some(item => item.product_id === product_id);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            wishlistCount: wishlistItems.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
