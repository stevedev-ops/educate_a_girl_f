import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogPostBySlug, getImageUrl } from '../api';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchBlogPostBySlug(slug)
            .then(data => setPost(data))
            .catch(() => setError('Post not found.'))
            .finally(() => setLoading(false));
    }, [slug]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">Loading post…</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
                <span className="material-symbols-outlined text-7xl text-neutral-300 dark:text-neutral-600 mb-6">article</span>
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-3">Post Not Found</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mb-8">This blog post doesn't exist or has been removed.</p>
                <Link to="/blog" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Cover Image */}
            {post.cover_image && (
                <div className="w-full max-h-[480px] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                    <img
                        src={getImageUrl(post.cover_image)}
                        alt={post.title}
                        className="w-full h-full object-cover object-center"
                        style={{ maxHeight: '480px' }}
                    />
                </div>
            )}

            {/* Back link */}
            <div className="max-w-3xl mx-auto px-4 pt-10">
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-8"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    Back to Blog
                </Link>
            </div>

            {/* Article */}
            <article className="max-w-3xl mx-auto px-4 pb-24">
                {/* Tags */}
                {(post.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white leading-tight mb-6">
                    {post.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-5 text-sm text-neutral-500 dark:text-neutral-400 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-base">person</span>
                        </span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">{post.author || 'EARG Team'}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        {formatDate(post.created_at)}
                    </span>
                    {post.updated_at && post.updated_at !== post.created_at && (
                        <span className="flex items-center gap-1.5 text-xs italic">
                            <span className="material-symbols-outlined text-sm">update</span>
                            Updated {formatDate(post.updated_at)}
                        </span>
                    )}
                </div>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8 font-medium italic border-l-4 border-primary pl-5">
                        {post.excerpt}
                    </p>
                )}

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {(post.content || '').split('\n').map((para, idx) =>
                        para.trim() ? (
                            <p key={idx} className="mb-5 text-base leading-8">{para}</p>
                        ) : (
                            <div key={idx} className="mb-3" />
                        )
                    )}
                </div>

                {/* Footer CTA */}
                <div className="mt-16 p-8 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 text-center">
                    <span className="material-symbols-outlined text-4xl text-primary mb-3 block">volunteer_activism</span>
                    <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-2">Support Our Mission</h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mb-5 text-sm">Your donation helps us educate and empower rural girls.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            to="/donate"
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 text-sm"
                        >
                            Donate Now
                        </Link>
                        <Link
                            to="/blog"
                            className="bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 px-6 py-3 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors text-sm"
                        >
                            More Posts
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;
