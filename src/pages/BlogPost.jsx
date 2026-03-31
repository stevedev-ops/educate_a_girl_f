import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchBlogPostBySlug, fetchBlogPosts, getImageUrl } from '../api';
import SEO from '../components/SEO';
import { getRenderableBlocks, normalizeBlogPost, parseTags } from '../utils/blog';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const BlogPost = () => {
    const { slug } = useParams();
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
                const normalizedPost = normalizeBlogPost(data);
                setPost(normalizedPost);
                setLoading(false);
                // Fetch related posts
                fetchBlogPosts().then(all => {
                    const normalized = (Array.isArray(all) ? all : []).map(normalizeBlogPost);
                    const scored = normalized
                        .filter(p => p.slug !== slug)
                        .map((candidate) => {
                            let score = 0;
                            if (normalizedPost.category && candidate.category === normalizedPost.category) score += 3;
                            const sharedTags = parseTags(candidate.tags).filter((tag) => parseTags(normalizedPost.tags).includes(tag));
                            score += sharedTags.length * 2;
                            return { candidate, score };
                        })
                        .sort((a, b) => b.score - a.score || new Date(b.candidate.published_at) - new Date(a.candidate.published_at))
                        .map(({ candidate }) => candidate)
                        .slice(0, 3);
                    setRelated(scored);
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
                    <div className="space-y-8 text-slate-700 dark:text-slate-300">
                        {post.category || parseTags(post.tags).length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {post.category && (
                                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        {post.category}
                                    </span>
                                )}
                                {parseTags(post.tags).map((tag) => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        {getRenderableBlocks(post).length > 0 ? (
                            <div className="space-y-8">
                                {getRenderableBlocks(post).map((block, index) => {
                                    if (block.type === 'heading') {
                                        return (
                                            <h2 key={index} className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                                                {block.text}
                                            </h2>
                                        );
                                    }

                                    if (block.type === 'image') {
                                        return (
                                            <figure key={index} className="space-y-3">
                                                <img
                                                    src={getImageUrl(block.url)}
                                                    alt={block.caption || post.title}
                                                    className="w-full rounded-2xl object-cover shadow-sm"
                                                />
                                                {block.caption && (
                                                    <figcaption className="text-sm text-center text-slate-500 dark:text-slate-400">
                                                        {block.caption}
                                                    </figcaption>
                                                )}
                                            </figure>
                                        );
                                    }

                                    if (block.type === 'quote') {
                                        return (
                                            <blockquote key={index} className="border-l-4 border-primary pl-5 italic text-xl text-slate-600 dark:text-slate-300">
                                                {block.text}
                                            </blockquote>
                                        );
                                    }

                                    return (
                                        <p key={index} className="text-lg leading-relaxed">
                                            {block.text}
                                        </p>
                                    );
                                })}
                            </div>
                        ) : (
                            <em className="text-slate-400">No content yet.</em>
                        )}
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
