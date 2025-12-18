import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import SEO from '../components/SEO';

const About = () => {
    const { journey, team, stories, settings } = useContent();

    // Filter stories for the About page (non-featured ones, or just use specific logic if needed)
    const aboutStories = stories.filter(s => !s.featured);

    // Settings Default
    const hero = settings.about_hero || {
        title: "Empowering Rural Girls Since 2010",
        subtitle: "We are dedicated to building a sustainable future through education, compassion, and direct action."
    };

    return (
        <div className="w-full">
            <SEO
                title="About Us - Our Mission & Team | EARG"
                description="Learn about Educate A Rural Girl (EARG), our mission to empower women and girls in Tharaka Nithi County, and the passionate team behind our impact."
                keywords="about EARG, mission, vision, team, Tharaka Nithi, rural girl empowerment, Kenya NGO"
            />
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center min-h-[600px] px-4 py-20 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(6, 78, 59, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwKFTiczEuQ-ehaNvzkO0qYa5Fpt042FUrH6F_iB98KnOqubm8OucgrrJmEhPEQPPkUq2qX_DewL78K7U8g906fSO7biU00UWZyl_qpjje3fnZRKeVC4ryrGdiy8P1pZ1HgqgPW9gSf_ysE_vFNDqrAjCE87dDxzw9ucsOeCTu86MeHbIEaeVHZmZKSwcDO7_6ZldApz_18UOYlWUTKEDY8WEYPdDKdMSIZG1wBFPfAusA6y-LY88IKYxfdXrZ7Z-w6sL7w2hKLTA")' }}>
                <div className="max-w-4xl w-full text-center flex flex-col gap-6 animate-fade-in-up">
                    <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-sm">
                        {hero.title}
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
                        Connect, Empower, Transform.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <Link to="/donate" className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-lg text-base font-bold tracking-wide transition-all transform hover:scale-105 shadow-lg shadow-primary/30 flex items-center justify-center">
                            Support Our Cause
                        </Link>
                        <Link to="/shop" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white h-12 px-8 rounded-lg text-base font-bold tracking-wide transition-all hover:bg-secondary/20 hover:border-secondary/40 flex items-center justify-center">
                            Shop to Support
                        </Link>
                    </div>
                </div>
            </section>

            {/* Who We Are & Vision/Mission */}
            <section className="py-20 px-4 md:px-10 flex justify-center bg-background-light dark:bg-background-dark">
                <div className="max-w-[960px] flex flex-col gap-12 text-center">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-primary font-bold tracking-wider uppercase text-sm">About EARG</span>
                            <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Who We Are</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-normal leading-relaxed max-w-4xl mx-auto">
                            Educate A Rural Girl Organization (EARG) is a community-based organization that exists to empower women and girls from rural areas of Tharaka Nithi County to be agents of change in their communities while advocating for equality, inclusion, and sustainable development.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-4">
                        <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                                <span className="material-symbols-outlined text-3xl">visibility</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                A society where empowered rural women lead positive and sustainable change.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="size-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-6">
                                <span className="material-symbols-outlined text-3xl">flag</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                To educate, mentor, and inspire the community to create an ecosystem that supports the holistic development of girls, enabling them to realize their full potential.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 px-4 md:px-10 bg-white dark:bg-gray-900">
                <div className="max-w-[1100px] mx-auto">
                    <div className="flex flex-col gap-4 mb-12 text-center md:text-left">
                        <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold">Our Core Values</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl">
                            Our work is guided by five pillars that define our identity and our commitment to the community.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Innovative', icon: 'lightbulb', desc: 'We embrace new ideas to solve old problems.' },
                            { title: 'Integrity', icon: 'verified_user', desc: 'We operate with honesty and transparency.' },
                            { title: 'Impact', icon: 'ads_click', desc: 'We focus on tangible, lasting results.' },
                            { title: 'Inclusion', icon: 'diversity_3', desc: 'We leave no one behind.' },
                            { title: 'Inspiration', icon: 'auto_awesome', desc: 'We empower others to dream big.' }
                        ].map((value, idx) => (
                            <div key={idx} className="group flex flex-col gap-4 p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">{value.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-2">{value.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">{value.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Approach */}
            <section className="py-20 px-4 md:px-10 bg-background-light dark:bg-background-dark">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-secondary font-bold tracking-wider uppercase text-sm">How We Work</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Our Approach</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        <div className="flex gap-6">
                            <div className="shrink-0 size-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-3xl">campaign</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Advocacy on Gender Equality</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Through media, stakeholder engagement forums, Barazas, and mentorship in schools, we champion the rights of girls to education and equal opportunities.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="shrink-0 size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-3xl">savings</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Economic Empowerment</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    We build capacities of women in self-help groups in agribusiness, enabling them to generate sustainable income for their families.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="shrink-0 size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <span className="material-symbols-outlined text-3xl">health_and_safety</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">SRHR Awareness</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    In partnership with primary and tertiary institutions, we conduct Sexual and Reproductive Health Rights awareness to empower girls with knowledge.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="shrink-0 size-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <span className="material-symbols-outlined text-3xl">public</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Climate Change Action</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    We drive climate change awareness and adaptation initiatives to build resilience in rural communities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey */}
            <section className="py-20 px-4 md:px-10 bg-background-light dark:bg-background-dark">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">Our Journey</h2>
                    <div className="relative border-l-2 border-primary/20 ml-4 md:ml-auto md:mr-auto md:w-full space-y-12">
                        {journey.map((item, index) => (
                            <div key={index} className="relative pl-8 md:pl-0 md:flex md:justify-between md:items-center group">
                                <div className={`absolute -left-[9px] top-0 md:left-1/2 md:-translate-x-1/2 bg-background-light dark:bg-background-dark border-2 ${index % 2 === 0 ? 'border-primary' : 'border-secondary'} size-5 rounded-full z-10`}></div>

                                {index % 2 === 0 ? (
                                    <>
                                        <div className="md:w-[45%] md:text-right pr-8">
                                            <span className="text-primary font-bold text-xl block mb-1">{item.year}</span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                            <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                                        </div>
                                        <div className="hidden md:block md:w-[45%]"></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="hidden md:block md:w-[45%]"></div>
                                        <div className="md:w-[45%] md:text-left pl-8">
                                            <span className="text-secondary font-bold text-xl block mb-1">{item.year}</span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                            <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-20 px-4 bg-primary dark:bg-green-900 text-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-center mb-16">Our Impact</h2>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        <div className="flex gap-4">
                            <span className="material-symbols-outlined text-4xl shrink-0 opacity-80">groups</span>
                            <div>
                                <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95">
                                    Worked with <span className="font-bold underline decoration-secondary decoration-4 underline-offset-4">12 women groups</span> to increase awareness of gender equality among rural communities.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="material-symbols-outlined text-4xl shrink-0 opacity-80">trending_up</span>
                            <div>
                                <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95">
                                    Incubated <span className="font-bold underline decoration-secondary decoration-4 underline-offset-4">5 women groups</span> who continually receive training on financial literacy and value addition to improve income.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="material-symbols-outlined text-4xl shrink-0 opacity-80">school</span>
                            <div>
                                <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95">
                                    Reached <span className="font-bold underline decoration-secondary decoration-4 underline-offset-4">1,000 girls</span> (aged 9-16) with Sexual and Reproductive Health Rights (SRHR) awareness and issued sanitary care kits.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="material-symbols-outlined text-4xl shrink-0 opacity-80">campaign</span>
                            <div>
                                <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95">
                                    Advocated for gender equality through mainstream media (TV, Radio) and active participation in county-level policy forums.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/20 text-center">
                        <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95 max-w-3xl mx-auto">
                            <span className="font-bold">Climate Justice:</span> Disseminated adaptation measures such as production of climate-resilient crops and processing porridge flour from indigenous crops.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 px-4 md:px-10 bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold mb-4">Meet the Team</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">The passionate individuals working behind the scenes to make our mission a reality.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member) => (
                            <div key={member.id} className="group relative overflow-hidden rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-800">
                                <div className="aspect-square w-full overflow-hidden bg-gray-200">
                                    <img
                                        alt={`${member.name} - ${member.role} at EARG`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        src={member.image}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                                    <p className="text-sm text-primary font-medium">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Voices of Change */}
            <section className="py-20 px-4 md:px-10 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Voices of Change</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {aboutStories.map((story) => (
                            <div key={story.id} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm relative border border-gray-100 dark:border-gray-700">
                                <span className="material-symbols-outlined absolute top-6 left-6 text-4xl text-primary/20">format_quote</span>
                                <p className="text-gray-600 dark:text-gray-300 text-lg italic mb-6 relative z-10 pt-4">
                                    "{story.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                                        <img
                                            src={story.image}
                                            alt={`Portrait of ${story.name}`}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{story.name}</p>
                                        <p className="text-xs text-gray-500">{story.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shop for Good */}
            <section className="relative py-24 px-4 md:px-10 overflow-hidden bg-gray-900">
                <div className="absolute inset-0 z-0 bg-[#064e3b]">
                    <img
                        alt="A glimpse of our sustainable shop products"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvdGcxmyXzknxw_MCjBscVt9IIHhIqJfXUUqTLr98a5Aldzk_yyCH86E1_J1G3WrWCj1mU-PDid5CHR5_4p97xT_T6eL-MRGPjt-Y2IMmc2FSE9sDmjOxpFkAdzUjpnhGitTuhaVD47tvZo88qxoQnFUGMLK69uhfIsJ_QFVWAsfRwTC8Jy8pnDiDR3EzwxKj587Lc-cAsatIeeZ3SH1QKUe7fqwxQzDrJZmQfTTKf_lj2zPrDQVLROlxj7_A4F9cpxy4UBl2g9EY"
                        loading="lazy"
                    />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="text-white text-3xl md:text-5xl font-black mb-6">Shop for Good</h2>
                    <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                        Every purchase from our store directly funds our mission. Find sustainable goods that look great and do good.
                    </p>
                    <Link to="/shop" className="bg-secondary hover:bg-secondary/90 text-white h-12 px-8 rounded-lg text-base font-bold transition-transform hover:scale-105 shadow-lg shadow-secondary/30 flex items-center justify-center inline-flex">
                        Visit the Store
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
