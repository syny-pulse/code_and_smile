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
  </svg>
);

const MegaphoneIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <polyline points="12,6 12,12 16,14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" strokeWidth="2" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20,6 9,17 4,12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// Enrollment Popup Component
const EnrollmentPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-[#ffc82e]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockIcon />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Admissions Coming Soon!
          </h2>
          <p className="text-gray-600 mb-6">
            Admissions for the next intake are not yet open. Follow us on social media for updates on the official application opening dates.
          </p>
          <div className="flex gap-3 mb-6">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">Facebook</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">Instagram</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">Twitter</span>
          </div>
          <button
            onClick={onClose}
            className="w-full px-8 py-3 bg-[#267fc3] text-white font-semibold rounded-full hover:bg-[#1a5a8a] transition-all duration-300"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

const courseData = [
  {
    id: 1,
    title: 'Basic Computer Use',
    icon: <ComputerIcon />,
    color: '#267fc3',
    duration: '4 weeks',
    students: '10',
    description: 'Master the fundamentals of computer operations, internet navigation, and digital communication.',
    whyMatters: 'In today\'s digital world, basic computer literacy is the foundation for accessing information, communicating globally, and participating in the digital economy.',
    skills: [
      'Computer operation and file management',
      'Internet browsing and online safety',
      'Microsoft Office Suite (Word, Excel, PowerPoint)',
      'Email communication and digital etiquette',
      'Online research and information literacy',
    ],
    opportunities: [
      'Remote administrative work',
      'Online customer service roles',
      'Digital data entry positions',
      'Virtual assistant opportunities',
    ],
  },
  {
    id: 2,
    title: 'Digital Marketing',
    icon: <MegaphoneIcon />,
    color: '#ffc82e',
    duration: '6 weeks',
    students: '10',
    description: 'Learn to create compelling digital campaigns, manage social media presence, and drive online engagement.',
    whyMatters: 'Digital marketing is revolutionizing how businesses reach customers. These skills enable you to market local products globally and help businesses thrive online.',
    skills: [
      'Social media marketing strategy',
      'Content creation and storytelling',
      'Facebook and Instagram advertising',
      'Email marketing campaigns',
      'Analytics and performance tracking',
    ],
    opportunities: [
      'Social media manager',
      'Freelance digital marketing consultant',
      'Content creator',
      'Online marketplace seller',
    ],
  },
  {
    id: 3,
    title: 'Graphics Design',
    icon: <BrushIcon />,
    color: '#267fc3',
    duration: '8 weeks',
    students: '10',
    description: 'Create stunning visual content using professional design tools and principles.',
    whyMatters: 'Visual communication is essential in the digital age. Graphics design skills allow you to create professional materials and build personal brands.',
    skills: [
      'Adobe Photoshop and Illustrator',
      'Canva for quick designs',
      'Logo and brand identity design',
      'Print and digital media design',
      'Color theory and typography',
    ],
    opportunities: [
      'Freelance graphic designer',
      'Local business branding specialist',
      'Educational material designer',
      'Tourism marketing creative',
    ],
  },
  {
    id: 4,
    title: 'Web Development',
    icon: <CodeIcon />,
    color: '#ffc82e',
    duration: '12 weeks',
    students: '10',
    description: 'Build modern, responsive websites and web applications using cutting-edge technologies.',
    whyMatters: 'Web development is one of the most in-demand skills globally. It offers the highest earning potential and can be done remotely from anywhere.',
    skills: [
      'HTML, CSS, and JavaScript',
      'React.js and modern frameworks',
      'Node.js and backend development',
      'Database management',
      'Responsive web design',
    ],
    opportunities: [
      'Remote web developer positions',
      'Freelance website builder',
      'Local business digitization specialist',
      'Tech startup founder',
    ],
  },
];

export default function Courses() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isEnrollmentPopupOpen, setIsEnrollmentPopupOpen] = useState(false);

  const heroAnimation = useScrollAnimation(0.1);
  const overviewAnimation = useScrollAnimation(0.1);
  const ctaAnimation = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#267fc3]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#ffc82e]/10 rounded-full blur-3xl" />
        </div>

        <div
          ref={heroAnimation.ref}
          className={`container-custom relative z-10 transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full">
                <span className="text-sm font-semibold text-[#267fc3]">Our Courses</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-gray-900">Skills that</span>
                <br />
                <span className="text-[#267fc3]">transform </span>
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#267fc3]">futures</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-[#ffc82e]/40 -z-0" />
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                Comprehensive digital skills training designed specifically for rural youth to compete in the global digital economy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="btn-primary"
                  onClick={() => setIsEnrollmentPopupOpen(true)}
                >
                  Enroll Now
                  <ArrowRightIcon />
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <Image
                src="/learning.svg"
                alt="Students Learning"
                width={500}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="section-padding bg-[#f8fafc]">
        <div
          ref={overviewAnimation.ref}
          className={`container-custom transition-all duration-1000 ${overviewAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              4 Key <span className="text-[#267fc3]">Digital Skills</span> Areas
            </h2>
            <p className="text-xl text-gray-600">
              We support rural youth through intensive training in these essential digital skills.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseData.map((course, index) => (
              <div
                key={course.id}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-transparent hover:-translate-y-2 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${course.color}15`, color: course.color }}
                >
                  {course.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ClockIcon />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersIcon />
                    <span>{course.students}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Course Sections */}
      {courseData.map((course, index) => {
        const isEven = index % 2 === 0;

        return (
          <section key={course.id} className="section-padding bg-white">
            <div className="container-custom">
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                {/* Course Info Card */}
                <div className={`${!isEven ? 'lg:order-2' : ''}`}>
                  <div
                    className="rounded-3xl p-8 lg:p-12"
                    style={{ backgroundColor: `${course.color}10` }}
                  >
                    <div className="text-center space-y-6">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
                        style={{ backgroundColor: course.color, color: 'white' }}
                      >
                        {course.icon}
                      </div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        {course.title}
                      </h2>
                      <div
                        className="w-20 h-1 mx-auto rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div className="flex justify-center gap-8">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-gray-700">
                            <ClockIcon />
                            <span className="font-semibold">{course.duration}</span>
                          </div>
                          <p className="text-sm text-gray-500">Duration</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-gray-700">
                            <UsersIcon />
                            <span className="font-semibold">{course.students}</span>
                          </div>
                          <p className="text-sm text-gray-500">Students</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className={`space-y-6 ${!isEven ? 'lg:order-1' : ''}`}>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Why This Skill Matters</h3>
                    <p className="text-gray-600 leading-relaxed">{course.whyMatters}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">What You'll Learn</h3>
                    <ul className="space-y-2">
                      {course.skills.slice(0, 4).map((skill, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: `${course.color}20`, color: course.color }}
                          >
                            <CheckIcon />
                          </div>
                          <span className="text-gray-600">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Career Opportunities</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.opportunities.map((opp, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-full text-sm font-medium"
                          style={{ backgroundColor: `${course.color}15`, color: course.color === '#ffc82e' ? '#8a6d00' : course.color }}
                        >
                          {opp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

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
              Ready to start your <span className="text-[#ffc82e]">digital journey</span>?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join hundreds of rural youth who are already building their digital future. Our courses are designed to take you from beginner to job-ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn-secondary"
                onClick={() => setIsEnrollmentPopupOpen(true)}
              >
                Enroll for Next Cohort
              </button>
              <button
                className="bg-white text-[#267fc3] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                onClick={() => setIsContactFormOpen(true)}
              >
                Contact Us
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
      <EnrollmentPopup
        isOpen={isEnrollmentPopupOpen}
        onClose={() => setIsEnrollmentPopupOpen(false)}
      />
    </div>
  );
}
