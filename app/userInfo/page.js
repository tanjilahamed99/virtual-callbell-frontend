"use client";

import CallManager from "@/components/CallManager/CallManager";
import getUser from "@/hooks/users/getUserData";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const UserCard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  let userID = searchParams.get("userId");
  let userName = searchParams.get("name");

  // initials
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  useEffect(() => {
    setLoading(true);
    if (userID && userName) {
      const fetch = async () => {
        const { data } = await getUser({ id: userID });
        console.log(data);
        if (data.success) {
          setUser(data.data);
          setLoading(false);
        }
        setLoading(false);
      };
      fetch();
    }
  }, [userID, userName]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      {loading ? (
        <span className="loading loading-dots loading-xl"></span>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-[450px] text-center">
          {user?.image ? (
            <Image
              src={user?.image}
              alt="Profile"
              fill
              className="rounded-full object-cover border-4 border-indigo-500 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-indigo-500 shadow-md">
              {initials}
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>

          <div className="mt-6 flex gap-3 justify-center">
            <CallManager userId={userID} userName={userName} />
          </div>
        </div>
      )}
    </div>
  );
};

const UserInfo = () => {
  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserCard />
    </Suspense>
  );
};

export default UserInfo;
