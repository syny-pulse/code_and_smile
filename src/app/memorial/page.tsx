'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function MemorialPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-b from-blue-50/50 to-white">
                <div className="container-custom mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc82e]/20 rounded-full mb-8 animate-fade-in-up">
                            <span className="w-2 h-2 bg-[#ffc82e] rounded-full animate-pulse" />
                            <span className="text-sm font-semibold text-gray-800 uppercase tracking-wider">A Tribute by Sinai Kukiriza</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up delay-100">
                            In Loving Memory of <span className="text-[#267fc3]">Bruce Tushabe</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 font-medium mb-12 animate-fade-in-up delay-200">
                            The Heart Behind Code and Smile Foundation
                        </p>

                        <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 mb-12 animate-fade-in-up delay-300">
                            <div className="absolute inset-0 bg-[#267fc3]/10 rounded-full blur-2xl transform scale-110" />
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                                <Image
                                    src="/bruce.png"
                                    alt="Bruce Tushabe"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="pb-20">
                <div className="container-custom mx-auto px-4 max-w-4xl">
                    <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
                        <p className="mb-8 text-xl text-gray-800 font-medium border-l-4 border-[#267fc3] pl-6 italic">
                            "In 2019, a stranger said 'yes' to a desperate O'level graduate with big dreams and empty pockets."
                        </p>

                        <div className="space-y-6">
                            <p>
                                <span className="font-bold text-[#267fc3]">Bruce Tushabe</span> didn't just lend a laptop—he opened a door to possibility, becoming a mentor, friend, and the first customer to a young entrepreneur finding his way.
                            </p>

                            <p>
                                Bruce taught his mentee to print that first "Hello World" with a big smile, walking beside him through every breakthrough and moment of doubt. He showed opportunities and revealed pathways to futures once only dreamed about. He asked for nothing in return.
                            </p>

                            <p>
                                When Bruce passed away, one question remained: <span className="text-gray-900 font-semibold">How do you honor a man who gave everything and asked for nothing?</span>
                            </p>

                            <div className="bg-blue-50 p-8 rounded-2xl my-8 border border-blue-100">
                                <h3 className="text-2xl font-bold text-[#267fc3] mb-4">The Answer: Pay it Forward.</h3>
                                <p>
                                    <span className="font-bold">Code and Smile Foundation</span> is Bruce's living legacy—named for the two things he loved and did most: coding and smiling. It's a ripple effect of the kindness Bruce showed to one stranger with a dream.
                                </p>
                            </div>

                            <p>
                                Every rural youth we train, every skill we impart, every opportunity we create continues the thread Bruce began weaving.
                            </p>

                            <p>
                                And in his spirit, every graduate must empower at least one other underserved youth from their community, creating a revolution of hope spreading through the communities that need it most.
                            </p>

                            <p>
                                Bruce Tushabe fought no battles, but he championed financial inclusion in rural Lwengo and dedicated his life to children's education and vulnerable communities. He was a hero who changed lives one act of kindness at a time.
                            </p>
                        </div>

                        <div className="mt-16 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Smile on, Bruce.</h3>
                            <p className="text-gray-500">You continue to create the world you wanted, even in your absence.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-20 bg-[#f8fafc] border-t border-gray-100">
                <div className="container-custom mx-auto px-4 max-w-3xl text-center">
                    <svg className="w-12 h-12 text-[#ffc82e] mx-auto mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 leading-normal mb-8">
                        "Maybe the world would be a better place if everyone looked out for someone else once in a while."
                    </blockquote>
                    <cite className="text-gray-500 not-italic font-medium">
                        — Catherine Ryan Hyde, <span className="text-[#267fc3]">Pay It Forward</span>
                    </cite>

                    <div className="mt-12">
                        <Link href="/">
                            <button className="px-8 py-3 bg-[#267fc3] text-white rounded-full font-semibold hover:bg-[#1a5a8a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Return Home
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
