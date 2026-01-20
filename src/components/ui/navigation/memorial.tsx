import Link from 'next/link';

export default function Memorial() {
  return (
    <>
      {/* Memorial Section */}
      <div className="my-8 pt-8 border-t border-gray-700 text-center">
        <Link href="/memorial" className="inline-block group">
          <p className="text-gray-400 text-sm italic group-hover:text-[#ffc82e] transition-colors duration-300">
            Dedicated to the memory of Bruce Tushabe - Inspiring the next generation of digital leaders
          </p>
        </Link>
      </div>
    </>
  );
}