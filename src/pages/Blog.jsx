import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { getImageUrl } from '../api';

const Blog = () => {
    const { blogPosts } = useContent();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTag, setActiveTag] = useState('');

    // Only show published posts on public page
    const published = blogPosts.filter(p => p.published);

    // Collect all unique tags
    const allTags = [...new Set(published.flatMap(p => p.tags || []))];

    const filtered = published.filter(post => {
        const matchesSearch =
            !searchTerm ||
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !activeTag || (post.tags || []).includes(activeTag);
        return matchesSearch && matchesTag;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-primary/20 dark:via-neutral-900 dark:to-secondary/20 py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-base">edit_note</span>
                        Our Stories & Updates
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white leading-tight mb-6">
                        The EARG <span className="text-primary">Blog</span>
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                        News, stories of impact, program updates, and insights from the field — straight from the hearts of our team.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
                    <div className="relative w-full sm:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Search posts…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        />
                    </div>
                    {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveTag('')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${!activeTag ? 'bg-primary text-white' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-primary hover:text-primary'}`}
                            >
                                All
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${activeTag === tag ? 'bg-primary text-white' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-primary hover:text-primary'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Posts Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <span className="material-symbols-outlined text-6xl text-neutral-300 dark:text-neutral-600 mb-4 block">article</span>
                        <h2 className="text-xl font-bold text-neutral-500 dark:text-neutral-400">
                            {published.length === 0 ? 'No posts yet — check back soon!' : 'No posts match your search.'}
                        </h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Featured first post */}
                        {filtered.length > 0 && (
                            <Link
                                to={`/blog/${filtered[0].slug}`}
                                className="md:col-span-2 lg:col-span-3 group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex flex-col md:flex-row min-h-[300px]"
                            >
                                {filtered[0].cover_image ? (
                                    <div className="w-full md:w-1/2 h-56 md:h-auto overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                                        <img
                                            src={getImageUrl(filtered[0].cover_image)}
                                            alt={filtered[0].title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full md:w-1/2 h-56 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-6xl text-primary/40">article</span>
                                    </div>
                                )}
                                <div className="flex flex-col justify-center p-8">
                                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Featured</span>
                                    <h2 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                                        {filtered[0].title}
                                    </h2>
                                    {filtered[0].excerpt && (
                                        <p className="text-neutral-600 dark:text-neutral-300 mb-6 line-clamp-3">{filtered[0].excerpt}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">person</span>
                                            {filtered[0].author || 'EARG Team'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">calendar_today</span>
                                            {formatDate(filtered[0].created_at)}
                                        </span>
                                    </div>
                                    {(filtered[0].tags || []).length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {filtered[0].tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )}

                        {/* Rest of posts */}
                        {filtered.slice(1).map(post => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group rounded-2xl overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex flex-col"
                            >
                                {post.cover_image ? (
                                    <div className="h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                                        <img
                                            src={getImageUrl(post.cover_image)}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-5xl text-primary/30">article</span>
                                    </div>
                                )}
                                <div className="flex flex-col flex-1 p-6">
                                    {(post.tags || []).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {post.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <h2 className="text-lg font-black text-neutral-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-sm text-neutral-600 dark:text-neutral-300 flex-1 line-clamp-3 mb-4">{post.excerpt}</p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">person</span>
                                            {post.author || 'EARG Team'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                                            {formatDate(post.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* CTA */}
            <section className="bg-primary/5 dark:bg-primary/10 border-t border-primary/10 dark:border-primary/20 py-16 mt-16 text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-4 block">volunteer_activism</span>
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-4">Want to make a difference?</h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-md mx-auto">
                    Every donation helps us educate and empower rural girls.
                </p>
                <Link
                    to="/donate"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                    Donate Now
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
            </section>
        </div>
    );
};

export default Blog;
