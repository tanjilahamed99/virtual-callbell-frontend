"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef } from "react";

const Drawer = () => {
  const pathname = usePathname();
  const drawerRef = useRef(null);

  // Function to close the drawer
  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
  };

  // Sidebar links
  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/subscriptions", label: "Subscriptions" },
    { href: "/dashboard/transactions", label: "Transaction" },
    { href: "/dashboard/logout", label: "Logout" },
  ];

  return (
    <div className="navbar bg-gray-300 shadow-sm">
      <div className="flex-1">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" ref={drawerRef} />
          <div className="drawer-content">
            {/* Drawer button */}
            <label
              htmlFor="my-drawer"
              className="btn drawer-button bg-gray-300 text-black border-gray-300 p-2"
            >
              <Menu />
            </label>
          </div>

          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-60 p-4">
              {links.map((link) => (
                <li
                  key={link.href}
                  className={`hover:bg-indigo-600 ${
                    pathname === link.href ? "bg-indigo-600" : ""
                  } px-3 py-2 rounded-lg cursor-pointer transition`}
                >
                  <Link href={link.href} onClick={closeDrawer}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="flex-none">
        <h2 className="font-bold text-indigo-600">Virtual-Callbell</h2>
      </div>
    </div>
  );
};

export default Drawer;
