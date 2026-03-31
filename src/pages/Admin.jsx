import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import { getImageUrl, fetchAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../api';
import { validateProduct, sanitizeText } from '../utils/validation';


const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Check sessionStorage on mount
        return sessionStorage.getItem('adminAuth') === 'true';
    });
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('products');
    const { pendingReviews } = useContent();

    // Handle login
    const handleLogin = () => {
        if (password === 'admin123') {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'true');
        } else {
            alert('Incorrect Password');
        }
    };

    // Handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 px-4">
                <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <span className="material-symbols-outlined text-primary text-4xl">admin_panel_settings</span>
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Admin Panel</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Educate A RURAL Girl Foundation</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-neutral-300">Password</label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-neutral-300 px-4 py-3 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleLogin();
                                }}
                            />
                        </div>
                        <button
                            onClick={handleLogin}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-lg">
                            Login to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="max-w-[1400px] mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white truncate">Admin Dashboard</h1>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 truncate">Educate A RURAL Girl Foundation - Content Management</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0">
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-64 shrink-0">
                        {/* Mobile: Horizontal Scroll */}
                        <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4">
                            <div className="flex gap-2 min-w-max">
                                {['products', 'categories', 'gallery', 'stories', 'partners', 'journey', 'team', 'programs', 'blog', 'settings', 'messages', 'reviews'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${activeTab === tab
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                                            }`}
                                    >
                                        {tab.replace('_', ' ').charAt(0).toUpperCase() + tab.replace('_', ' ').slice(1)}
                                        {tab === 'reviews' && pendingReviews.length > 0 && (
                                            <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingReviews.length}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Desktop: Vertical Tabs */}
                        <div className="hidden lg:flex flex-col gap-2">
                            {['products', 'categories', 'gallery', 'stories', 'partners', 'journey', 'team', 'programs', 'blog', 'settings', 'messages', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                                        }`}
                                >
                                    {tab.replace('_', ' ').charAt(0).toUpperCase() + tab.replace('_', ' ').slice(1)}
                                    {tab === 'reviews' && pendingReviews.length > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingReviews.length}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-white dark:bg-neutral-800 rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                        {activeTab === 'products' && <ProductsEditor />}
                        {activeTab === 'categories' && <CategoriesEditor />}
                        {activeTab === 'gallery' && <GalleryEditor />}
                        {activeTab === 'stories' && <StoriesEditor />}
                        {activeTab === 'partners' && <PartnersEditor />}

                        {activeTab === 'journey' && <JourneyEditor />}
                        {activeTab === 'team' && <TeamEditor />}
                        {activeTab === 'programs' && <ProgramsEditor />}
                        {activeTab === 'blog' && <BlogEditor />}
                        {activeTab === 'settings' && <SettingsEditor />}
                        {activeTab === 'messages' && <MessagesViewer />}
                        {activeTab === 'reviews' && <ReviewsManager />}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategoriesEditor = () => {
    const { categories, addCategory, deleteCategory, renameCategory } = useContent();
    const [newCategory, setNewCategory] = useState('');
    const [editingCat, setEditingCat] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleAdd = () => {
        if (!newCategory.trim()) return;
        addCategory(newCategory.trim());
        setNewCategory('');
    };

    const startEdit = (cat) => {
        setEditingCat(cat);
        setEditValue(cat);
    };

    const handleRename = () => {
        if (editValue.trim() && editValue !== editingCat) {
            renameCategory(editingCat, editValue.trim());
        }
        setEditingCat(null);
    };

    return (
        <div>
            <h2 className="text-lg sm:text-xl font-bold mb-6 dark:text-white">Category Manager</h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
                <input
                    className="flex-1 p-3 sm:p-2 border rounded dark:bg-neutral-900 dark:text-white"
                    placeholder="Enter new category name..."
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="w-full sm:w-auto bg-secondary text-white px-6 py-3 sm:py-2 rounded-lg font-bold">Add Category</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {categories.map(cat => (
                    <div key={cat} className="p-3 border rounded-lg dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                        {editingCat === cat ? (
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 p-1 border rounded dark:bg-neutral-800 dark:text-white"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    autoFocus
                                />
                                <button onClick={handleRename} className="text-green-600 hover:text-green-700">
                                    <span className="material-symbols-outlined">check</span>
                                </button>
                                <button onClick={() => setEditingCat(null)} className="text-gray-500 hover:text-gray-600">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <span className="font-medium dark:text-white">{cat}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(cat)} className="text-blue-600 hover:text-blue-700">
                                        <span className="material-symbols-outlined text-xl">edit</span>
                                    </button>
                                    <button onClick={() => deleteCategory(cat)} className="text-red-600 hover:text-red-700">
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProductsEditor = () => {
    const { allProducts, addProduct, updateProduct, deleteProduct, categories, homeProductIds, toggleHomeProduct } = useContent();
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    // For Details handling
    const [isDonationItem, setIsDonationItem] = useState(false);
    // Standard Details (Array of strings)
    const [newDetail, setNewDetail] = useState('');
    // Donation Details (Object)
    const [donationDetails, setDonationDetails] = useState({
        subCategory: '',
        beneficiaries: '',
        duration: '',
        icon: ''
    });

    // Simple string array handling for images
    const handleArrayChange = (field, value) => {
        setFormData({ ...formData, [field]: value.split('\n') });
    };

    const handleSave = async () => {
        let savedId = editingId;
        let finalImages = formData.images || [];

        // Auto-add tempImage if exists and user didn't click add
        if (formData.tempImage) {
            finalImages = [...finalImages, formData.tempImage];
        }

        // Prepare Details based on type
        let finalDetails;
        if (isDonationItem) {
            // For Donation items, details is an Object
            finalDetails = { ...donationDetails };
            // Ensure category is set correctly for filtering if needed, though product.category is main one
            // We might want to set itemType='donation' if backend supports it, or just rely on structure
        } else {
            // For Standard items, details is an Array of strings
            finalDetails = formData.details || [];
        }

        const productToSave = {
            ...formData,
            category: isDonationItem ? 'Donation' : formData.category, // Force category if donation? Or let user choose? 
            // Better: Let user choose category, but save details as object/array
            images: finalImages,
            details: finalDetails,
            itemType: isDonationItem ? 'donation' : 'product', // Helpful flag for frontend filtering
            tempImage: '' // Clear temp
        };

        // Validate product data
        const validation = validateProduct(productToSave);
        if (!validation.isValid) {
            validation.errors.forEach(error => toast.error(error));
            return; // Stop saving if validation fails
        }

        // Sanitize text fields to prevent XSS
        const sanitizedProduct = {
            ...productToSave,
            name: sanitizeText(productToSave.name),
            description: sanitizeText(productToSave.description),
            material: sanitizeText(productToSave.material),
            dimensions: sanitizeText(productToSave.dimensions),
            origin: sanitizeText(productToSave.origin),
            impact: sanitizeText(productToSave.impact)
        };

        // Strip UI-only fields if needed, but API ignores extras
        if (editingId === 'new') {
            savedId = await addProduct(sanitizedProduct);
            toast.success('Product added successfully!');
        } else {
            await updateProduct(sanitizedProduct);
            toast.success('Product updated successfully!');
        }

        // Handle Home Value
        if (savedId) {
            const isCurrentlyHome = homeProductIds.includes(savedId);
            if (formData.isHomeFeatured !== isCurrentlyHome) {
                toggleHomeProduct(savedId);
            }
        }

        setEditingId(null);
        setFormData({});
    };

    const startNew = () => {
        setEditingId('new');
        setIsDonationItem(false);
        setNewDetail('');
        setDonationDetails({ subCategory: '', beneficiaries: '', duration: '', icon: '' });

        setFormData({
            name: '', price: '', category: categories[0] || 'Handmade Crafts', description: '',
            material: '', dimensions: '', origin: '', impact: '',
            images: [], details: [], isHomeFeatured: false, stock: 0, offerPrice: null
        });
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        const p = {
            ...product,
            isHomeFeatured: homeProductIds.includes(product.id),
            stock: product.stock !== undefined ? product.stock : 0
        };
        setFormData(p);

        // Determine if it's a donation item based on details structure or existing itemType
        const isDonation = product.itemType === 'donation' || (product.details && !Array.isArray(product.details));
        setIsDonationItem(isDonation);

        if (isDonation) {
            setDonationDetails({
                subCategory: product.details?.subCategory || '',
                beneficiaries: product.details?.beneficiaries || '',
                duration: product.details?.duration || '',
                icon: product.details?.icon || ''
            });
            setNewDetail(''); // Clear standard
        } else {
            // Standard product, ensure details is array
            if (!Array.isArray(p.details)) p.details = [];
            setFormData(p); // Re-set with array details
            setNewDetail('');
        }
    };

    const addDetailItem = () => {
        if (!newDetail.trim()) return;
        const currentDetails = Array.isArray(formData.details) ? formData.details : [];
        setFormData({ ...formData, details: [...currentDetails, newDetail.trim()] });
        setNewDetail('');
    };

    const removeDetailItem = (index) => {
        const currentDetails = Array.isArray(formData.details) ? formData.details : [];
        const newDetails = [...currentDetails];
        newDetails.splice(index, 1);
        setFormData({ ...formData, details: newDetails });
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-lg sm:text-xl font-bold dark:text-white">Shop Manager</h2>
                {!editingId && (
                    <button onClick={startNew} className="w-full sm:w-auto bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold">
                        + Add Product
                    </button>
                )}
            </div>

            {editingId ? (
                <div className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1 dark:text-white">Product Name</label>
                            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-white">Price ($)</label>
                            <input type="number" step="0.01" className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-white">Offer Price ($) <span className="text-xs text-gray-500">Optional</span></label>
                            <input type="number" step="0.01" placeholder="Leave empty for no offer" className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.offerPrice || ''} onChange={e => setFormData({ ...formData, offerPrice: e.target.value ? parseFloat(e.target.value) : null })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-white">Category</label>
                            <select className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                {categories.map(cat => (
                                    <option key={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1 dark:text-white">Description</label>
                            <textarea rows="3" className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1 dark:text-white">Product Images</label>
                            <div className="mb-2 flex gap-2 items-start">
                                <div className="flex-1">
                                    <ImageUploader
                                        value={formData.tempImage || ''}
                                        onChange={(url) => setFormData({ ...formData, tempImage: url })}
                                        placeholder="Upload or Paste URL..."
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        if (formData.tempImage) {
                                            const current = formData.images || [];
                                            setFormData({
                                                ...formData,
                                                images: [...current, formData.tempImage],
                                                tempImage: ''
                                            });
                                        }
                                    }}
                                    className="bg-secondary text-white px-4 py-2 rounded font-bold h-[42px]"
                                    title="Add Image"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>

                            {/* Bulk URL Textarea (for pasting multiple URLs) */}
                            <div className="mb-3">
                                <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                                    Or paste multiple URLs (one per line):
                                </label>
                                <textarea
                                    rows="2"
                                    className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white text-xs"
                                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                    value={formData.images ? formData.images.join('\n') : ''}
                                    onChange={e => handleArrayChange('images', e.target.value)}
                                />
                            </div>

                            {/* Drag-and-Drop Image List */}
                            {formData.images && formData.images.length > 0 && (
                                <div className="space-y-2 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                                        <span className="material-symbols-outlined text-sm align-middle">info</span> Drag images to reorder, or use arrow buttons
                                    </p>
                                    {formData.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            draggable
                                            onDragStart={(e) => e.dataTransfer.setData('text/plain', idx.toString())}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const dragIdx = parseInt(e.dataTransfer.getData('text/plain'));
                                                const dropIdx = idx;
                                                if (dragIdx === dropIdx) return;

                                                const newImages = [...formData.images];
                                                const [draggedItem] = newImages.splice(dragIdx, 1);
                                                newImages.splice(dropIdx, 0, draggedItem);
                                                setFormData({ ...formData, images: newImages });
                                            }}
                                            className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary transition-colors cursor-move group"
                                        >
                                            {/* Drag Handle */}
                                            <div className="flex items-center gap-2 text-neutral-400">
                                                <span className="material-symbols-outlined text-xl">drag_indicator</span>
                                                <span className="text-xs font-mono text-neutral-500">#{idx + 1}</span>
                                            </div>

                                            {/* Image Preview */}
                                            <div className="w-16 h-16 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                                                {img && (
                                                    <img src={getImageUrl(img)} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>

                                            {/* Image URL */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{img}</p>
                                            </div>

                                            {/* Controls */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Move Up */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (idx === 0) return;
                                                        const newImages = [...formData.images];
                                                        [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                    disabled={idx === 0}
                                                    className="p-1 text-neutral-600 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move up"
                                                >
                                                    <span className="material-symbols-outlined text-lg">arrow_upward</span>
                                                </button>

                                                {/* Move Down */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (idx === formData.images.length - 1) return;
                                                        const newImages = [...formData.images];
                                                        [newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                    disabled={idx === formData.images.length - 1}
                                                    className="p-1 text-neutral-600 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move down"
                                                >
                                                    <span className="material-symbols-outlined text-lg">arrow_downward</span>
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = [...formData.images];
                                                        newImages.splice(idx, 1);
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                    className="p-1 text-red-600 hover:text-red-700"
                                                    title="Remove image"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-white">Material</label>
                            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-white">Dimensions</label>
                            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.dimensions} onChange={e => setFormData({ ...formData, dimensions: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-white">Stock Quantity</label>
                            <input type="number" min="0" className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-white">Origin</label>
                            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-white">Impact Statement</label>
                            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.impact} onChange={e => setFormData({ ...formData, impact: e.target.value })} />
                        </div>
                        <div className="col-span-2 p-4 border rounded-lg bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700">
                            <label className="flex items-center gap-2 font-bold dark:text-white mb-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={isDonationItem}
                                    onChange={e => setIsDonationItem(e.target.checked)}
                                />
                                Is this a "Basket of Hope" Donation Item?
                            </label>

                            {isDonationItem ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded mb-2 border border-blue-100 dark:border-blue-800">
                                        <p className="text-sm text-blue-800 dark:text-blue-300">
                                            <span className="font-bold">Donation Item Mode:</span> Details entered here will create the impact card on the "Basket of Hope" page.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1 dark:text-white">Sub-Category <span className="text-xs font-normal">(e.g., Hygiene, Education)</span></label>
                                        <input
                                            className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white"
                                            value={donationDetails.subCategory}
                                            onChange={e => setDonationDetails({ ...donationDetails, subCategory: e.target.value })}
                                            placeholder="Filters on donation page"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1 dark:text-white">Beneficiaries <span className="text-xs font-normal">(e.g., 1 girl)</span></label>
                                        <input
                                            className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white"
                                            value={donationDetails.beneficiaries}
                                            onChange={e => setDonationDetails({ ...donationDetails, beneficiaries: e.target.value })}
                                            placeholder="Who gets this?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1 dark:text-white">Duration <span className="text-xs font-normal">(e.g., 1 year)</span></label>
                                        <input
                                            className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white"
                                            value={donationDetails.duration}
                                            onChange={e => setDonationDetails({ ...donationDetails, duration: e.target.value })}
                                            placeholder="How long it lasts?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1 dark:text-white">Icon Name <span className="text-xs font-normal">(Google Material Symbol)</span></label>
                                        <input
                                            className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white"
                                            value={donationDetails.icon}
                                            onChange={e => setDonationDetails({ ...donationDetails, icon: e.target.value })}
                                            placeholder="e.g., school, checkroom"
                                        />
                                        <a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                                            Browse Icons ↗
                                        </a>
                                    </div>
                                    {donationDetails.icon && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm">Preview:</span>
                                            <span className="material-symbols-outlined text-2xl text-primary">{donationDetails.icon}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold mb-2 dark:text-white">Product Details (Bullet Points)</label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            className="flex-1 p-2 border rounded dark:bg-neutral-900 dark:text-white"
                                            value={newDetail}
                                            onChange={e => setNewDetail(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && addDetailItem()}
                                            placeholder="e.g., Handmade in Kenya"
                                        />
                                        <button
                                            onClick={addDetailItem}
                                            className="bg-secondary text-white px-4 py-2 rounded font-bold"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <ul className="space-y-2">
                                        {Array.isArray(formData.details) && formData.details.map((detail, idx) => (
                                            <li key={idx} className="flex justify-between items-center bg-white dark:bg-neutral-900 p-2 rounded border dark:border-neutral-700">
                                                <span className="dark:text-white text-sm">{detail}</span>
                                                <button
                                                    onClick={() => removeDetailItem(idx)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <span className="material-symbols-outlined text-lg">close</span>
                                                </button>
                                            </li>
                                        ))}
                                        {(!formData.details || formData.details.length === 0) && (
                                            <li className="text-sm text-gray-500 italic">No details added yet.</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="col-span-2 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded border border-yellow-200 dark:border-yellow-700">
                            <label className="flex items-center gap-2 cursor-pointer font-bold dark:text-white">
                                <input
                                    type="checkbox"
                                    className="size-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={formData.isHomeFeatured || false}
                                    onChange={e => setFormData({ ...formData, isHomeFeatured: e.target.checked })}
                                />
                                Feature on Home Page
                            </label>
                            <p className="text-sm text-gray-500 mt-1 ml-7">If checked, this product will appear in the "Shop for a Cause" section on the home page.</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                        <button onClick={handleSave} className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 sm:py-2 rounded font-bold">Save Product</button>
                        <button onClick={() => setEditingId(null)} className="w-full sm:w-auto bg-gray-500 text-white px-6 py-3 sm:py-2 rounded font-bold">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {allProducts.map(product => (
                        <div key={product.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 border rounded-lg dark:border-neutral-700">
                            {product.images && product.images.length > 0 ? (
                                <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full sm:w-20 sm:h-20 h-48 object-cover rounded bg-gray-100" />
                            ) : (
                                <div className="w-full sm:w-20 sm:h-20 h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined">image</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold dark:text-white flex flex-wrap items-center gap-2 mb-1">
                                    <span className="truncate">{product.name}</span>
                                    {homeProductIds.includes(product.id) && <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded border border-primary/20 shrink-0">Featured</span>}
                                </h3>
                                <p className="text-sm text-gray-500">${product.price} - {product.category}</p>
                            </div>
                            <div className="flex gap-2 sm:flex-col sm:justify-center">
                                <button onClick={() => startEdit(product)} className="flex-1 sm:flex-none px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium">Edit</button>
                                <button onClick={() => deleteProduct(product.id)} className="flex-1 sm:flex-none px-4 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const GalleryEditor = () => {
    const { gallery, addImageToGallery, removeImageFromGallery } = useContent();
    const [newUrl, setNewUrl] = useState('');

    const handleAdd = () => {
        if (!newUrl) return;
        addImageToGallery(newUrl);
        setNewUrl('');
    };

    return (
        <div>
            <h2 className="text-lg sm:text-xl font-bold mb-6 dark:text-white">Gallery Manager</h2>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
                <div className="flex-1">
                    <ImageUploader value={newUrl} onChange={setNewUrl} placeholder="Enter URL or Upload..." />
                </div>
                <button onClick={handleAdd} className="w-full sm:w-auto bg-secondary text-white px-6 py-3 sm:py-2 rounded-lg font-bold">Add Photo</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {gallery.map(img => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square border dark:border-neutral-700">
                        {img.url && (
                            <img src={getImageUrl(img.url)} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => removeImageFromGallery(img.id)} className="bg-red-600 text-white p-2 rounded-full">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StoriesEditor = () => {
    const { stories, updateStory, addStory, deleteStory } = useContent();
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    const handleEdit = (story) => {
        setEditingId(story.id);
        setFormData(story);
    };

    const handleSave = () => {
        if (editingId === 'new') {
            addStory(formData);
        } else {
            updateStory(formData);
        }
        setEditingId(null);
        setFormData({});
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-lg sm:text-xl font-bold dark:text-white">Stories Management</h2>
                <button
                    onClick={() => { setEditingId('new'); setFormData({ name: '', role: '', quote: '', image: '', featured: false }); }}
                    className="w-full sm:w-auto bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold"
                >
                    + Add New Story
                </button>
            </div>

            <div className="space-y-4">
                {stories.map(story => (
                    <div key={story.id} className="p-4 border rounded-lg dark:border-neutral-700 flex justify-between items-start gap-4">
                        {editingId === story.id ? (
                            <div className="w-full space-y-3">
                                <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                <textarea className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Quote" value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} />
                                <ImageUploader value={formData.image} onChange={url => setFormData({ ...formData, image: url })} placeholder="Image URL" />
                                <label className="flex items-center gap-2 text-sm dark:text-white">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={e => {
                                            const isChecking = e.target.checked;
                                            const otherFeatured = stories.filter(s => s.featured && s.id !== formData.id).length;
                                            if (isChecking && otherFeatured >= 2) {
                                                alert("Maximum 2 stories can be featured on the home page.");
                                                return;
                                            }
                                            setFormData({ ...formData, featured: isChecking });
                                        }}
                                    />
                                    Show on Home Page
                                </label>
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                                    <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <h3 className="font-bold dark:text-white">{story.name} {story.featured && <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded ml-2">Home Page</span>}</h3>
                                    <p className="text-sm text-gray-500">{story.role}</p>
                                    <p className="text-sm italic mt-1 dark:text-gray-400">"{story.quote}"</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(story)} className="text-blue-600 hover:underline text-sm">Edit</button>
                                    <button onClick={() => deleteStory(story.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {editingId === 'new' && (
                    <div className="p-4 border rounded-lg border-green-200 bg-green-50 dark:bg-green-900/10 space-y-3">
                        <h3 className="font-bold text-green-800 dark:text-green-400">New Story</h3>
                        <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                        <textarea className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Quote" value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} />
                        <ImageUploader value={formData.image} onChange={url => setFormData({ ...formData, image: url })} placeholder="Image URL" />
                        <label className="flex items-center gap-2 text-sm dark:text-white">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={e => {
                                    const isChecking = e.target.checked;
                                    const currentFeatured = stories.filter(s => s.featured).length; // For new story, all existing featured count matter
                                    if (isChecking && currentFeatured >= 2) {
                                        alert("Maximum 2 stories can be featured on the home page.");
                                        return;
                                    }
                                    setFormData({ ...formData, featured: isChecking });
                                }}
                            />
                            Show on Home Page
                        </label>
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Create</button>
                            <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PartnersEditor = () => {
    const { partners, addPartner, updatePartner, deletePartner } = useContent();
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    const startCreate = () => {
        setEditingId('new');
        setFormData({ name: '', logo: '', website: '', description: '', sort_order: partners.length });
    };

    const handleEdit = (partner) => {
        setEditingId(partner.id);
        setFormData({
            ...partner,
            website: partner.website || '',
            description: partner.description || '',
            sort_order: partner.sort_order ?? 0
        });
    };

    const handleSave = () => {
        const payload = {
            ...formData,
            name: (formData.name || '').trim(),
            logo: formData.logo || '',
            website: (formData.website || '').trim(),
            description: (formData.description || '').trim(),
            sort_order: Number(formData.sort_order) || 0
        };

        if (!payload.name || !payload.logo) {
            alert('Partner name and logo are required.');
            return;
        }

        if (editingId === 'new') addPartner(payload);
        else updatePartner(payload);

        setEditingId(null);
        setFormData({});
    };

    const renderForm = (submitLabel) => (
        <div className="space-y-3">
            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Partner name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <ImageUploader value={formData.logo || ''} onChange={url => setFormData({ ...formData, logo: url })} placeholder="Logo URL or upload..." />
            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Website URL (optional)" value={formData.website || ''} onChange={e => setFormData({ ...formData, website: e.target.value })} />
            <textarea className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" rows="3" placeholder="Short description (optional)" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" type="number" placeholder="Display order" value={formData.sort_order ?? 0} onChange={e => setFormData({ ...formData, sort_order: e.target.value })} />
            <div className="flex gap-2">
                <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">{submitLabel}</button>
                <button onClick={() => { setEditingId(null); setFormData({}); }} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-lg sm:text-xl font-bold dark:text-white">Partners Management</h2>
                <button
                    onClick={startCreate}
                    className="w-full sm:w-auto bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold"
                >
                    + Add New Partner
                </button>
            </div>

            {editingId === 'new' && (
                <div className="p-4 mb-6 border rounded-lg border-green-200 bg-green-50 dark:bg-green-900/10">
                    <h3 className="font-bold text-green-800 dark:text-green-400 mb-3">New Partner</h3>
                    {renderForm('Create')}
                </div>
            )}

            <div className="space-y-4">
                {[...partners]
                    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id)
                    .map(partner => (
                        <div key={partner.id} className="p-4 border rounded-lg dark:border-neutral-700 flex justify-between items-start gap-4">
                            {editingId === partner.id ? (
                                <div className="w-full">
                                    {renderForm('Save')}
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start gap-4">
                                        {partner.logo && (
                                            <img src={getImageUrl(partner.logo)} alt={partner.name} className="h-14 w-20 rounded object-contain border bg-white p-2" />
                                        )}
                                        <div>
                                            <h3 className="font-bold dark:text-white">{partner.name}</h3>
                                            {partner.website && <p className="text-sm text-blue-600 break-all">{partner.website}</p>}
                                            {partner.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{partner.description}</p>}
                                            <p className="text-xs text-gray-400 mt-2">Display order: {partner.sort_order ?? 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(partner)} className="text-blue-600 hover:underline text-sm">Edit</button>
                                        <button onClick={() => deletePartner(partner.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};



const JourneyEditor = () => {
    const { journey, updateJourney, addJourney, deleteJourney } = useContent();
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({});

    const handleEdit = (index, item) => {
        setEditingIndex(index);
        setFormData(item);
    };

    const handleSave = () => {
        if (editingIndex === 'new') addJourney(formData);
        else updateJourney(editingIndex, formData);
        setEditingIndex(null);
        setFormData({});
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-lg sm:text-xl font-bold dark:text-white">Our Journey (About Us)</h2>
                <button
                    onClick={() => { setEditingIndex('new'); setFormData({ year: '', title: '', description: '' }); }}
                    className="w-full sm:w-auto bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold"
                >
                    + Add Milestone
                </button>
            </div>

            {editingIndex === 'new' && (
                <div className="p-4 mb-6 border rounded-lg border-green-200 bg-green-50 dark:bg-green-900/10 space-y-3">
                    <h3 className="font-bold text-green-800 dark:text-green-400">New Milestone</h3>
                    <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Year" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                    <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    <textarea className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={handleSave} className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 sm:px-3 sm:py-1 rounded">Create</button>
                        <button onClick={() => setEditingIndex(null)} className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded">Cancel</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {journey.map((item, index) => (
                    <div key={item.id || index} className="p-4 border rounded-lg dark:border-neutral-700">
                        {editingIndex === index ? (
                            <div className="space-y-3">
                                <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                                <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                <textarea className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button onClick={handleSave} className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 sm:px-3 sm:py-1 rounded">Save</button>
                                    <button onClick={() => setEditingIndex(null)} className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-bold text-primary">{item.year}</span> - <span className="font-bold dark:text-white">{item.title}</span>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(index, item)} className="text-blue-600 hover:underline text-sm">Edit</button>
                                    <button onClick={() => deleteJourney(item.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeamEditor = () => {
    const { team, updateTeamMember, addTeamMember, deleteTeamMember } = useContent();
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    const handleEdit = (member) => {
        setEditingId(member.id);
        setFormData(member);
    };

    const handleSave = () => {
        if (editingId === 'new') addTeamMember(formData);
        else updateTeamMember(formData);
        setEditingId(null);
        setFormData({});
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-lg sm:text-xl font-bold dark:text-white">Team Management</h2>
                <button
                    onClick={() => { setEditingId('new'); setFormData({ name: '', role: '', image: '' }); }}
                    className="w-full sm:w-auto bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold"
                >
                    + Add Team Member
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editingId === 'new' && (
                    <div className="p-4 border rounded-lg border-green-200 bg-green-50 dark:bg-green-900/10 space-y-3">
                        <h3 className="font-bold text-green-800 dark:text-green-400">New Member</h3>
                        <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                        <ImageUploader value={formData.image} onChange={url => setFormData({ ...formData, image: url })} placeholder="Image URL" />
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Create</button>
                            <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                        </div>
                    </div>
                )}

                {team.map(member => (
                    <div key={member.id} className="p-4 border rounded-lg dark:border-neutral-700">
                        {editingId === member.id ? (
                            <div className="space-y-3">
                                <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" placeholder="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                <ImageUploader value={formData.image} onChange={url => setFormData({ ...formData, image: url })} placeholder="Image URL" />
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                                    <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4 items-center">
                                {member.image && (
                                    <img src={getImageUrl(member.image)} alt={member.name} className="size-12 rounded-full object-cover" />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold dark:text-white">{member.name}</h3>
                                    <p className="text-xs text-primary">{member.role}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => handleEdit(member)} className="text-blue-600 hover:underline text-sm text-right">Edit</button>
                                    <button onClick={() => deleteTeamMember(member.id)} className="text-red-600 hover:underline text-sm text-right">Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProgramsEditor = () => {
    const { programs, addProgram, updateProgram, deleteProgram } = useContent();
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({});

    const handleSave = () => {
        if (editing === 'new') addProgram(formData);
        else updateProgram(formData);
        setEditing(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">Programs Manager</h2>
                <button onClick={() => { setEditing('new'); setFormData({ title: '', description: '', features: [], image: '', header: '', dropdown_title: '' }); }} className="bg-secondary text-white px-4 py-2 rounded-lg font-bold">+ New Program</button>
            </div>
            {editing && (
                <div className="space-y-4 mb-8 p-4 border rounded dark:border-neutral-700">
                    <input placeholder="Title" className="w-full p-2 border rounded dark:bg-neutral-900" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    <input placeholder="Dropdown Title (shown in nav menu)" className="w-full p-2 border rounded dark:bg-neutral-900" value={formData.dropdown_title || ''} onChange={e => setFormData({ ...formData, dropdown_title: e.target.value })} />
                    <textarea placeholder="Description" className="w-full p-2 border rounded dark:bg-neutral-900" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <ImageUploader value={formData.image} onChange={url => setFormData({ ...formData, image: url })} placeholder="Image URL" />
                    <textarea placeholder="Features (one per line)" className="w-full p-2 border rounded dark:bg-neutral-900" rows="3" value={(formData.features || []).join('\n')} onChange={e => setFormData({ ...formData, features: e.target.value.split('\n') })} />

                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded font-bold">Save</button>
                        <button onClick={() => setEditing(null)} className="bg-gray-500 text-white px-4 py-2 rounded font-bold">Cancel</button>
                    </div>
                </div>
            )}
            <div className="grid gap-4">
                {programs.map(p => (
                    <div key={p.id} className="flex justify-between items-start p-4 border rounded dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                        <div>
                            <h3 className="font-bold dark:text-white">{p.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{p.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditing(p.id); setFormData(p); }} className="text-blue-600">Edit</button>
                            <button onClick={() => deleteProgram(p.id)} className="text-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsEditor = () => {
    const { settings, updateSetting } = useContent();
    const [section, setSection] = useState('contact_info');
    const [localData, setLocalData] = useState(null);

    const sectionLabels = {
        contact_info: 'Contact Info',
        impact_stats: 'Impact Stats',
        home_hero: 'Home Hero',
        home_images: 'Home Vision Image',
        about_hero: 'About Hero',
        about_images: 'About Page Images',
        programs_images: 'Programs Page Images',
        shop_images: 'Shop Hero'
    };

    React.useEffect(() => {
        setLocalData(settings[section] || {});
    }, [section, settings]);

    const handleSave = () => {
        updateSetting(section, localData);
        toast.success('Settings saved successfully!');
    };

    if (!localData) return <p>Loading...</p>;

    const renderForm = () => {
        if (section === 'home_hero' || section === 'about_hero') {
            const defaults = { title: '', subtitle: '', image: '' };
            const merged = { ...defaults, ...localData };
            return (
                <div className="space-y-4">
                    <div>
                        <label className="blocktext-sm font-bold mb-1 dark:text-white">Title</label>
                        <textarea className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" rows="2" value={merged.title || ''} onChange={e => setLocalData({ ...merged, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-white">Subtitle</label>
                        <textarea className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" rows="3" value={merged.subtitle || ''} onChange={e => setLocalData({ ...merged, subtitle: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-white">Background Image</label>
                        <ImageUploader value={merged.image || ''} onChange={url => setLocalData({ ...merged, image: url })} placeholder="Image URL" />
                    </div>
                </div>
            );
        }
        if (section === 'about_images') {
            const merged = { hero_bg: '', shop_bg: '', ...localData };
            return (
                <div className="space-y-6">
                    <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-lg border dark:border-neutral-700">
                        <label className="block text-sm font-bold mb-2 dark:text-white">Hero Background Image</label>
                        <p className="text-xs text-slate-500 mb-3">The full-screen background image at the top of the About page.</p>
                        <ImageUploader value={merged.hero_bg || ''} onChange={url => setLocalData({ ...merged, hero_bg: url })} placeholder="Upload or paste image URL..." />
                        {merged.hero_bg && <img src={merged.hero_bg} alt="About hero preview" className="mt-3 w-full h-32 object-cover rounded-lg" />}
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-lg border dark:border-neutral-700">
                        <label className="block text-sm font-bold mb-2 dark:text-white">"Shop for Good" Section Background</label>
                        <p className="text-xs text-slate-500 mb-3">The background image for the Shop for Good section near the bottom of the About page.</p>
                        <ImageUploader value={merged.shop_bg || ''} onChange={url => setLocalData({ ...merged, shop_bg: url })} placeholder="Upload or paste image URL..." />
                        {merged.shop_bg && <img src={merged.shop_bg} alt="Shop bg preview" className="mt-3 w-full h-32 object-cover rounded-lg" />}
                    </div>
                </div>
            );
        }
        if (section === 'programs_images') {
            const merged = { hero_bg: '', ...localData };
            return (
                <div className="space-y-6">
                    <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-lg border dark:border-neutral-700">
                        <label className="block text-sm font-bold mb-2 dark:text-white">Programs Hero Background Image</label>
                        <p className="text-xs text-slate-500 mb-3">The background image in the hero section at the top of the Programs page.</p>
                        <ImageUploader value={merged.hero_bg || ''} onChange={url => setLocalData({ ...merged, hero_bg: url })} placeholder="Upload or paste image URL..." />
                        {merged.hero_bg && <img src={merged.hero_bg} alt="Programs hero preview" className="mt-3 w-full h-32 object-cover rounded-lg" />}
                    </div>
                </div>
            );
        }
        if (section === 'home_images') {
            const merged = { vision_bg: '', ...localData };
            return (
                <div className="space-y-6">
                    <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-lg border dark:border-neutral-700">
                        <label className="block text-sm font-bold mb-2 dark:text-white">Vision Section Background Image</label>
                        <p className="text-xs text-slate-500 mb-3">The image corresponding to "Our Vision for a Better Future" on the Home page.</p>
                        <ImageUploader value={merged.vision_bg || ''} onChange={url => setLocalData({ ...merged, vision_bg: url })} placeholder="Upload or paste image URL..." />
                        {merged.vision_bg && <img src={merged.vision_bg} alt="Vision section preview" className="mt-3 w-full h-32 object-cover rounded-lg" />}
                    </div>
                </div>
            );
        }
        if (section === 'shop_images') {
            const merged = { hero_bg: '', ...localData };
            return (
                <div className="space-y-6">
                    <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-lg border dark:border-neutral-700">
                        <label className="block text-sm font-bold mb-2 dark:text-white">Shop Hero Background Image</label>
                        <p className="text-xs text-slate-500 mb-3">The background image in the hero section at the top of the Shop page.</p>
                        <ImageUploader value={merged.hero_bg || ''} onChange={url => setLocalData({ ...merged, hero_bg: url })} placeholder="Upload or paste image URL..." />
                        {merged.hero_bg && <img src={merged.hero_bg} alt="Shop hero preview" className="mt-3 w-full h-32 object-cover rounded-lg" />}
                    </div>
                </div>
            );
        }
        if (section === 'contact_info') {
            const defaults = { email: '', phone: '', address: '', instagram: '', facebook: '', twitter: '' };
            const merged = { ...defaults, ...localData };
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(merged).map(key => (
                            <div key={key}>
                                <label className="block text-sm font-bold capitalize mb-1 dark:text-white">{key}</label>
                                <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={merged[key] || ''} onChange={e => setLocalData({ ...merged, [key]: e.target.value })} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        if (section === 'impact_stats') {
            const data = Array.isArray(localData) ? localData : [];
            return (
                <div className="space-y-4">
                    {data.map((item, idx) => (
                        <div key={idx} className="p-4 border rounded bg-white dark:bg-neutral-800 dark:border-neutral-700 relative group">
                            <button onClick={() => { const newData = [...data]; newData.splice(idx, 1); setLocalData(newData); }} className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Label</label>
                                    <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={item.label} onChange={e => { const newData = [...data]; newData[idx] = { ...item, label: e.target.value }; setLocalData(newData); }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Value</label>
                                    <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={item.value} onChange={e => { const newData = [...data]; newData[idx] = { ...item, value: e.target.value }; setLocalData(newData); }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Icon</label>
                                    <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={item.icon} onChange={e => { const newData = [...data]; newData[idx] = { ...item, icon: e.target.value }; setLocalData(newData); }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Trend</label>
                                    <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={item.trend} onChange={e => { const newData = [...data]; newData[idx] = { ...item, trend: e.target.value }; setLocalData(newData); }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setLocalData([...data, { label: 'New Stat', value: '0', icon: 'star', trend: '+0%' }])} className="w-full py-2 bg-secondary/10 text-secondary font-bold rounded hover:bg-secondary/20 dashed border-2 border-secondary/30">
                        + Add Statistic
                    </button>
                </div>
            );
        }
        return (
            <div className="space-y-4">
                {Object.keys(localData).map(key => (
                    <div key={key}>
                        <label className="block text-sm font-bold capitalize mb-1 dark:text-white">{key.replace('_', ' ')}</label>
                        {typeof localData[key] === 'string' || typeof localData[key] === 'number' ? (
                            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={localData[key]} onChange={e => setLocalData({ ...localData, [key]: e.target.value })} />
                        ) : null}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">General Settings</h2>
                <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md transition-colors">Save Changes</button>
            </div>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['contact_info', 'home_hero', 'home_images', 'about_hero', 'about_images', 'programs_images', 'shop_images', 'impact_stats'].map(s => (
                    <button key={s} onClick={() => setSection(s)} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${section === s ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-neutral-700 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600'}`}>
                        {sectionLabels[s] || s.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>
            <div className="p-6 border rounded-xl dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 shadow-sm">
                {renderForm()}
            </div>
        </div>
    );
};

const MessagesViewer = () => {
    const { messages, markMessageRead, deleteMessage } = useContent();
    const [filter, setFilter] = useState('all'); // all, unread
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const filteredMessages = messages.filter(m => {
        const matchesFilter = filter === 'all' || (filter === 'unread' && !m.read);
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase()) ||
            m.message.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const unreadCount = messages.filter(m => !m.read).length;

    const handleToggle = (msg) => {
        if (expandedId === msg.id) {
            setExpandedId(null);
        } else {
            setExpandedId(msg.id);
            if (!msg.read) {
                markMessageRead(msg.id, true);
            }
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this message?')) {
            deleteMessage(id);
            if (expandedId === id) setExpandedId(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">
                    Inbox <span className="text-sm font-normal text-gray-500 ml-2">({unreadCount} unread)</span>
                </h2>
                <div className="flex gap-4">
                    <input
                        placeholder="Search messages..."
                        className="p-2 border rounded dark:bg-neutral-900 dark:text-white"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="flex border rounded overflow-hidden">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-sm font-medium ${filter === 'all' ? 'bg-primary text-white' : 'bg-white dark:bg-neutral-800 dark:text-gray-300'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 text-sm font-medium ${filter === 'unread' ? 'bg-primary text-white' : 'bg-white dark:bg-neutral-800 dark:text-gray-300'}`}
                        >
                            Unread
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {filteredMessages.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No messages found.</p>
                ) : (
                    filteredMessages.map((m, i) => (
                        <div key={m.id || i} className={`border rounded-lg transition-all ${!m.read ? 'border-primary/30 shadow-sm' : 'border-gray-200 dark:border-neutral-800'}`}>
                            <div
                                onClick={() => handleToggle(m)}
                                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors ${expandedId === m.id ? 'bg-gray-50 dark:bg-neutral-900' : 'bg-white dark:bg-neutral-800'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className={`font-bold ${!m.read ? 'text-primary' : 'dark:text-white'}`}>
                                            {m.name}
                                            {!m.read && <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>}
                                        </h3>
                                        <div className="text-sm text-gray-500">{m.email}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString()}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(m.id);
                                            }}
                                            className="text-red-600 hover:text-red-700 p-1"
                                            title="Delete message"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                        <span className={`material-symbols-outlined text-gray-400 transition-transform ${expandedId === m.id ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {expandedId === m.id && (
                                <div className="px-4 pb-4 border-t dark:border-neutral-700 pt-3 bg-gray-50 dark:bg-neutral-900">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">{m.message}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const ReviewsManager = () => {
    const { pendingReviews, approveReview, deleteReview } = useContent();

    const handleApprove = async (id) => {
        await approveReview(id);
        toast.success('Review approved!');
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this review?')) {
            await deleteReview(id);
            toast.success('Review deleted');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">
                    Pending Reviews <span className="text-sm font-normal text-gray-500 ml-2">({pendingReviews.length})</span>
                </h2>
            </div>

            <div className="space-y-4">
                {pendingReviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No pending reviews.</p>
                ) : (
                    pendingReviews.map(review => (
                        <div key={review.id} className="p-4 border rounded-lg dark:border-neutral-700 bg-white dark:bg-neutral-800">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold dark:text-white">{review.user_name}</h3>
                                        <span className="text-xs text-gray-500">→</span>
                                        <span className="text-sm text-primary font-medium">{review.product_name}</span>
                                    </div>
                                    <div className="flex gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`material-symbols-outlined text-[16px] fill-current ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}>star</span>
                                        ))}
                                    </div>
                                    {review.user_email && <p className="text-xs text-gray-500">{review.user_email}</p>}
                                </div>
                                <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(review.id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// ─── BLOG EDITOR ────────────────────────────────────────────────────────────
const BlogEditor = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({});

    const slugify = (text) =>
        text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    const load = () => {
        setLoading(true);
        fetchAllBlogPosts()
            .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const startNew = () => {
        setEditingId('new');
        setForm({ title: '', slug: '', excerpt: '', content: '', image: '', author: 'EARG Team', published: false });
    };

    const startEdit = (post) => {
        setEditingId(post.id);
        setForm({ ...post });
    };

    const handleSave = async () => {
        if (!form.title?.trim()) { toast.error('Title is required'); return; }
        if (!form.slug?.trim()) { toast.error('Slug is required'); return; }
        try {
            if (editingId === 'new') {
                await createBlogPost(form);
                toast.success('Post created!');
            } else {
                await updateBlogPost({ ...form, id: editingId });
                toast.success('Post updated!');
            }
            setEditingId(null);
            setForm({});
            load();
        } catch (err) {
            toast.error(err.message || 'Failed to save post');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await deleteBlogPost(id);
            toast.success('Post deleted');
            load();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const fld = (key, val) => setForm(f => ({ ...f, [key]: val }));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold dark:text-white">Blog Manager</h2>
                {!editingId && (
                    <button onClick={startNew} className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold">
                        + New Post
                    </button>
                )}
            </div>

            {editingId ? (
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-white">Title *</label>
                        <input
                            className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white"
                            value={form.title || ''}
                            onChange={e => { fld('title', e.target.value); if (editingId === 'new') fld('slug', slugify(e.target.value)); }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-white">Slug (URL) *</label>
                        <input
                            className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white font-mono text-sm"
                            value={form.slug || ''}
                            onChange={e => fld('slug', slugify(e.target.value))}
                        />
                        <p className="text-xs text-slate-400 mt-1">URL: /blog/<strong>{form.slug || 'post-slug'}</strong></p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-white">Author</label>
                        <input
                            className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white"
                            value={form.author || ''}
                            onChange={e => fld('author', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-white">Excerpt</label>
                        <textarea
                            rows="2"
                            className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white"
                            placeholder="Short summary shown in blog listing..."
                            value={form.excerpt || ''}
                            onChange={e => fld('excerpt', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-white">Cover Image</label>
                        <ImageUploader
                            value={form.image || ''}
                            onChange={url => fld('image', url)}
                            placeholder="Upload or paste image URL..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-white">Content</label>
                        <textarea
                            rows="14"
                            className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white font-mono text-sm"
                            placeholder="Write your blog post content here..."
                            value={form.content || ''}
                            onChange={e => fld('content', e.target.value)}
                        />
                    </div>
                    <label className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 cursor-pointer">
                        <input
                            type="checkbox"
                            className="size-5 rounded accent-primary"
                            checked={form.published || false}
                            onChange={e => fld('published', e.target.checked)}
                        />
                        <div>
                            <span className="font-bold dark:text-white">Published</span>
                            <p className="text-xs text-slate-500">If checked, this post will be visible on the public Blog page.</p>
                        </div>
                    </label>
                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Save Post</button>
                        <button onClick={() => { setEditingId(null); setForm({}); }} className="bg-slate-500 text-white px-6 py-2 rounded font-bold hover:bg-slate-600">Cancel</button>
                    </div>
                </div>
            ) : loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-3 block">article</span>
                    <p>No blog posts yet. Click <strong>+ New Post</strong> to create one.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map(post => (
                        <div key={post.id} className="flex flex-col sm:flex-row gap-3 p-4 border rounded-lg dark:border-neutral-700 items-start sm:items-center">
                            {post.image ? (
                                <img src={getImageUrl(post.image)} alt={post.title} className="w-full sm:w-16 sm:h-16 h-32 object-cover rounded-lg shrink-0" />
                            ) : (
                                <div className="w-full sm:w-16 sm:h-16 h-32 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-slate-400">article</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-bold dark:text-white truncate">{post.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${post.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">/blog/{post.slug} · {post.author}</p>
                            </div>
                            <div className="flex gap-2 sm:flex-col sm:justify-center w-full sm:w-auto">
                                <button onClick={() => startEdit(post)} className="flex-1 sm:flex-none px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium">Edit</button>
                                <button onClick={() => handleDelete(post.id)} className="flex-1 sm:flex-none px-4 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Admin;
