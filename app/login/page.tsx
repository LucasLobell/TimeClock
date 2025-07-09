"use client";
import { useEffect, useState } from "react";
import { account, ID } from "../appwrite";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import NavBar from "@/components/NavBar";

const LoginPage = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    account
      .get()
      .then((user) => {
        setLoggedInUser(user);
        setSelectedDate(new Date());
        setCheckingAuth(false);
      })
      .catch(() => {
        setLoggedInUser(null);
        setCheckingAuth(false);
      });
  }, []);

  const validateForm = () => {
    if (!email || !password) {
      setError("Please fill in all required fields");
      return false;
    }
    if (!isLogin && !name) {
      setError("Please enter your name");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setLoggedInUser(user);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.replace("/"), 1000);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async () => {
    try {
      await account.create(ID.unique(), email, password, name);
      setSuccess("Registration successful! Logging you in...");
      await login(email, password);
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setLoggedInUser(null);
      setSuccess("Logged out successfully");
    } catch (error: any) {
      setError("Logout failed");
    }
  };

  if (checkingAuth) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <div className="w-full h-20 min-h-[80px] flex flex-row items-center justify-between px-8 bg-[#1a1a1a] border-b border-gray-800">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg animate-pulse">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </div>
          </div>
          <div className="flex justify-center flex-grow">
            <div className="w-[348px] h-12 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg animate-pulse">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 pt-8 px-8 pb-4">
          <Loading />
        </div>
      </div>
    );
  }

  if (loggedInUser) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <NavBar
          iconHouse={true}
          iconProfile={true}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
              Welcome, {loggedInUser.name}!
            </h1>
            <div className="space-y-4 mb-6">
              <p className="text-gray-300">
                <span className="font-medium">Email:</span> {loggedInUser.email}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">User ID:</span> {loggedInUser.$id}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-[#1a1a1a]">
      {/* Left Side - Register or Future Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {!isLogin ? (
          // Register form
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              TimeClock
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Join TimeClock today
            </p>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email-register" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email-register"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password-register" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password-register"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        ) : (
          // Future content placeholder
          <div className="text-center text-gray-500">
            <h2 className="text-2xl font-semibold mb-4">Future Content</h2>
            <p className="text-lg">Coming soon...</p>
          </div>
        )}
      </div>

      {/* Right Side - Login or Future Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {isLogin ? (
          // Login form
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Track your work hours efficiently
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        ) : (
          // Future content placeholder
          <div className="text-center text-gray-500">
            <h2 className="text-2xl font-semibold mb-4">Future Content</h2>
            <p className="text-lg">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
