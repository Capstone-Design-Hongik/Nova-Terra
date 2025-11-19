import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useState } from "react";

export default function Onboarding() {
  const navigate = useNavigate();
  const { connectMetaMask, isLoading, error, account, isConnected } = useMetaMask();
  const [showError, setShowError] = useState(false);

  const handleNoveaTerraClick = async () => {
    try {
      await connectMetaMask();
      setShowError(false);
      // 메타마스크 연결 성공 시 홈 페이지로 이동
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setShowError(true);
      console.error("MetaMask connection failed:", err);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          NovaTerra
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Blockchain-based Real Estate Investment Platform
        </p>

        {isConnected && account && (
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 mb-4">
            <p className="text-green-400 text-sm">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleNoveaTerraClick}
          disabled={isLoading || isConnected}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-6 text-lg w-full"
        >
          {isLoading ? "Connecting..." : isConnected ? "Connected" : "NovaTerra"}
        </Button>

        {isConnected && (
          <p className="text-slate-400 text-sm mt-4">
            Redirecting to dashboard...
          </p>
        )}
      </div>
    </div>
  );
}
