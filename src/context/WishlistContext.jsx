import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGuestId } from '../utils/identity';
import { API_URL } from '../api';

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
            const response = await fetch(`${API_URL}/wishlist/${sessionId}`, { cache: 'no-store' });
            const data = await response.json();
            if (data.message === 'success') {
                const normalizedData = (data.data || []).map(item => {
                    if (typeof item.images === 'string') {
                        try { item.images = JSON.parse(item.images); }
                        catch (e) { item.images = []; }
                    }
                    if (!Array.isArray(item.images)) item.images = [];
                    item.price = parseFloat(item.price) || 0;
                    return item;
                });
                setWishlistItems(normalizedData);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        }
    };

    const addToWishlist = async (product_id) => {
        try {
            const response = await fetch(`${API_URL}/wishlist`, {
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
            const response = await fetch(`${API_URL}/wishlist/${id}`, {
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
