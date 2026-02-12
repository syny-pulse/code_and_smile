'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ContactFormPopup } from '@/components/ui/contactform';

// Custom hook for scroll animations
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

// Animated counter hook
function useCountUp(end: number, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, shouldStart]);

  return count;
}

// Wave Separator Component
const WaveSeparator = ({ color = '#f8fafc', flip = false }) => (
  <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`}>
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="relative block w-full h-[60px] md:h-[80px]"
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        fill={color}
      />
    </svg>
  </div>
);

// Icons
const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ComputerIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
    <path d="M8 21h8M12 17v4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="16,18 22,12 16,6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="8,6 2,12 8,18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BrushIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 19l7-7 3 3-7 7-3-3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2l7.586 7.586" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MegaphoneIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" strokeWidth="2" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" strokeWidth="2" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 18h6M10 22h4M12 2v1M4.22 4.22l.71.71M1 12h1M4.22 19.78l.71-.71M12 23v-1M18.36 19.07l.71.71M23 12h-1M18.36 4.93l.71-.71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 9a3 3 0 11-6 0 5 5 0 1110 0c0 2-1 3.5-2 4.5-.5.5-1 1.5-1 2.5h-4c0-1-.5-2-1-2.5-1-1-2-2.5-2-4.5z" strokeWidth="2" />
  </svg>
);

const QuoteIcon = () => (
  <svg className="w-10 h-10 text-[#267fc3] opacity-20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const SchoolIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 14l9-5-9-5-9 5 9 5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 14l9-5v7.5M3 9v7.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CommunityIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Home() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  // Scroll animation refs
  const heroAnimation = useScrollAnimation(0.1);
  const aboutAnimation = useScrollAnimation(0.1);
  const approachAnimation = useScrollAnimation(0.1);
  const statsAnimation = useScrollAnimation(0.2);
  const programsAnimation = useScrollAnimation(0.1);
  const whyAnimation = useScrollAnimation(0.1);
  const testimonialsAnimation = useScrollAnimation(0.1);
  const ctaAnimation = useScrollAnimation(0.1);

  // Animated counters
  const studentsCount = useCountUp(154, 2000, statsAnimation.isVisible);
  const neverTouchedComputer = useCountUp(78, 1500, statsAnimation.isVisible);
  const coursesCount = useCountUp(4, 2000, statsAnimation.isVisible);
  const femaleParticipation = useCountUp(67, 1500, statsAnimation.isVisible);

  const programs = [
    {
      icon: <BriefcaseIcon />,
      title: 'Project Management',
      description: 'Essential project management skills including planning, execution, monitoring, and team collaboration.',
      color: '#267fc3',
    },
    {
      icon: <MegaphoneIcon />,
      title: 'Digital Marketing',
      description: 'Social media marketing, content creation, SEO basics, and online branding strategies.',
      color: '#ffc82e',
    },
    {
      icon: <BrushIcon />,
      title: 'Graphics Design',
      description: 'Create stunning visuals using Canva and Adobe Photoshop for professional-grade designs.',
      color: '#267fc3',
    },
    {
      icon: <CodeIcon />,
      title: 'Web Development',
      description: 'Build modern websites with HTML, CSS, JavaScript, React.js and Node.js frameworks.',
      color: '#ffc82e',
    },
  ];

  const testimonials = [
    {
      name: 'Elizabeth Aketch',
      role: 'Web Development Student',
      quote: 'The structured curriculum and hands-on projects helped me transition from a complete beginner to a confident web developer. The support from tutors is exceptional.',
      image: null,
    },
    {
      name: 'Ronald Ssebulime',
      role: 'Digital Marketing Student',
      quote: "I never thought I could learn digital marketing, but the interactive lessons make it easy. I'm now able to promote my family's business online effectively.",
      image: null,
    },
    {
      name: 'Gloria Asiimire',
      role: 'Graphics Design Student',
      quote: 'As someone with no tech background, I was worried about keeping up. The step-by-step approach and community support made all the difference!',
      image: null,
    },
  ];

  const whyDigitalSkills = [
    {
      icon: <BriefcaseIcon />,
      title: 'Employment Opportunities',
      description: 'Digital skills increase employability and open up a wide range of job opportunities in various industries globally.',
    },
    {
      icon: <LightbulbIcon />,
      title: 'Solve Community Problems',
      description: 'Create technology solutions that address local challenges, from agriculture to healthcare and education.',
    },
    {
      icon: <UsersIcon />,
      title: 'Empower the Next Generation',
      description: 'Equip youth with skills to become leaders and innovators, creating a ripple effect of positive change.',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#267fc3]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ffc82e]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#267fc3]/5 to-[#ffc82e]/5 rounded-full blur-3xl" />
        </div>

        <div
          ref={heroAnimation.ref}
          className={`container-custom relative z-10 py-20 transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full">
                <span className="w-2 h-2 bg-[#267fc3] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#267fc3]">Opportunities are everywhere. Access is not!</span>
              </div>

              <h1 className="font-extrabold leading-[1.1] tracking-tight">
                <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-900">Building Access to</span>
                <br />
                <span className="relative inline-block">
                  <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl relative z-10 text-[#267fc3]">Digital Opportunities</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-[#ffc82e]/40 -z-0" />
                </span>
              </h1>

              <p className="text-md sm:text-lg text-gray-600 max-w-lg leading-relaxed">
                Our work ensures that children, youth and women from Uganda's last mile rural areas have access to digital skills and tools to support them access opportunities for employment and entrepreneurship.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <button className="btn-primary group">
                    Explore Programs
                    <ArrowRightIcon />
                  </button>
                </Link>
                <button
                  className="btn-secondary"
                  onClick={() => window.open('https://yambaafrica.com/campaigns/CODE%20AND%20SMILE%20ACADEMY?id=8', '_blank')}
                >
                  <HeartIcon />
                  Support Our Mission
                </button>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              <div className="relative z-10">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#267fc3]/20">
                  <Image
                    src="/students.jpg"
                    alt="Students learning digital skills"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#267fc3]/20 to-transparent" />
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-[#267fc3] text-white rounded-2xl px-4 py-2 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                  <p className="text-sm font-semibold">100% Free</p>
                </div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute top-10 -right-10 w-40 h-40 bg-[#ffc82e]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#267fc3]/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Wave Separator */}
      <WaveSeparator color="#f8fafc" />

      {/* Impact Statistics */}
      <section className="bg-[#f8fafc] py-16 lg:py-20">
        <div
          ref={statsAnimation.ref}
          className={`container-custom transition-all duration-1000 ${statsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Impact over our <span className="text-[#267fc3]">first 6 months</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: studentsCount, suffix: '', label: 'Participants Reached', color: '#267fc3' },
              { number: neverTouchedComputer, suffix: '%', label: 'First Time Computer Interaction', color: '#ffc82e' },
              { number: femaleParticipation, suffix: '%', label: 'Female Participation', color: '#267fc3' },
              { number: coursesCount, suffix: '', label: 'Courses Offered', color: '#ffc82e' },
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 delay-${index * 100}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.number}{stat.suffix}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveSeparator color="#ffffff" flip />

      {/* About Section */}
      <section className="section-padding bg-white">
        <div
          ref={aboutAnimation.ref}
          className={`container-custom transition-all duration-1000 ${aboutAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc82e]/20 rounded-full">
                <span className="text-sm font-semibold text-gray-700">About Us</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Bridging the <span className="text-[#267fc3]">digital divide</span> for rural communities
              </h2>

              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  The digital world is evolving rapidly. Opportunities in the digital world are immense, but access is not evenly distributed. While urban communities have access to digital opportunities like skilling, affordable internet, and electricity, these remain a luxury in rural areas.
                </p>
                <p>
                  At Code and Smile Foundation, we work to remove all systematic barriers that prevent rural youth from accessing digital education and opportunities.
                </p>
              </div>
              <Link href="/about">
                <button className="btn-outline mt-4">
                  Learn More About Us
                  <ArrowRightIcon />
                </button>
              </Link>
            </div>

            {/* Right - Visual */}
            <div className="relative order-1 lg:order-2">
              <div className="relative">
                {/* Main card */}
                <div className="bg-gradient-to-br from-[#267fc3] to-[#1a5a8a] rounded-3xl p-8 lg:p-12 text-white">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-6">Our Mission</h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-8">
                    To empower rural youth with digital skills that unlock opportunities for employment, entrepreneurship, and community development in the global digital economy.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-3xl font-bold text-[#ffc82e]">2025</div>
                      <p className="text-white/80 text-sm">Founded</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-3xl font-bold text-[#ffc82e]">Uganda</div>
                      <p className="text-white/80 text-sm">Mpigi District</p>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#ffc82e] rounded-2xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#267fc3]/10 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Digital Skills Section */}
      <section className="section-padding bg-white">
        <div
          ref={whyAnimation.ref}
          className={`container-custom transition-all duration-1000 ${whyAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#ffc82e]/20 to-[#267fc3]/10 rounded-3xl p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">The Digital Opportunity</h3>
                <div className="space-y-4">
                  {[
                    { stat: '80%', text: 'of jobs require digital skills' },
                    { stat: '3x', text: 'higher earning potential' },
                    { stat: '70%', text: 'of youth in rural areas are NEET' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-[#267fc3]">{item.stat}</div>
                      <p className="text-gray-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full">
                <span className="text-sm font-semibold text-[#267fc3]">Why Digital Skills?</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                The key to <span className="text-[#ffc82e]">unlocking</span> opportunities
              </h2>

              <div className="space-y-6">
                {whyDigitalSkills.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-14 h-14 bg-[#267fc3]/10 rounded-xl flex items-center justify-center text-[#267fc3]">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="section-padding bg-gradient-to-b from-white to-[#f8fafc]">
        <div
          ref={approachAnimation.ref}
          className={`container-custom transition-all duration-1000 ${approachAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-[#267fc3]">Our Approach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Two pathways to <span className="text-[#267fc3]">digital empowerment</span>
            </h2>
            <p className="text-xl text-gray-600">
              We deliver digital skills training through innovative models designed for rural communities.
            </p>
          </div>

          {/* Pathways */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* For Schools */}
            <div className="group bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#267fc3]/20 hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#267fc3] to-[#1a5a8a] rounded-2xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                  <SchoolIcon />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">For Young Learners</h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-[#267fc3] to-[#ffc82e] rounded-full" />
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Most schools in rural areas do not have the right infrastructure to provide digital skills. We deliver digital skills training through <span className="font-semibold text-[#267fc3]">mobile computer laboratories</span> that travel to partner schools.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#267fc3]/10 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#267fc3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Access to computers, internet, and hands-on learning without expensive ICT infrastructure</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#267fc3]/10 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#267fc3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Practical digital education including basic computing and applied learning projects</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#267fc3]/10 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#267fc3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Introductory robotics and IoT concepts for future innovators</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[#267fc3] font-semibold">
                  <span>Mobile Learning Labs</span>
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* For Communities */}
            <div className="group bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#ffc82e]/20 hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#ffc82e] to-[#e6b029] rounded-2xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                  <CommunityIcon />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">For Out-of-School Youth</h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-[#ffc82e] to-[#267fc3] rounded-full" />
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                We operate <span className="font-semibold text-[#ffc82e]">community innovation hubs</span> that provide free access to computers, internet, electricity, and trainers for out-of-school youth.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#ffc82e]/10 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#ffc82e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Free access to computers, internet, and electricity in community spaces</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#ffc82e]/10 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#ffc82e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Intensive skills and entrepreneurship programs for job-ready competencies</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#ffc82e]/10 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#ffc82e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Develop technology-based solutions to address local challenges</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[#ffc82e] font-semibold">
                  <span>Innovation Hubs</span>
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
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
          {/* Header */}
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

          {/* Program Cards - 3 Column Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* The Untapped Village Project */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#267fc3]/20 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/untapped-village.jpg"
                  alt="The Untapped Village Project"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#267fc3] rounded-full mb-2">
                    <span className="text-xs font-semibold text-white">Flagship Program</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  The Untapped Village Project
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Skills out-of-school youth in highly sought-after digital skills. This intensive program provides comprehensive training in web development, digital marketing, graphics design, and project management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-xs font-medium">Web Development</span>
                  <span className="px-3 py-1.5 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-xs font-medium">Digital Marketing</span>
                  <span className="px-3 py-1.5 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-xs font-medium">Graphics Design</span>
                </div>
              </div>
            </div>

            {/* The Ignite Program */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#ffc82e]/20 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/school-outreach.jpg"
                  alt="The Ignite Program"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ffc82e] rounded-full mb-2">
                    <span className="text-xs font-semibold text-gray-900">Early Skilling</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  The Ignite Program
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We deploy mobile labs to skill school children - the next generation of digital changemakers - with digital literacy. Young learners engage in fun, interactive sessions that build foundational digital skills.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-[#ffc82e]/20 text-gray-700 rounded-full text-xs font-medium">Digital Literacy</span>
                  <span className="px-3 py-1.5 bg-[#ffc82e]/20 text-gray-700 rounded-full text-xs font-medium">Mobile Labs</span>
                  <span className="px-3 py-1.5 bg-[#ffc82e]/20 text-gray-700 rounded-full text-xs font-medium">School Partnerships</span>
                </div>
              </div>
            </div>

            {/* Digital Financial Literacy */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#267fc3]/20 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/digital-financial-literacy.jpg"
                  alt="School Outreaches Project"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#267fc3] rounded-full mb-2">
                    <span className="text-xs font-semibold text-white">Financial Literacy</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Digital Financial Literacy
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We build and deploy digital tools to support youth and women entreprenuers leverage technology to improve efficiency, access financing and scale their businesses to support informal unbankable businesses access financial services.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-xs font-medium">Digital Literacy</span>
                  <span className="px-3 py-1.5 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-xs font-medium">Financial Literacy</span>
                  <span className="px-3 py-1.5 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-xs font-medium">Entreprenuership Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialization Pathways Section */}
      <section className="section-padding bg-[#f8fafc]">
        <div
          className={`container-custom transition-all duration-1000`}
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-[#267fc3]">Specialization Pathways</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Skills that <span className="text-[#267fc3]">transform</span> futures
            </h2>
            <p className="text-xl text-gray-600">
              We support rural youth through intensive training in four key digital skill areas.
            </p>
          </div>

          {/* Program Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-transparent hover:-translate-y-2"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${program.color}15`, color: program.color }}
                >
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                <p className="text-gray-600 leading-relaxed">{program.description}</p>
                <div
                  className="mt-6 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ backgroundColor: program.color }}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/courses">
              <button className="btn-primary">
                View All Courses
                <ArrowRightIcon />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gradient-to-b from-white to-[#f8fafc]">
        <div
          ref={testimonialsAnimation.ref}
          className={`container-custom transition-all duration-1000 ${testimonialsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc82e]/20 rounded-full mb-6">
              <span className="text-sm font-semibold text-gray-700">Student Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Hear from our <span className="text-[#267fc3]">students</span>
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real students whose lives are being transformed.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 relative"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6">
                  <QuoteIcon />
                </div>

                {/* Content */}
                <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#267fc3] to-[#ffc82e] flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#267fc3] relative overflow-hidden">
        {/* Background elements */}
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
              Join us in bridging the <span className="text-[#ffc82e]">digital divide</span>
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Together, we can create opportunities for rural youth to thrive in the digital economy. A donation of $690 transforms a youth who has never touched a computer into employment ready in just 6 months.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn-secondary"
                onClick={() => window.open('https://yambaafrica.com/campaigns/CODE%20AND%20SMILE%20ACADEMY?id=8', '_blank')}
              >
                <HeartIcon />
                Donate Now
              </button>
              <button
                className="bg-white text-[#267fc3] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1"
                onClick={() => setIsContactFormOpen(true)}
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Popup */}
      <ContactFormPopup
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </div>
  );
}
