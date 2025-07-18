
export default function WelcomePage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-[#4F4F4F]">Welcome To</h1>
          <h1 className="text-6xl font-bold text-[#AAD59E]">HealthMate!</h1>
          <p className="text-xl text-[#4F4F4F]">
            We're here to support your journey to better health!
          </p>
          <a
            href="/login"
            className="inline-block bg-[#AAD59E] px-6 py-2 rounded text-white hover:bg-[#3d3d3d] transition"
          >
            Log In
            </a>
          <a>  </a>
          <a
            href="/signup"
            className="inline-block bg-[#AAD59E] px-6 py-2 rounded text-white hover:bg-[#3d3d3d] transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}