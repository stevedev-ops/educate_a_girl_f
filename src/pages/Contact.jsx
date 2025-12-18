import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useContent } from '../context/ContentContext';
import SEO from '../components/SEO';

const Contact = () => {
    const { settings, sendContactMessage } = useContent();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
    const [errors, setErrors] = useState({});

    const info = settings.contact_info || {
        address: "123 Charity Lane, Education City\nNairobi, Kenya",
        email: "hello@educateruralgirl.org",
        phone: "+254 700 123 456"
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            await sendContactMessage({
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                message: formData.message
            });

            setSubmitted(true);
            toast.success("Thank you! We'll get back to you soon.", { duration: 5000 });

            setTimeout(() => {
                setSubmitted(false);
                setFormData({ firstName: '', lastName: '', email: '', message: '' });
            }, 2000);
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <SEO
                title="Contact Us - Get in Touch | EARG"
                description="Have questions about our programs? Want to volunteer? Contact EARG to learn how you can help empower rural girls through education."
                keywords="contact, volunteer, donate, support, EARG, education, help"
            />
            <section className="relative py-20 px-4 md:px-10 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
                    <div>
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Get in Touch</span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">We'd love to hear from you</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                            Have questions about our programs? Want to volunteer? Or just want to say hello? Fill out the form or reach us at our headquarters.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-2xl">location_on</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Our Office</h3>
                                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">{info.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                    <span className="material-symbols-outlined text-2xl">mail</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Email Us</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{info.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                    <span className="material-symbols-outlined text-2xl">call</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Call Us</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{info.phone}<br />Mon-Fri from 8am to 5pm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">First Name</span>
                                    <input
                                        required
                                        type="text"
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all`}
                                        placeholder="Jane"
                                        value={formData.firstName}
                                        onChange={e => { setFormData({ ...formData, firstName: e.target.value }); setErrors({ ...errors, firstName: '' }); }}
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </label>
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Last Name</span>
                                    <input
                                        required
                                        type="text"
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all`}
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={e => { setFormData({ ...formData, lastName: e.target.value }); setErrors({ ...errors, lastName: '' }); }}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                </label>
                            </div>
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Email Address</span>
                                <input
                                    required
                                    type="email"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all`}
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={e => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Message</span>
                                <textarea
                                    required
                                    rows="4"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all resize-none`}
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={e => { setFormData({ ...formData, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                                ></textarea>
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                            </label>
                            <button
                                disabled={loading || submitted}
                                className={`w-full font-bold py-4 rounded-lg shadow-lg transition-all transform ${loading || submitted
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary-dark hover:shadow-xl active:scale-[0.98] text-white'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                        Sending...
                                    </span>
                                ) : submitted ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Sent!
                                    </span>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
