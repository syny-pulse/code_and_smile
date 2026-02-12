'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const DonatePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [iframeHeight, setIframeHeight] = useState('700px');

    useEffect(() => {
        const campaignId = '8';
        const origin = 'https://yambaafrica.com';

        // Set a timeout to hide loader after 10 seconds as a fallback
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 10000);
        timeoutRef.current = timeoutId;

        // Listen for messages from the Yamba iframe (e.g., for height adjustments)
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== origin) return;

            const data = event.data;
            if (data && data.type === 'yamba-resize' && data.campaignId === campaignId) {
                if (data.height) {
                    setIframeHeight(`${data.height}px`);
                }
                // When we receive the first resize message, it means the script has loaded and rendered
                setIsLoading(false);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section for Donation */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-[#267fc3] via-[#1a5a8a] to-[#267fc3]">
                {/* Decorative Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ffc82e]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="container-custom relative z-10 text-center text-white">
                    <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                        Join us in bridging the <span className="text-[#ffc82e]">digital divide</span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
                        Together, we can create opportunities for rural youth to thrive in the digital economy.
                        A donation of $690 transforms a youth who has never touched a computer into employment ready in just 6 months.
                    </p>
                </div>
            </section>

            {/* Donation Form Section */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-4 lg:p-8">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Secure Donation</h2>
                                <p className="text-gray-500">Your contribution goes directly towards empowering rural youth with digital skills.</p>
                            </div>

                            {/* Donation Script Integration */}
                            <div className="relative min-h-[700px] w-full bg-white rounded-2xl overflow-hidden border border-gray-100">
                                {isLoading && (
                                    <div className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center p-8">
                                        <div className="w-16 h-16 border-4 border-[#267fc3]/10 border-t-[#267fc3] rounded-full animate-spin mb-6"></div>
                                        <div className="space-y-4 w-full max-w-md">
                                            <div className="h-4 bg-gray-100 rounded-full w-3/4 mx-auto animate-pulse"></div>
                                            <div className="h-4 bg-gray-100 rounded-full w-1/2 mx-auto animate-pulse"></div>
                                            <div className="mt-8 grid grid-cols-3 gap-4">
                                                <div className="h-12 bg-gray-50 rounded-xl animate-pulse"></div>
                                                <div className="h-12 bg-gray-50 rounded-xl animate-pulse"></div>
                                                <div className="h-12 bg-gray-50 rounded-xl animate-pulse"></div>
                                            </div>
                                            <div className="h-12 bg-gray-50 rounded-xl w-full animate-pulse mt-4"></div>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-8 animate-pulse font-medium tracking-wide">
                                            LOADING SECURE PAYMENT FORM...
                                        </p>
                                    </div>
                                )}

                                {loadError && (
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8">
                                        <div className="text-center">
                                            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load donation form</h3>
                                            <p className="text-gray-500 mb-6">Please use the direct link below to complete your donation.</p>
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`w-full transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                    id="yamba-donation-container"
                                >
                                    <iframe
                                        src="https://yambaafrica.com/embed/donate?campaignId=8"
                                        width="100%"
                                        height={iframeHeight}
                                        style={{ border: 'none', overflow: 'hidden', borderRadius: '8px' }}
                                        title="Yamba Africa Donation"
                                        loading="lazy"
                                        onLoad={() => {
                                            // Fallback for browsers/scripts that don't send resize messages immediately
                                            setTimeout(() => setIsLoading(false), 2000);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Fallback Donation Link Section */}
                            <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                                <p className="text-gray-600 mb-4">Having trouble loading the form?</p>
                                <Link
                                    href="https://yambaafrica.com/campaigns/CODE%20AND%20SMILE%20ACADEMY?id=8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#267fc3]/10 text-[#267fc3] rounded-xl font-semibold hover:bg-[#267fc3] hover:text-white transition-all group"
                                >
                                    Donate directly through Yamba
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="mt-8 text-center text-gray-400 text-xs">
                                <p>Protected by industry-standard encryption. Your payments are processed securely via Yamba Africa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges / Impact */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-[#267fc3] font-bold text-3xl mb-1">100%</div>
                            <p className="text-gray-500 text-sm italic">Goes to the mission</p>
                        </div>
                        <div className="text-center">
                            <div className="text-[#267fc3] font-bold text-3xl mb-1">Secure</div>
                            <p className="text-gray-500 text-sm italic">Encrypted payments</p>
                        </div>
                        <div className="text-center">
                            <div className="text-[#267fc3] font-bold text-3xl mb-1">Transparent</div>
                            <p className="text-gray-500 text-sm italic">Real-time impact</p>
                        </div>
                        <div className="text-center">
                            <div className="text-[#267fc3] font-bold text-3xl mb-1">Direct</div>
                            <p className="text-gray-500 text-sm italic">Empowering youth</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DonatePage;