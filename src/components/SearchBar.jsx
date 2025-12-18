import { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchQuery) => {
        if (searchQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://eduacate-a-girl-b.onrender.com/api/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data.message === 'success') {
                setResults(data.data);
                setIsOpen(true);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <input
                    type="search"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className="flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <img
                                        src={product.images && JSON.parse(product.images)[0]}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                        loading="lazy"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{product.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
                                        {product.stock <= 0 && (
                                            <p className="text-xs text-red-600 font-bold">Out of Stock</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">No products found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
