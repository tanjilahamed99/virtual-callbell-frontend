import Link from "next/link";

const layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navbar */}
      <div className="w-[25%] bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 text-white shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-8">Virtual Callbell</h1>
        <ul className="space-y-4">
          <li>
            <Link
              href={"/dashboard"}
              className="hover:bg-indigo-600 px-3 py-2 rounded-lg cursor-pointer transition">
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href={"/dashboard/profile"}
              className="hover:bg-indigo-600 px-3 py-2 rounded-lg cursor-pointer transition">
              Profile
            </Link>
          </li>
          <li>
            <Link
              href={"/dashboard/subscriptions"}
              className="hover:bg-indigo-600 px-3 py-2 rounded-lg cursor-pointer transition">
              Subscriptions
            </Link>
          </li>
          <li>
            <Link
              href={"/dashboard/transactions"}
              className="hover:bg-indigo-600 px-3 py-2 rounded-lg cursor-pointer transition">
              Transaction
            </Link>
          </li>
          <li>
            <Link
              href={"/dashboard/logout"}
              className="hover:bg-indigo-600 px-3 py-2 rounded-lg cursor-pointer transition">
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Page Content */}
      <div className="w-[75%] bg-gray-50 p-8">{children}</div>
    </div>
  );
};

export default layout;
