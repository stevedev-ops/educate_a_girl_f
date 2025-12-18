import React, { useState, useEffect } from 'react';
import { fetchGallery } from '../api';
import SEO from '../components/SEO';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGallery().then(data => {
            setImages(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="w-full">
            <SEO
                title="Gallery - See Our Impact | EARG"
                description="Browse through our gallery to see the real-world impact of our programs in rural Kenya. Every photo tells a story of transformation and hope."
                keywords="gallery, photos, impact, education, rural girls, EARG, community"
            />
            <section className="py-20 px-4 md:px-10 bg-background-light dark:bg-background-dark text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Gallery of Impact</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        See the smiles, the hard work, and the real change happening on the ground. A picture is worth a thousand words, and each of these tells a story of hope.
                    </p>
                </div>
            </section>

            <section className="px-4 md:px-10 pb-20">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {images.map((img, index) => (
                            <div key={img.id || index} className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group relative aspect-[4/3]">
                                <img
                                    src={img.url}
                                    alt={img.caption || `Gallery image showing community impact ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                                    <p className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {img.caption || "Community Impact"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="py-20 px-4 md:px-10 bg-slate-900 text-white">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="material-symbols-outlined text-6xl text-primary mb-6">format_quote</span>
                    <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                        "The most beautiful thing in the world is to see a person smiling. And knowing you are the reason behind that smile."
                    </h2>
                    <p className="text-xl text-slate-400 font-medium">- Anonymous Volunteer</p>
                </div>
            </section>
        </div>
    );
};

export default Gallery;
