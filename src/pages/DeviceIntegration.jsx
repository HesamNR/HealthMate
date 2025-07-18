
export default function DeviceIntegration() {
  const integrationUrl = 'https://dev.fitbit.com/build/reference/web-api/client-credentials/';

  const handleRedirect = () => {
    window.location.href = integrationUrl;
  };

  return (
    <div className="min-h-screen bg-[#fddbcf] flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Integrate your device</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-lg">
        Make tracking your health metrics effortless! Click the button below to connect via Fitbit.
      </p>

      <button
        onClick={handleRedirect}
        className="px-6 py-3 bg-[#AAD59E] hover:bg-[#8bbd83] rounded text-white font-semibold transition"
      >
        Connect with Fitbit
      </button>
    </div>
  );
}