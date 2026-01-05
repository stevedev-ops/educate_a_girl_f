import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import { getImageUrl } from '../api';
import { validateProduct, sanitizeText } from '../utils/validation';


const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('products');
    const { pendingReviews } = useContent();

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
                                    if (e.key === 'Enter') {
                                        if (password === 'admin123') setIsAuthenticated(true);
                                        else alert('Incorrect Password');
                                    }
                                }}
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (password === 'admin123') setIsAuthenticated(true);
                                else alert('Incorrect Password');
                            }}
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
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Educate A RURAL Girl Foundation - Content Management</p>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <span className="material-symbols-outlined text-xl">logout</span>
                        Logout
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
                        {['products', 'categories', 'gallery', 'stories', 'journey', 'team', 'programs', 'settings', 'messages', 'reviews'].map(tab => (
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

                    {/* Main Content Area */}
                    <div className="flex-1 bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                        {activeTab === 'products' && <ProductsEditor />}
                        {activeTab === 'categories' && <CategoriesEditor />}
                        {activeTab === 'gallery' && <GalleryEditor />}
                        {activeTab === 'stories' && <StoriesEditor />}

                        {activeTab === 'journey' && <JourneyEditor />}
                        {activeTab === 'team' && <TeamEditor />}
                        {activeTab === 'programs' && <ProgramsEditor />}
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
            <h2 className="text-xl font-bold mb-6 dark:text-white">Category Manager</h2>
            <div className="flex gap-4 mb-8">
                <input
                    className="flex-1 p-2 border rounded dark:bg-neutral-900 dark:text-white"
                    placeholder="Enter new category name..."
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="bg-secondary text-white px-6 py-2 rounded-lg font-bold">Add Category</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

    // Simple string array handling for images/details
    const handleArrayChange = (field, value) => {
        setFormData({ ...formData, [field]: value.split('\n') });
    };

    const handleSave = async () => {
        let savedId = editingId;

        // Auto-add tempImage if exists and user didn't click add
        let finalImages = formData.images || [];
        if (formData.tempImage) {
            finalImages = [...finalImages, formData.tempImage];
        }

        const productToSave = {
            ...formData,
            images: finalImages,
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
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">Shop Manager</h2>
                {!editingId && (
                    <button onClick={startNew} className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold">
                        + Add Product
                    </button>
                )}
            </div>

            {editingId ? (
                <div className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-2 gap-4">
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
                                                <img src={getImageUrl(img)} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
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
                    <div className="flex gap-2 pt-4">
                        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded font-bold">Save Product</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-6 py-2 rounded font-bold">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {allProducts.map(product => (
                        <div key={product.id} className="flex gap-4 p-4 border rounded-lg dark:border-neutral-700 items-center">
                            <img src={getImageUrl(product.images && product.images[0])} alt={product.name} className="w-16 h-16 object-cover rounded bg-gray-100" />
                            <div className="flex-1">
                                <h3 className="font-bold dark:text-white flex items-center gap-2">
                                    {product.name}
                                    {homeProductIds.includes(product.id) && <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded border border-primary/20">Featured</span>}
                                </h3>
                                <p className="text-sm text-gray-500">${product.price} - {product.category}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(product)} className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium">Edit</button>
                                <button onClick={() => deleteProduct(product.id)} className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium">Delete</button>
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
            <h2 className="text-xl font-bold mb-6 dark:text-white">Gallery Manager</h2>

            <div className="flex gap-4 mb-8">
                <div className="flex-1">
                    <ImageUploader value={newUrl} onChange={setNewUrl} placeholder="Enter URL or Upload..." />
                </div>
                <button onClick={handleAdd} className="bg-secondary text-white px-6 py-2 rounded-lg font-bold">Add Photo</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map(img => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square border dark:border-neutral-700">
                        <img src={getImageUrl(img.url)} className="w-full h-full object-cover" />
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">Stories Management</h2>
                <button
                    onClick={() => { setEditingId('new'); setFormData({ name: '', role: '', quote: '', image: '', featured: false }); }}
                    className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold"
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">Our Journey (About Us)</h2>
                <button
                    onClick={() => { setEditingIndex('new'); setFormData({ year: '', title: '', description: '' }); }}
                    className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold"
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
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Create</button>
                        <button onClick={() => setEditingIndex(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
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
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                                    <button onClick={() => setEditingIndex(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">Team Management</h2>
                <button
                    onClick={() => { setEditingId('new'); setFormData({ name: '', role: '', image: '' }); }}
                    className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold"
                >
                    + Add Team Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <img src={getImageUrl(member.image)} alt={member.name} className="size-12 rounded-full object-cover" />
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
                <button onClick={() => { setEditing('new'); setFormData({ title: '', description: '', features: [], image: '' }); }} className="bg-secondary text-white px-4 py-2 rounded-lg font-bold">+ New Program</button>
            </div>
            {editing && (
                <div className="space-y-4 mb-8 p-4 border rounded dark:border-neutral-700">
                    <input placeholder="Title" className="w-full p-2 border rounded dark:bg-neutral-900" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
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
                {['contact_info', 'home_hero', 'about_hero', 'impact_stats'].map(s => (
                    <button key={s} onClick={() => setSection(s)} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${section === s ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-neutral-700 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600'}`}>
                        {s.replace('_', ' ')}
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

export default Admin;
