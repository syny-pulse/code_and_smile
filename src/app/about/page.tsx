'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContactFormPopup } from '@/components/ui/contactform';

// Scroll animation hook
function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold]);

  return { ref, isVisible };
}

// Icons
const HeartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default function About() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const heroAnimation = useScrollAnimation(0.1);
  const storyAnimation = useScrollAnimation(0.1);
  const missionAnimation = useScrollAnimation(0.1);
  const programsAnimation = useScrollAnimation(0.1);
  const valuesAnimation = useScrollAnimation(0.1);
  const teamAnimation = useScrollAnimation(0.1);
  const ctaAnimation = useScrollAnimation(0.1);

  const values = [
    {
      letter: 'S',
      title: 'Synergize Together',
      description: 'We rise, fall and rise again together.',
      color: '#267fc3',
    },
    {
      letter: 'M',
      title: 'Maverick Dreams',
      description: 'We dare to dream audaciously – even those that seem impossible.',
      color: '#ffc82e',
    },
    {
      letter: 'I',
      title: 'Innovation',
      description: 'We believe in every idea, the newer the better!',
      color: '#267fc3',
    },
    {
      letter: 'L',
      title: 'Limitless Potential',
      description: "We believe in everyone's abilities.",
      color: '#ffc82e',
    },
    {
      letter: 'E',
      title: 'Embrace All',
      description: 'We leave no one behind.',
      color: '#267fc3',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#267fc3]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#ffc82e]/10 rounded-full blur-3xl" />
        </div>

        <div
          ref={heroAnimation.ref}
          className={`container-custom relative z-10 transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-[#267fc3]">About Us</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-gray-900">We are a community of</span>
              <br />
              <span className="text-[#267fc3]">Youth </span>
              <span className="relative inline-block">
                <span className="relative z-10 text-[#267fc3]">for Youth</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#ffc82e]/40 -z-0" />
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Empowering rural youth with digital skills to compete in the global digital economy, one student at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-white">
        <div
          ref={storyAnimation.ref}
          className={`container-custom transition-all duration-1000 ${storyAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/cas-community.svg"
                  alt="Code and Smile Foundation Community"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#ffc82e] rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#267fc3]/10 rounded-full -z-10" />
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc82e]/20 rounded-full">
                <span className="text-sm font-semibold text-gray-700">Our Story</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Bridging the <span className="text-[#267fc3]">digital divide</span>
              </h2>

              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  The digital world is evolving rapidly. Tech skills are now vital for every job. While urban youth have access to digital skills, affordable internet, and electricity, these remain a luxury in rural areas.
                </p>
                <p>
                  At Code and Smile Foundation, we believe no one should be left behind. We advocate for equal opportunities for all youth in the digital economy, regardless of where they come from.
                </p>
                <p>
                  Founded in 2025 in Mpigi District, Uganda, we are on a mission to empower rural youth with the skills they need to thrive in the modern world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section-padding bg-[#f8fafc]">
        <div
          ref={missionAnimation.ref}
          className={`container-custom transition-all duration-1000 ${missionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-gradient-to-br from-[#267fc3] to-[#1a5a8a] rounded-3xl p-8 lg:p-12 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <HeartIcon />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                To empower rural youth with digital skills that unlock opportunities for employment, entrepreneurship, and community development in the global digital economy.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-[#ffc82e]/20 rounded-2xl flex items-center justify-center mb-6 text-[#ffc82e]">
                <LightbulbIcon />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                A world where every young person, regardless of their location, has equal access to digital opportunities and can participate fully in the global digital economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-padding bg-white">
        <div
          ref={programsAnimation.ref}
          className={`container-custom transition-all duration-1000 ${programsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc82e]/20 rounded-full mb-6">
              <span className="text-sm font-semibold text-gray-700">Our Programs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Transforming lives through <span className="text-[#267fc3]">targeted programs</span>
            </h2>
            <p className="text-xl text-gray-600">
              We run three flagship programs designed to reach different segments of rural youth.
            </p>
          </div>

          {/* Program Cards */}
          <div className="space-y-12 lg:space-y-16">
            {/* The Untapped Village Project */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/untapped-village.jpg"
                    alt="The Untapped Village Project"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#267fc3] rounded-2xl -z-10" />
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full">
                  <span className="text-sm font-semibold text-[#267fc3]">Flagship Program</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  The Untapped Village Project
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Skills out-of-school youth in highly sought-after digital skills. This intensive program provides comprehensive training in web development, digital marketing, graphics design, and project management, preparing young people for employment and entrepreneurship opportunities in the digital economy.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-sm font-medium">Web Development</span>
                  <span className="px-4 py-2 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-sm font-medium">Digital Marketing</span>
                  <span className="px-4 py-2 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-sm font-medium">Graphics Design</span>
                </div>
              </div>
            </div>

            {/* The Ignite Program */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc82e]/20 rounded-full">
                  <span className="text-sm font-semibold text-gray-700">Holiday Program</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  The Ignite Program
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Provides holiday makers - the next generation of digital changemakers - with digital literacy. During school breaks, young learners engage in fun, interactive sessions that build foundational digital skills, coding basics, and creative problem-solving abilities.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-[#ffc82e]/20 text-gray-700 rounded-full text-sm font-medium">Digital Literacy</span>
                  <span className="px-4 py-2 bg-[#ffc82e]/20 text-gray-700 rounded-full text-sm font-medium">Coding Basics</span>
                  <span className="px-4 py-2 bg-[#ffc82e]/20 text-gray-700 rounded-full text-sm font-medium">Creative Tech</span>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/ignite-program.jpg"
                    alt="The Ignite Program"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#ffc82e] rounded-2xl -z-10" />
              </div>
            </div>

            {/* School Outreaches Project */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/school-outreach.jpg"
                    alt="School Outreaches Project"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#267fc3]/20 rounded-full -z-10" />
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full">
                  <span className="text-sm font-semibold text-[#267fc3]">Mobile Learning</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  School Outreaches Project
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Makes school outreaches to bring digital education directly to rural schools. Through our mobile computer laboratories, we travel to partner schools, providing students with access to computers, internet, and hands-on digital skills training without requiring expensive infrastructure investments.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-sm font-medium">Mobile Labs</span>
                  <span className="px-4 py-2 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-sm font-medium">School Partnerships</span>
                  <span className="px-4 py-2 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-sm font-medium">Basic Computing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section-padding bg-white">
        <div
          ref={valuesAnimation.ref}
          className={`container-custom transition-all duration-1000 ${valuesAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-[#267fc3]">Our Team Values</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              We <span className="text-[#267fc3]">SMILE</span> together
            </h2>
            <p className="text-xl text-gray-600">
              Our core values guide everything we do at Code and Smile Foundation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-transparent hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${value.color}15`, color: value.color }}
                  >
                    <span className="text-4xl font-bold font-serif">{value.letter}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#267fc3] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ffc82e]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div
          ref={ctaAnimation.ref}
          className={`container-custom relative z-10 transition-all duration-1000 ${ctaAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Join us in making a <span className="text-[#ffc82e]">difference</span>
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Whether you want to volunteer, donate, or partner with us, there are many ways to support our mission.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn-secondary"
                onClick={() => window.open('https://yambaafrica.com/campaigns/CODE%20AND%20SMILE%20ACADEMY?id=8', '_blank')}
              >
                Support Our Mission
              </button>
              <button
                className="bg-white text-[#267fc3] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                onClick={() => setIsContactFormOpen(true)}
              >
                Get In Touch
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      <ContactFormPopup
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </div>
  );
}
