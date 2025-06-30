"use client";
import { useEffect, useState } from "react";
import { account, ID } from "../appwrite";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    account
      .get()
      .then((user) => setLoggedInUser(user))
      .catch(() => setLoggedInUser(null));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setLoggedInUser(user);
      router.replace("/");
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  const register = async () => {
    await account.create(ID.unique(), email, password, name);
    login(email, password);
  };

  const logout = async () => {
    await account.deleteSession("current");
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    return (
      <div>
        <p>Logged in as {loggedInUser.name}</p>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
  <div className="h-screen w-screen flex">
    {/* LEFT SIDE */}
    <div className="flex w-1/2 items-center justify-center">
      {signUp ? (
        // REGISTER FORM
        <div className="h-[400px] w-[400px] flex items-center justify-center bg-green-500 border-2 border-green-600 rounded-lg shadow-lg">
          <div className="sm:w-420 flex-center flex-col">
            <h2 className="h3-bold md:h2-bold">Register Account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">
              Please enter your details to sign up
            </p>
            <div className="flex flex-col gap-2 w-full mt-[40px]">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full mt-[50px]">
              <button type="button" onClick={register}>
                Register
              </button>
              <div className="text-small-regular text-light-2 text-center mt-4">
                Already have an account?
                <button
                  className="text-primary-500 text-small-semibold ml-2"
                  onClick={() => setSignUp(false)}
                >
                  Log in
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // EMPTY LEFT SIDE
        <div className="text-2xl text-gray-400">Left Div</div>
      )}
    </div>

    {/* RIGHT SIDE */}
    <div className="flex w-1/2 items-center justify-center">
      {!signUp ? (
        // LOGIN FORM
        <div className="h-[400px] w-[400px] flex items-center justify-center bg-green-500 border-2 border-green-600 rounded-lg shadow-lg">
          <div className="sm:w-420 flex-center flex-col">
            <h2 className="h3-bold md:h2-bold">Log in to your account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">
              Welcome back! Please enter your details
            </p>
            <div className="flex flex-col gap-2 w-full mt-[40px]">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full mt-[50px]">
              <button type="button" onClick={() => login(email, password)}>
                Login
              </button>
              <div className="text-small-regular text-light-2 text-center mt-4">
                Don't have an account?
                <button
                  className="text-primary-500 text-small-semibold ml-2"
                  onClick={() => setSignUp(true)}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // EMPTY RIGHT SIDE
        <div className="text-2xl text-gray-400">Right Div</div>
      )}
    </div>
  </div>
);
};

export default LoginPage;
