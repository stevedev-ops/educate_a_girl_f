import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('products');
    const { pendingReviews } = useContent();

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] py-20 px-4">
                <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <h1 className="text-2xl font-bold mb-6 text-center text-neutral-900 dark:text-white">Admin Access</h1>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-neutral-300">Password</label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-neutral-300 px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white"
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
                            className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary-dark">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Admin Dashboard</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
                    {['products', 'categories', 'gallery', 'stories', 'journey', 'team', 'programs', 'settings', 'messages', 'reviews'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                                }`}
                        >
                            {tab.replace('_', ' ').charAt(0).toUpperCase() + tab.replace('_', ' ').slice(1)}
                            {tab === 'reviews' && pendingReviews.length > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingReviews.length}</span>
                            )}
                        </button>
                    ))}
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="mt-8 text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        Logout
                    </button>
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

        // Strip UI-only fields if needed, but API ignores extras
        if (editingId === 'new') {
            savedId = await addProduct(productToSave);
        } else {
            await updateProduct(productToSave);
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
        const p = { ...product, isHomeFeatured: homeProductIds.includes(product.id) };
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
                            <label className="block text-sm font-bold mb-1 dark:text-white">Image URLs (One per line)</label>
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
                            <textarea rows="3" className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white" value={formData.images ? formData.images.join('\n') : ''} onChange={e => handleArrayChange('images', e.target.value)} />
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
                            <img src={product.images && product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded bg-gray-100" />
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
                        <img src={img.url} className="w-full h-full object-cover" />
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
                                <img src={member.image} alt={member.name} className="size-12 rounded-full object-cover" />
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

    // Helper to render form fields based on section
    const renderForm = () => {
        const data = settings[section] || {};
        return (
            <div className="space-y-4">
                {Object.keys(data).map(key => (
                    <div key={key}>
                        <label className="block text-sm font-bold capitalize mb-1 dark:text-white">{key.replace('_', ' ')}</label>
                        {typeof data[key] === 'string' || typeof data[key] === 'number' ? (
                            <input className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white"
                                value={data[key]}
                                onChange={e => updateSetting(section, { ...data, [key]: e.target.value })}
                            />
                        ) : null}
                        {/* Complex objects like stats array require more complex UI, skipping for simplicity or simplified to JSON string area */}
                    </div>
                ))}
                {section === 'impact_stats' && (
                    <p className="text-sm text-gray-500">Note: Stats are complex objects. Ideally implemented with list editor. For now, use Seed Data.</p>
                )}
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-6 dark:text-white">General Settings</h2>
            <div className="flex gap-2 mb-6">
                {['contact_info', 'home_hero', 'about_hero', 'impact_stats'].map(s => (
                    <button key={s} onClick={() => setSection(s)} className={`px-4 py-2 rounded-lg font-medium ${section === s ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-neutral-700 dark:text-white'}`}>
                        {s.replace('_', ' ')}
                    </button>
                ))}
            </div>
            <div className="p-4 border rounded dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                {settings[section] ? renderForm() : <p>Loading...</p>}
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
