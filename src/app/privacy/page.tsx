'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-[#267fc3]/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#ffc82e]/10 rounded-full blur-3xl" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#267fc3]/10 rounded-full mb-6">
                            <span className="text-sm font-semibold text-[#267fc3]">Legal</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 text-gray-900">
                            Privacy <span className="text-[#267fc3]">Policy</span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            We value your trust and are committed to protecting your personal information.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 lg:py-24">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto prose prose-lg prose-blue">
                        <p className="text-gray-600 mb-8">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        <div className="space-y-12">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    CAS Academy ("we," "our," or "us"), a program of the Code and Smile Foundation, respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website or participate in our programs.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We may collect personal information that you voluntarily provide to us when you:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                    <li>Register for courses or programs</li>
                                    <li>Sign up for our newsletter</li>
                                    <li>Contact us via our website forms</li>
                                    <li>Make a donation</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    This information may include your name, email address, phone number, location, and educational background.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                                    <li>Provide, operate, and maintain our educational programs</li>
                                    <li>Improve, personalize, and expand our website and services</li>
                                    <li>Communicate with you, including updates, newsletters, and support</li>
                                    <li>Process donations and program registrations</li>
                                    <li>Analyze usage patterns to improve user experience</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    You have the right to access, update, or delete the personal information we hold about you. If you wish to exercise these rights, please contact us.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    If you have any questions about this Privacy Policy, please contact us at:{' '}
                                    <a href="mailto:info@casacademy.org" className="text-[#267fc3] hover:underline">
                                        info@casacademy.org
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
