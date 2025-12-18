import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import SEO from '../components/SEO';

const Programs = () => {
    const { programs } = useContent();


    return (
        <div className="w-full">
            <SEO
                title="Our Programs - Education & Empowerment | EARG"
                description="Explore our initiatives including gender equality advocacy, economic empowerment, SRHR awareness, and climate action in rural Kenya."
                keywords="programs, initiatives, education, gender equality, climate action, empowerment, EARG, Kenya"
            />
            {/* Hero Section */}
            <section className="relative py-20 px-4 md:px-10 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Eager students in a rural classroom raising hands"
                        className="w-full h-full object-cover opacity-30"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeNpgQ1Z-gZk5SLrWR-scqmjnywuWx-1KRnrSG-RIgARm8zqgSfGY1A9KWvuq7T1_Q-7BuVdcUqz_-OSmaPS8WQT4l3GAz0wyHqlpi_tejkH1uQCzNm59MF2ecybxjoIWyMTSchwkdYu9P3WQ3bnk88dTL1lcfAMdXhHzIsqc1tHJatVvauur28mZ8TcNh-OdnK6k-cfTkXmUo4iuldRV6_cZBYlF83XAnvzj0082bixaRBHr2bDptJtCMtEMEni3wbcMpFErDS1E"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Our Initiatives
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        We don't just hope for a better future; we build it. From classrooms to community centers, our programs are designed to create lasting, sustainable change.
                    </p>
                </div>
            </section>

            {/* Dynamic Programs List */}
            {programs.map((program, index) => (
                <section key={program.id} className={`py-20 px-4 md:px-10 ${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div className={`order-2 ${index % 2 === 0 ? 'lg:order-1' : ''}`}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-wider border border-primary/20 mb-6">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                Initiative
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">{program.title}</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed bg-transparent">{program.description}</p>

                            {program.features && program.features.length > 0 && (
                                <>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Key Features:</h3>
                                    <ul className="space-y-3 mb-8">
                                        {program.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            <Link to="/donate" className="inline-flex items-center gap-2 text-primary font-bold hover:underline group">
                                Support this Program <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                        <div className={`order-1 ${index % 2 === 0 ? 'lg:order-2' : ''} rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]`}>
                            <img
                                alt={`Illustration for ${program.title} initiative`}
                                className="w-full h-full object-cover"
                                src={program.image}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Programs;
