export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#267fc3] via-[#1a5a8a] to-[#267fc3] flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-4xl">C</span>
        </div>

        {/* App Name */}
        <h1 className="text-white font-bold text-2xl mb-2">CAS Academy</h1>
        <p className="text-white/60 text-sm">Digital Inclusion For All</p>

        {/* Loading Spinner */}
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-3 border-white/20 border-t-[#ffc82e] rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
