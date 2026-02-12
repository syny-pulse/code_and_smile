'use client';

import { useState, useEffect, useRef } from 'react';

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
const LocationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const heroAnimation = useScrollAnimation(0.1);
  const cardsAnimation = useScrollAnimation(0.1);
  const formAnimation = useScrollAnimation(0.1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setShowThankYou(true);
      } else {
        const errorData = await response.json();
        console.error('Submission error:', errorData);
        alert('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <LocationIcon />,
      title: 'Visit Us',
      content: 'Mayembe Upper Village, Mpigi District, Uganda',
      color: '#267fc3',
    },
    {
      icon: <EmailIcon />,
      title: 'Email Us',
      content: 'info@casacademy.org',
      subtext: 'We respond within 24 hours',
      color: '#ffc82e',
    },
    {
      icon: <PhoneIcon />,
      title: 'Call Us',
      content: '+256 752 627003',
      subtext: 'Mon - Fri, 8AM - 6PM',
      color: '#267fc3',
    },
  ];

  // Thank You Modal
  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[#267fc3]/10 to-[#ffc82e]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#267fc3] to-[#1a5a8a] rounded-2xl flex items-center justify-center text-white">
              <CheckIcon />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Your message has been sent successfully. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setShowThankYou(false)}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

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
              <span className="text-sm font-semibold text-[#267fc3]">Contact Us</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-gray-900">Get in touch with</span>
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-[#267fc3]">Code and Smile Foundation</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#ffc82e]/40 -z-0" />
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about our courses? Want to partner with us? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="section-padding bg-[#f8fafc]">
        <div
          ref={cardsAnimation.ref}
          className={`container-custom transition-all duration-1000 ${cardsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-transparent hover:-translate-y-2 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${info.color}15`, color: info.color }}
                >
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                <p className="text-gray-700 font-medium mb-1">{info.content}</p>
                {info.subtext && <p className="text-sm text-gray-500">{info.subtext}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div
          ref={formAnimation.ref}
          className={`container-custom transition-all duration-1000 ${formAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-4xl mx-auto">
            {/* Form */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Send Us a Message</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#267fc3] to-[#ffc82e] mx-auto rounded-full" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#267fc3]/20 focus:border-[#267fc3] transition-all bg-white hover:border-gray-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#267fc3]/20 focus:border-[#267fc3] transition-all bg-white hover:border-gray-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#267fc3]/20 focus:border-[#267fc3] transition-all bg-white hover:border-gray-300"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#267fc3]/20 focus:border-[#267fc3] transition-all resize-none bg-white hover:border-gray-300"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <SendIcon />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#267fc3] to-[#1a5a8a] rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Code and Smile Foundation</h3>
                <p className="text-white/90 leading-relaxed mb-6">
                  Empowering rural youth with digital skills to compete in this generation's digital economy.
                </p>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Our Mission</h4>
                  <p className="text-white/80 leading-relaxed">
                    We believe that every young person deserves access to quality digital education. Our programs bridge the digital divide for rural communities.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Why Choose Code and Smile Foundation?</h4>
                <ul className="space-y-4">
                  {[
                    'Small class sizes for personalized attention',
                    'Hands-on practical training approach',
                    'Industry-relevant curriculum',
                    'Career guidance and job placement support',
                    'Community-focused learning environment',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#267fc3]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-[#267fc3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
