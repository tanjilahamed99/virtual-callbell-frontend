"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const UserDashboardNavLinks = () => {
  const pathname = usePathname();
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
        className={`hover:bg-indigo-600 ${
          pathname === "/dashboard/logout" ? "bg-indigo-600" : ""
        } px-3 py-2 rounded-lg cursor-pointer transition `}>
        <Link href={"/dashboard/logout"}>Logout</Link>
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
