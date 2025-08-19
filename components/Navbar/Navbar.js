"use client";

import { ScanLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useGlobal } from "reactn";
import Swal from "sweetalert2";
import QrScanner from "../Dashboard/QrScaner";

const Navbar = () => {
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

  const ulLInks = (
    <>
      <div className="hidden lg:block">{!user?.id && <QrScanner />}</div>
      <li>
        <a>About us</a>
      </li>
      <li>
        <a>Privacy Policy</a>
      </li>
      <li>
        <a>Terms of use</a>
      </li>
      <li>
        <a>Contact us</a>
      </li>
      {!user?.id && (
        <li className="lg:hidden">
          {user?.id ? (
            <>
              <button onClick={logout} className="btn">
                Logout
              </button>
            </>
          ) : (
            <div>
              <Link href={"/login"} className="btn">
                Login
              </Link>
            </div>
          )}
        </li>
      )}

      {user?.id && (
        <li>
          <Link href={"/dashboard"}>Dashboard</Link>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            {ulLInks}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl font-bold">Virtual-callbell</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 items-center">{ulLInks}</ul>
      </div>
      <div className="navbar-end">
        <div className="hidden lg:inline">
          {user?.id ? (
            <>
              <button onClick={logout} className="btn">
                Logout
              </button>
            </>
          ) : (
            <div>
              <Link href={"/login"} className="btn">
                Login
              </Link>
            </div>
          )}
        </div>
        <div className="lg:hidden">{!user?.id && <QrScanner />}</div>
      </div>
    </div>
  );
};

export default Navbar;
