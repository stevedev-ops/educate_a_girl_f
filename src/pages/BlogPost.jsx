import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchBlogPostBySlug, fetchBlogPosts, getImageUrl } from '../api';
import SEO from '../components/SEO';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        setLoading(true);
        setNotFound(false);
        fetchBlogPostBySlug(slug)
            .then(data => {
                if (!data || !data.id) { setNotFound(true); setLoading(false); return; }
                setPost(data);
                setLoading(false);
                // Fetch related posts
                fetchBlogPosts().then(all => {
                    setRelated((Array.isArray(all) ? all : []).filter(p => p.slug !== slug).slice(0, 3));
                }).catch(() => { });
            })
            .catch(() => { setNotFound(true); setLoading(false); });
    }, [slug]);

    if (loading) return (
        <div className="max-w-3xl mx-auto px-4 py-24 animate-pulse space-y-6">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="aspect-[16/9] bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />)}
            </div>
        </div>
    );

    if (notFound) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
            <span className="material-symbols-outlined text-7xl text-slate-300 dark:text-slate-600 mb-4">article</span>
            <h1 className="text-3xl font-black text-slate-700 dark:text-slate-300 mb-3">Post Not Found</h1>
            <p className="text-slate-400 mb-8">This post may have been removed or is not yet published.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Blog
            </Link>
        </div>
    );

    return (
        <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen">
            <SEO
                title={`${post.title} | EARG Blog`}
                description={post.excerpt || ''}
                keywords={`blog, ${post.title}, EARG, education, rural girls`}
            />

            {/* Hero Image */}
            {post.image && (
                <div className="w-full max-h-[480px] overflow-hidden">
                    <img
                        src={getImageUrl(post.image)}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <article className="flex-1 min-w-0">
                    {/* Back link */}
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-8 font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Blog
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-5">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">person</span>
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{post.author || 'EARG Team'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">calendar_today</span>
                            <span>{formatDate(post.published_at)}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                        {post.title}
                    </h1>

                    {/* Excerpt / Lead */}
                    {post.excerpt && (
                        <p className="text-xl text-slate-500 dark:text-slate-400 border-l-4 border-primary pl-5 mb-8 italic leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-a:text-primary prose-img:rounded-xl prose-p:leading-relaxed text-slate-700 dark:text-slate-300"
                        style={{ whiteSpace: 'pre-wrap', lineHeight: '1.9', fontSize: '1.07rem' }}
                    >
                        {post.content || <em className="text-slate-400">No content yet.</em>}
                    </div>

                    {/* Share */}
                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Share this post:</span>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-base">share</span>
                            Twitter
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-base">share</span>
                            Facebook
                        </a>
                    </div>
                </article>

                {/* Sidebar — Related Posts */}
                {related.length > 0 && (
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="sticky top-24">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">article</span>
                                More Posts
                            </h2>
                            <div className="space-y-5">
                                {related.map(p => (
                                    <Link
                                        key={p.id}
                                        to={`/blog/${p.slug}`}
                                        className="group flex gap-4 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                                    >
                                        {p.image ? (
                                            <img
                                                src={getImageUrl(p.image)}
                                                alt={p.title}
                                                className="w-20 h-16 object-cover rounded-lg shrink-0"
                                            />
                                        ) : (
                                            <div className="w-20 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-primary/50">article</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                                {p.title}
                                            </h3>
                                            <span className="text-xs text-slate-400">{formatDate(p.published_at)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="mt-8 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 text-center">
                                <span className="material-symbols-outlined text-4xl mb-3 block">volunteer_activism</span>
                                <h3 className="font-black text-lg mb-2">Support Our Mission</h3>
                                <p className="text-white/80 text-sm mb-4">Help educate a girl. Change a generation.</p>
                                <Link
                                    to="/donate"
                                    className="inline-block bg-white text-primary font-bold px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                                >
                                    Donate Now
                                </Link>
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default BlogPost;
