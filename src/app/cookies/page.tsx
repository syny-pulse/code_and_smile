'use client';

import Link from 'next/link';

export default function CookiesPolicy() {
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
                            Cookies <span className="text-[#267fc3]">Policy</span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Understanding how and why we use cookies on our website.
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We use cookies for the following purposes:
                                </p>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Essential Cookies</h3>
                                        <p className="text-gray-600">Necessary for the website to function properly, such as secure logins and session management.</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Performance Cookies</h3>
                                        <p className="text-gray-600">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Functional Cookies</h3>
                                        <p className="text-gray-600">Allow the website to remember choices you make (such as language or region) to provide enhanced features.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Managing Cookies</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Changes to This Policy</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We may update this Cookies Policy from time to time. We encourage you to periodically review this page for the latest information on our privacy practices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
