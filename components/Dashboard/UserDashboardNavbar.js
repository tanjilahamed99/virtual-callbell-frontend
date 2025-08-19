"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useGlobal } from "reactn";
import Swal from "sweetalert2";

const UserDashboardNavLinks = () => {
  const pathname = usePathname();
  const [user, setUser] = useGlobal("user");
  const setToken = useGlobal("token")[1];
  const router = useRouter();

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await setToken(null);
    await setUser({});
    Swal.fire({
      title: "Successful",
      text: "You have logged out!",
      icon: "success",
    });
    router.push("/");
  };

  const ulLinks = (
    <>
      <li
        className={`hover:bg-indigo-600 ${
          pathname === "/dashboard" ? "bg-indigo-600" : ""
        } px-3 py-2 rounded-lg cursor-pointer transition `}>
        <Link href={"/dashboard"}>Dashboard</Link>
      </li>
      <li
        className={`hover:bg-indigo-600 ${
          pathname === "/dashboard/profile" ? "bg-indigo-600" : ""
        } px-3 py-2 rounded-lg cursor-pointer transition `}>
        <Link href={"/dashboard/profile"}>Profile</Link>
      </li>
      <li
        className={`hover:bg-indigo-600 ${
          pathname === "/dashboard/subscriptions" ? "bg-indigo-600" : ""
        } px-3 py-2 rounded-lg cursor-pointer transition `}>
        <Link href={"/dashboard/subscriptions"}>Subscriptions</Link>
      </li>
      <li
        className={`hover:bg-indigo-600 ${
          pathname === "/dashboard/transactions" ? "bg-indigo-600" : ""
        } px-3 py-2 rounded-lg cursor-pointer transition `}>
        <Link href={"/dashboard/transactions"}>Transaction</Link>
      </li>
      <li
        onClick={logout}
        className={`hover:bg-indigo-600  px-3 py-2 rounded-lg cursor-pointer transition`}>
        Logout
      </li>
    </>
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Virtual Callbell</h1>
      <ul className="space-y-1">{ulLinks}</ul>
    </>
  );
};

export default UserDashboardNavLinks;
