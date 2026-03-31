import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useContent } from '../context/ContentContext';
import SEO from '../components/SEO';
import { sanitizeText } from '../utils/validation';

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
            // Sanitize all inputs before sending
            await sendContactMessage({
                name: sanitizeText(`${formData.firstName} ${formData.lastName}`),
                email: sanitizeText(formData.email),
                message: sanitizeText(formData.message)
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
                            {(info.facebook || info.instagram || info.twitter) && (
                                <div className="flex items-start gap-4">
                                    <div className="size-12 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
                                        <span className="material-symbols-outlined text-2xl">public</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Follow Us</h3>
                                        <div className="flex gap-4 mt-2">
                                            {info.facebook && (
                                                <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                                                </a>
                                            )}
                                            {info.instagram && (
                                                <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                                                </a>
                                            )}
                                            {info.twitter && (
                                                <a href={info.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
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
