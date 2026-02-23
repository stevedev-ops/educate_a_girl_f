import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogPosts, getImageUrl } from '../api';
import SEO from '../components/SEO';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const SkeletonPost = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow border border-slate-100 dark:border-slate-700 animate-pulse">
        <div className="aspect-[16/9] bg-slate-200 dark:bg-slate-700" />
        <div className="p-6 space-y-3">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </div>
    </div>
);

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchBlogPosts()
            .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filtered = posts.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        p.author?.toLowerCase().includes(search.toLowerCase())
    );

    const [featured, ...rest] = filtered;

    return (
        <div className="w-full">
            <SEO
                title="Blog – Stories & Updates | EARG"
                description="Read stories, news, and updates from Educate A Rural Girl. Discover the impact of education on rural girls in Kenya."
                keywords="blog, news, stories, education, rural girls, EARG, Kenya, impact"
            />

            {/* Hero */}
            <section className="relative py-24 px-4 bg-gradient-to-br from-primary/10 via-white to-secondary/5 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-secondary/10 rounded-full blur-3xl" />
                </div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                        <span className="material-symbols-outlined text-base">edit_note</span>
                        Our Blog
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                        Stories of <span className="text-primary">Hope</span> &amp; Change
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-10">
                        News, insights, and stories from the field. See how education is changing lives across rural Kenya.
                    </p>
                    {/* Search */}
                    <div className="relative max-w-lg mx-auto">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search posts…"
                            className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900 min-h-[50vh]">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonPost key={i} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-24">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">article</span>
                            <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                                {posts.length === 0 ? 'No blog posts yet.' : 'No posts match your search.'}
                            </h2>
                            {search && (
                                <button onClick={() => setSearch('')} className="mt-4 text-primary underline underline-offset-4 text-sm font-medium">
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Featured post */}
                            {featured && !search && (
                                <Link
                                    to={`/blog/${featured.slug}`}
                                    className="group flex flex-col lg:flex-row gap-0 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 mb-12 hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="lg:w-1/2 aspect-[16/9] lg:aspect-auto overflow-hidden">
                                        {featured.image ? (
                                            <img
                                                src={getImageUrl(featured.image)}
                                                alt={featured.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-7xl text-primary/40">article</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wide mb-4 w-fit">
                                            <span className="material-symbols-outlined text-sm">star</span>
                                            Featured
                                        </span>
                                        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                                            {featured.title}
                                        </h2>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">{featured.excerpt}</p>
                                        <div className="flex items-center gap-3 text-sm text-slate-400">
                                            <span className="material-symbols-outlined text-base">person</span>
                                            <span className="font-medium text-slate-600 dark:text-slate-300">{featured.author || 'EARG Team'}</span>
                                            <span>·</span>
                                            <span className="material-symbols-outlined text-base">calendar_today</span>
                                            <span>{formatDate(featured.published_at)}</span>
                                        </div>
                                        <span className="mt-6 inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                                            Read Article
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </span>
                                    </div>
                                </Link>
                            )}

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {(search ? filtered : rest).map(post => (
                                    <Link
                                        key={post.id}
                                        to={`/blog/${post.slug}`}
                                        className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                    >
                                        <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-700">
                                            {post.image ? (
                                                <img
                                                    src={getImageUrl(post.image)}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                                    <span className="material-symbols-outlined text-5xl text-primary/30">article</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                {formatDate(post.published_at)}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">{post.excerpt}</p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                    <span>{post.author || 'EARG Team'}</span>
                                                </div>
                                                <span className="inline-flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
                                                    Read
                                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 bg-slate-900 text-white text-center">
                <div className="max-w-2xl mx-auto">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4 block">volunteer_activism</span>
                    <h2 className="text-3xl font-black mb-4">Be Part of the Story</h2>
                    <p className="text-slate-400 mb-8">Every donation writes a new chapter in the lives of girls across rural Kenya.</p>
                    <Link
                        to="/donate"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
                    >
                        Donate Today
                        <span className="material-symbols-outlined">favorite</span>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Blog;
