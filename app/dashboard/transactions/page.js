"use client"

import React, { useState, useEffect } from "react";

// Sample transaction data (replace with API data)
const sampleTransactions = [
  { id: "TXN001", amount: 50, type: "Credit", date: "2025-08-01", description: "Purchase" },
  { id: "TXN002", amount: 20, type: "Debit", date: "2025-08-05", description: "Purchase" },
  { id: "TXN003", amount: 100, type: "Credit", date: "2025-08-10", description: "Purchase" },
  { id: "TXN004", amount: 75, type: "Debit", date: "2025-08-12", description: "Purchase" },
];

const TransactionPage = () => {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterType(e.target.value);
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.amount.toString().includes(searchTerm);

    const matchesType = filterType === "All" ? true : txn.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">My Transactions</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by ID, description, or amount..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded px-4 py-2 w-full md:w-1/2 border-black text-black"
        />
        <select
          value={filterType}
          onChange={handleFilter}
          className="border rounded px-4 py-2 w-full md:w-1/4 border-black text-black"
        >
          <option value="All">All Transactions</option>
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">${txn.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionPage;
