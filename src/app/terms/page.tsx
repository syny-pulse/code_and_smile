'use client';

import Link from 'next/link';

export default function TermsOfService() {
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
                            Terms of <span className="text-[#267fc3]">Service</span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Please read these terms carefully before using our services.
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    By accessing or using the CAS Academy website and educational services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Educational Services</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    CAS Academy provides digital skills training and educational resources. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Conduct</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    When using our services, you agree not to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                    <li>Use the service for any illegal or unauthorized purpose</li>
                                    <li>Harass, abuse, or harm other users or staff</li>
                                    <li>Share account credentials or access others' accounts</li>
                                    <li>Distribute malicious code or interfere with our site's security</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    The content, features, and functionality of CAS Academy, including course materials, code, logos, and graphics, are the exclusive property of Code and Smile Foundation and are protected by copyright and other intellectual property laws.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    CAS Academy and Code and Smile Foundation shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Changes to Terms</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We reserve the right to replace or modify these Terms at any time. We will notify users of any significant changes by posting the new Terms on this page.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    If you have any questions about these Terms, please contact us at:{' '}
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
