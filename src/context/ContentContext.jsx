import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    fetchProducts, createProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct,
    fetchGallery, addToGallery as apiAddToGallery, deleteFromGallery as apiDeleteFromGallery,
    fetchStories, createStory, updateStory as apiUpdateStory, deleteStory as apiDeleteStory,
    fetchTeam, createTeamMember, updateTeamMember as apiUpdateTeamMember, deleteTeamMember as apiDeleteTeamMember,
    fetchJourney, createJourney, updateJourneyMilestone as apiUpdateJourneyMilestone, deleteJourney as apiDeleteJourney,
    fetchHomeProductIds, updateHomeProductIds,
    fetchCategories, updateCategories as apiUpdateCategories,
    fetchPrograms, createProgram, updateProgram as apiUpdateProgram, deleteProgram as apiDeleteProgram,
    fetchSettings, updateSettings as apiUpdateSettings,
    fetchMessages, sendMessage, updateMessageRead as apiUpdateMessageRead, deleteMessage as apiDeleteMessage,
    fetchPendingReviews, approveReview as apiApproveReview, deleteReview as apiDeleteReview
} from '../api';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    // State
    const [allProducts, setAllProducts] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [stories, setStories] = useState([]);
    const [team, setTeam] = useState([]);
    const [journey, setJourney] = useState([]);
    const [homeProductIds, setHomeProductIds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);

    // Settings State
    const [settings, setSettings] = useState({
        contact_info: null,
        impact_stats: null,
        home_hero: null,
        about_hero: null
    });

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            try {
                // Parallel fetch for speed
                const [p, g, s, t, j, h, c, progs, msg, rev, contact, stats, hHero, aHero] = await Promise.all([
                    fetchProducts(), fetchGallery(), fetchStories(), fetchTeam(), fetchJourney(),
                    fetchHomeProductIds(), fetchCategories(), fetchPrograms(), fetchMessages(), fetchPendingReviews(),
                    fetchSettings('contact_info'), fetchSettings('impact_stats'), fetchSettings('home_hero'), fetchSettings('about_hero')
                ]);

                setAllProducts(p || []);
                setGallery(g || []);
                setStories(s || []);
                setTeam(t || []);
                setJourney(j || []);
                setHomeProductIds(h || []);
                setCategories(c || []);
                setPrograms(progs || []);
                setMessages(msg || []);
                setPendingReviews(rev || []);
                setSettings({
                    contact_info: contact,
                    impact_stats: stats,
                    home_hero: hHero,
                    about_hero: aHero
                });

            } catch (err) {
                console.error("Failed to load content:", err);
            }
        };
        loadData();
    }, []);



    // -- PRODUCTS --
    const addProduct = async (product) => {
        try {
            const res = await createProduct(product);
            if (res && res.id) {
                setAllProducts(prev => [...prev, { ...product, id: res.id }]);
                return res.id;
            }
        } catch (err) { console.error(err); }
    };

    const updateProduct = async (product) => {
        try {
            await apiUpdateProduct(product);
            setAllProducts(prev => prev.map(p => p.id === product.id ? product : p));
        } catch (err) { console.error(err); }
    };

    const deleteProduct = async (id) => {
        try {
            await apiDeleteProduct(id);
            setAllProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) { console.error(err); }
    };

    // --- CATEGORIES ---
    const addCategory = async (category) => {
        if (categories.includes(category)) return;
        const newCategories = [...categories, category];
        setCategories(newCategories);
        try {
            await apiUpdateCategories(newCategories);
        } catch (err) { console.error("Failed to add category", err); }
    };

    const deleteCategory = async (category) => {
        const newCategories = categories.filter(c => c !== category);
        setCategories(newCategories);
        try {
            await apiUpdateCategories(newCategories);
        } catch (err) { console.error("Failed to delete category", err); }
    };

    const renameCategory = async (oldName, newName) => {
        if (!newName || oldName === newName) return;

        // 1. Update Category List
        // If newName exists, we merge (effectively removing oldName and keeping newName)
        const newCategories = categories.map(c => c === oldName ? newName : c);
        const uniqueCategories = [...new Set(newCategories)]; // Remove duplicates if merge happened

        setCategories(uniqueCategories);
        try {
            await apiUpdateCategories(uniqueCategories);
        } catch (err) { console.error("Failed to update categories list", err); }

        // 2. Cascade Update to Products
        const productsToUpdate = allProducts.filter(p => p.category === oldName);

        // Optimistic Update
        setAllProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: newName } : p));

        // API Update Loop
        // In a real app, backend should handle cascading, but we do it client-side here
        for (const p of productsToUpdate) {
            try {
                await apiUpdateProduct({ ...p, category: newName });
            } catch (err) { console.error(`Failed to update product ${p.name} category`, err); }
        }
    };

    // -- GALLERY --
    const addImageToGallery = async (url) => {
        try {
            const res = await apiAddToGallery({ url, caption: "New Image" });
            if (res && res.id) {
                setGallery(prev => [...prev, { id: res.id, url, caption: "New Image" }]);
            }
        } catch (err) { console.error(err); }
    };

    const removeImageFromGallery = async (id) => {
        try {
            await apiDeleteFromGallery(id);
            setGallery(prev => prev.filter(img => img.id !== id));
        } catch (err) { console.error(err); }
    };

    // -- STORIES --
    const addStory = async (story) => {
        try {
            const res = await createStory(story);
            if (res && res.id) {
                setStories(prev => [...prev, { ...story, id: res.id, featured: !!story.featured }]);
            }
        } catch (err) { console.error(err); }
    };

    const updateStory = async (story) => {
        try {
            await apiUpdateStory(story);
            setStories(prev => prev.map(s => s.id === story.id ? story : s));
        } catch (err) { console.error(err); }
    };

    const deleteStory = async (id) => {
        try {
            await apiDeleteStory(id);
            setStories(prev => prev.filter(s => s.id !== id));
        } catch (err) { console.error(err); }
    };

    // -- TEAM --
    const addTeamMember = async (member) => {
        try {
            const res = await createTeamMember(member);
            if (res && res.id) setTeam(prev => [...prev, { ...member, id: res.id }]);
        } catch (err) { console.error(err); }
    };
    const updateTeamMember = async (member) => {
        try {
            await apiUpdateTeamMember(member);
            setTeam(prev => prev.map(t => t.id === member.id ? member : t));
        } catch (err) { console.error(err); }
    };
    const deleteTeamMember = async (id) => {
        try {
            await apiDeleteTeamMember(id);
            setTeam(prev => prev.filter(t => t.id !== id));
        } catch (err) { console.error(err); }
    };

    // -- JOURNEY --
    const addJourney = async (item) => {
        try {
            const res = await createJourney(item);
            if (res && res.id) setJourney(prev => [...prev, { ...item, id: res.id }]);
        } catch (err) { console.error(err); }
    };
    const updateJourney = async (item) => {
        if (item.id) {
            try {
                await apiUpdateJourneyMilestone(item);
                setJourney(prev => prev.map(j => j.id === item.id ? item : j));
            } catch (err) { console.error(err); }
        }
    };
    const deleteJourney = async (id) => {
        try {
            await apiDeleteJourney(id);
            setJourney(prev => prev.filter(j => j.id !== id));
        } catch (err) { console.error(err); }
    };

    // -- HOME PRODUCTS --
    const toggleHomeProduct = async (id) => {
        let newIds;
        if (homeProductIds.includes(id)) {
            newIds = homeProductIds.filter(pid => pid !== id);
        } else {
            if (homeProductIds.length >= 4) return; // Max 4
            newIds = [...homeProductIds, id];
        }
        setHomeProductIds(newIds);
        try {
            await updateHomeProductIds(newIds);
        } catch (err) { console.error("Failed to update home products", err); }
    };

    const getHomeProducts = () => {
        return allProducts.filter(p => homeProductIds.includes(p.id));
    };

    // --- PROGRAMS ---
    const addProgram = async (program) => {
        try {
            const res = await createProgram(program);
            if (res && res.id) setPrograms(prev => [...prev, { ...program, id: res.id }]);
        } catch (err) { console.error(err); }
    };
    const updateProgramAction = async (program) => {
        try {
            await apiUpdateProgram(program);
            setPrograms(prev => prev.map(p => p.id === program.id ? program : p));
        } catch (err) { console.error(err); }
    };
    const deleteProgramAction = async (id) => {
        try {
            await apiDeleteProgram(id);
            setPrograms(prev => prev.filter(p => p.id !== id));
        } catch (err) { console.error(err); }
    };

    // --- SETTINGS ---
    const updateSetting = async (key, value) => {
        try {
            await apiUpdateSettings(key, value);
            setSettings(prev => ({ ...prev, [key]: value }));
        } catch (err) { console.error(err); }
    };

    // --- MESSAGES ---
    const sendContactMessage = async (msg) => {
        try {
            await sendMessage(msg);
        } catch (err) { console.error(err); }
    };

    const markMessageRead = async (id, status) => {
        // Optimistic update
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: status } : m));
        try {
            await apiUpdateMessageRead(id, status);
        } catch (err) { console.error("Failed to update message status", err); }
    };

    const deleteMessageAction = async (id) => {
        try {
            await apiDeleteMessage(id);
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch (err) { console.error("Failed to delete message", err); }
    };

    // --- REVIEWS ---
    const approveReviewAction = async (id) => {
        try {
            await apiApproveReview(id);
            setPendingReviews(prev => prev.filter(r => r.id !== id));
        } catch (err) { console.error("Failed to approve review", err); }
    };

    const deleteReviewAction = async (id) => {
        try {
            await apiDeleteReview(id);
            setPendingReviews(prev => prev.filter(r => r.id !== id));
        } catch (err) { console.error("Failed to delete review", err); }
    };

    return (
        <ContentContext.Provider value={{
            allProducts, addProduct, updateProduct, deleteProduct,
            categories, addCategory, deleteCategory, renameCategory,
            gallery, addImageToGallery, removeImageFromGallery,
            stories, addStory, updateStory, deleteStory,
            team, addTeamMember, updateTeamMember, deleteTeamMember,
            journey, addJourney, updateJourney, deleteJourney,
            homeProductIds, toggleHomeProduct, getHomeProducts,
            programs, addProgram, updateProgram: updateProgramAction, deleteProgram: deleteProgramAction,
            settings, updateSetting,
            messages, sendContactMessage, markMessageRead, deleteMessage: deleteMessageAction,
            pendingReviews, approveReview: approveReviewAction, deleteReview: deleteReviewAction
        }}>
            {children}
        </ContentContext.Provider>
    );
};

