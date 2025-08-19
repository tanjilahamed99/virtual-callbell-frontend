import React from "react";
import Image from "next/image";

const DashboardPage = ({ user }) => {
  const userData = user || {
    name: "Tanjl Ahamed",
    profilePic: "",
    subscriptions: [
      {
        website: "Virtual Callbell",
        plan: "Premium",
        startDate: "2025-07-01",
        endDate: "2025-08-31",
      },
    ],
    transactions: [
      { id: 1, date: "2025-07-01", amount: 1000, status: "Success" },
      { id: 2, date: "2025-06-01", amount: 800, status: "Success" },
      { id: 3, date: "2025-05-01", amount: 500, status: "Failed" },
    ],
  };

  const getRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 flex flex-col gap-10">
      {/* Welcome Banner */}
      <div className="bg-indigo-600 text-white rounded-xl p-6 md:p-10 shadow-md flex flex-col md:flex-row items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Welcome, {userData.name.split(" ")[0]}!
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base">
            Glad to see you at <span className="font-medium">Virtual Callbell</span>
          </p>
        </div>
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white text-indigo-600 flex items-center justify-center text-xl sm:text-2xl font-bold">
          {userData.profilePic ? (
            <Image
              src={userData.profilePic}
              alt="Profile Picture"
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            getInitials(userData.name)
          )}
        </div>
      </div>

      {/* Subscription Overview */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Your Subscription
          </h2>
          {userData.subscriptions.map((sub, idx) => (
            <div key={idx} className="mt-2 text-xs sm:text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Website:</span> {sub.website}
              </p>
              <p>
                <span className="font-medium">Plan:</span> {sub.plan}
              </p>
              <p>
                <span className="font-medium">Remaining Days:</span>{" "}
                {getRemainingDays(sub.endDate)}
              </p>
              <p>
                <span className="font-medium">Ends on:</span>{" "}
                {new Date(sub.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <div className="text-indigo-600 text-lg font-semibold">
          {userData.subscriptions.length} Subscription
          {userData.subscriptions.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-10 overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
          Latest Transactions
        </h2>
        <table className="min-w-full text-left text-gray-700 text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-2 sm:px-3 py-1 sm:py-2 font-medium">Date</th>
              <th className="px-2 sm:px-3 py-1 sm:py-2 font-medium">Amount</th>
              <th className="px-2 sm:px-3 py-1 sm:py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {userData.transactions.map((tran) => (
              <tr key={tran.id} className="border-b border-gray-200">
                <td className="px-2 sm:px-3 py-1 sm:py-2">{tran.date}</td>
                <td className="px-2 sm:px-3 py-1 sm:py-2">{tran.amount} BDT</td>
                <td
                  className={`px-2 sm:px-3 py-1 sm:py-2 font-medium ${
                    tran.status === "Success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tran.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
