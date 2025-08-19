"use client";

import { usePathname, useRouter } from "next/navigation";

export default function DashboardNotFound() {
  const location = usePathname(); // current path (e.g., /dashboard/abc)
  const router = useRouter(); // for navigation

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-indigo-700">404</h1>
        <p className="mt-4 text-lg text-gray-600">
          Oops! This page <span className="font-semibold">{location}</span>{" "}
          could not be found.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          {/* Go back to previous page */}
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition">
            ⬅ Back
          </button>

          {/* Go to Dashboard directly */}
        </div>
      </div>
    </div>
  );
}
