"use client";

import login from "@/hooks/auth/login";
import register from "@/hooks/auth/regsiter";
import React, { useState } from "react";
import setAuthToken from "@/config/setAuthToken";
import { jwtDecode } from "jwt-decode";
import { useGlobal } from "reactn";

const Login = () => {
  const [signUp, setSignUp] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ status: false, message: "" });
  const setToken = useGlobal("token")[1];
  const setUser = useGlobal("user")[1];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (loading) return;

    //     setLoading(true);
    //     setError({ status: false, message: "" });

    //     const { name, email, password1, password2 } = userData || {};

    //     if (password1 !== password2) {
    //       setLoading(false);
    //       return setError({
    //         status: true,
    //         type: "not-matched-pass",
    //         message: "Password doesn't matched!",
    //       });
    //     }

    try {
      const { data } = await register({ ...userData });
      if (data.success) {
        const { data: user } = await login({
          email: userData.email,
          password: userData.password,
        });
        localStorage.setItem("token", user.token);
        setAuthToken(user.token);
        setUser(jwtDecode(user.token));
        setToken(user.token);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.message !== "NEXT_REDIRECT") {
        setError({ status: true, message: err?.response?.data?.message });
      }
      console.log(err.message);
      //       redirect("/signin");
    }
  };

  return (
    <div className="w-full mx-auto justify-center flex items-center h-full mt-20">
      <div className="w-full max-w-sm overflow-hidden rounded-lg border bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div
          className={`flex select-none gap-2 border-b p-2.5 *:flex-1 *:rounded-md *:border *:p-2 *:text-center *:uppercase *:shadow-inner *:outline-none dark:border-zinc-700 *:dark:border-zinc-600 ${
            signUp
              ? "last-of-type:*:bg-zinc-600 last-of-type:*:text-white"
              : "first-of-type:*:bg-zinc-600 first-of-type:*:text-white"
          }`}>
          <button
            onClick={() => {
              setSignUp(false);
            }}>
            signin
          </button>
          <button
            onClick={() => {
              setSignUp(true);
            }}>
            signup
          </button>
        </div>
        <div className="w-full flex-col items-center overflow-hidden p-4 sm:p-8">
          {/* sign up form  */}
          <form
            className={`${
              signUp ? "h-full duration-300" : "invisible h-0 opacity-0"
            } space-y-3 sm:space-y-5`}>
            <h1 className="mb-6 uppercase backdrop-blur-sm sm:text-2xl">
              Sign Up
            </h1>
            <div className="space-y-4">
              <input
                onChange={handleChange}
                name="name"
                type="text"
                placeholder="Name"
                className="block w-full rounded-md border p-2.5 outline-none ring-zinc-700 focus:ring-1 dark:border-zinc-700"
              />
              <input
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="block w-full rounded-md border p-2.5 outline-none ring-zinc-700 focus:ring-1 dark:border-zinc-700"
              />
              <input
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="block w-full rounded-md border p-2.5 outline-none ring-zinc-700 focus:ring-1 dark:border-zinc-700"
              />
            </div>
            {/* button type will be submit for handling form submission*/}
            <button
              onClick={handleSubmit}
              type="button"
              className="mx-auto block rounded-md border px-5 py-2 uppercase shadow-lg duration-200 hover:bg-zinc-400/10 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white">
              Submit
            </button>
            <p className="text-center">
              Already have an account?
              <button
                type="button"
                onClick={handleSubmit}
                className="font-semibold underline">
                Signin
              </button>
            </p>
          </form>

          {/* signin form */}
          <form
            className={`${
              signUp ? "invisible h-0 opacity-0" : "h-full duration-300"
            } space-y-3 sm:space-y-5`}>
            <h1 className="mb-3 uppercase sm:mb-5 sm:text-2xl">Sign In</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              className="block w-full rounded-md border p-2.5 outline-none ring-zinc-700 focus:ring-1 dark:border-zinc-700"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="block w-full rounded-md border p-2.5 outline-none ring-zinc-700 focus:ring-1 dark:border-zinc-700"
            />
            <p className="text-end text-sm text-zinc-600 dark:text-zinc-300">
              <a href="#" className="hover:underline">
                forget password?
              </a>
            </p>
            {/* button type will be submit for handling form submission*/}
            <button
              type="button"
              className="mx-auto block rounded-md border px-5 py-2 uppercase shadow-lg duration-200 hover:bg-zinc-400/10 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white">
              Submit
            </button>
            <p className="text-center">
              Don&apos;t have an account?
              <button
                onClick={() => {
                  setSignUp(!signUp);
                }}
                type="button"
                className="font-semibold underline">
                Signup
              </button>
            </p>
          </form>

          <div className="mt-3 space-y-3 sm:space-y-5">
            <hr className="border-zinc-700" />
            <button className="mx-auto mb-4 mt-8 block rounded-md border px-5 py-2 shadow-lg duration-200 hover:bg-zinc-400/10 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="mr-2 inline-block h-5 w-5 fill-current">
                <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
