"use client";

import React, { useState } from "react";
import login from "@/hooks/auth/login";
import register from "@/hooks/auth/regsiter";
import setAuthToken from "@/config/setAuthToken";
import { jwtDecode } from "jwt-decode";
import { useGlobal } from "reactn";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AuthForm = () => {
  const [signUp, setSignUp] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setToken = useGlobal("token")[1];
  const setUser = useGlobal("user")[1];
  const [entryPath, setEntryPath] = useGlobal("entryPath");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (signUp) {
        const { data } = await register(userData);
        if (!data.success)
          throw new Error(data.message || "Registration failed");
      }

      const { data: user } = await login({
        email: userData.email,
        password: userData.password,
      });

      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(jwtDecode(user.token)));

      setAuthToken(user.token);
      setUser(jwtDecode(user.token));
      setToken(user.token);

      await setEntryPath(null);
      router.push("/");
    } catch (err) {
      if (err.message !== "NEXT_REDIRECT") {
        setError(err?.response?.data?.message || err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      {/* Background image */}
      <Image
        src="/login.jpg" // put your image in public/auth-bg.jpg
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Form card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border bg-white/90 p-6 shadow-lg backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-900/90 sm:p-8">
        {/* Toggle tabs */}
        <div className="flex border-b dark:border-zinc-700">
          <button
            className={`flex-1 p-3 text-center font-semibold uppercase transition ${
              !signUp
                ? "bg-zinc-800 text-white dark:bg-zinc-600"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setSignUp(false)}>
            Sign In
          </button>
          <button
            className={`flex-1 p-3 text-center font-semibold uppercase transition ${
              signUp
                ? "bg-zinc-800 text-white dark:bg-zinc-600"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setSignUp(true)}>
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-6">
          <h1 className="text-center text-xl font-bold uppercase tracking-wide">
            {signUp ? "Create Account" : "Welcome Back"}
          </h1>

          {signUp && (
            <input
              name="name"
              value={userData.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              required
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-700 dark:border-zinc-700 dark:bg-zinc-800"
            />
          )}

          <input
            name="email"
            value={userData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-700 dark:border-zinc-700 dark:bg-zinc-800"
          />

          <input
            name="password"
            value={userData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-700 dark:border-zinc-700 dark:bg-zinc-800"
          />

          {!signUp && (
            <p className="text-right text-sm text-zinc-600 dark:text-zinc-400">
              <a href="#" className="hover:underline">
                Forgot password?
              </a>
            </p>
          )}

          {error && (
            <p className="text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md border px-5 py-2 font-semibold uppercase shadow-md transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white">
            {loading ? "Processing..." : "Submit"}
          </button>

          <p className="text-center text-sm">
            {signUp ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button
              type="button"
              onClick={() => setSignUp(!signUp)}
              className="font-semibold underline">
              {signUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
