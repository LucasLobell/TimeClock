"use client";
import { useEffect, useState } from "react";
import { account } from "../appwrite";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const LogoutPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Delete the current session
        await account.deleteSession("current");
        
        // Clear any local storage or state if needed
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      } catch (error: any) {
        console.error("Logout error:", error);
        setError("Logout failed. Please try again.");
        setLoading(false);
      }
    };

    performLogout();
  }, [router]);

  if (loading && !error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#1a1a1a]">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Logging out...</h2>
          <p className="text-gray-400">Please wait while we sign you out.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#1a1a1a] p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-4">Logout Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = "/"}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => window.location.href = "/login"}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#1a1a1a] p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
        <div className="text-green-400 text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-white mb-4">Successfully Logged Out</h2>
        <p className="text-gray-400 mb-6">You have been signed out of your account.</p>
        <div className="animate-pulse">
          <p className="text-green-400 text-sm">Redirecting to login page...</p>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage; 