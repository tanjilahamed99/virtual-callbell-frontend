"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import updateUser from "@/hooks/users/updateUser";
import { useGlobal } from "reactn";
import myData from "@/hooks/users/myData";
import Swal from "sweetalert2";
import QrCode from "@/components/Dashboard/QrCode";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [user] = useGlobal("user");
  const [myInfo, setMyInfo] = useState(null);

  // initials
  const initials = myInfo?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // open file picker
  const handleUpdateClick = () => {
    fileInputRef.current.click();
  };

  // set new profile image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // setUser((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  // handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMyInfo((prev) => ({ ...prev, [name]: value }));
  };

  // save profile
  const handleSave = async () => {
    // here you could also send data to API
    const { data } = await updateUser({ id: user.id, data: myInfo });
    if (data.success) {
      setIsEditing(false);
      Swal.fire({
        title: "Good job!",
        text: "Your profile has updated",
        icon: "success",
      });
    }
  };

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        const { data } = await myData({ id: user.id });
        if (data.success) {
          setMyInfo(data.data);
        }
      };
      fetch();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {myInfo?.image ? (
              <Image
                src={myInfo?.image}
                alt="Profile"
                fill
                className="rounded-full object-cover border-4 border-indigo-500 shadow-md"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-indigo-500 shadow-md">
                {initials}
              </div>
            )}
            <button
              onClick={handleUpdateClick}
              className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition">
              ✎
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
        {/* myInfo Details */}
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={myInfo?.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-1 border-black text-black"
                />
              ) : (
                <p className="text-gray-800 font-medium">{myInfo?.name}</p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  disabled
                  value={myInfo?.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-1 border-black text-black"
                />
              ) : (
                <p className="text-gray-800 font-medium">{myInfo?.email}</p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={myInfo?.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-1 border-black text-black"
                />
              ) : (
                <p className="text-gray-800 font-medium">{myInfo?.phone}</p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Address</p>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={myInfo?.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-1 border-black text-black"
                />
              ) : (
                <p className="text-gray-800 font-medium">{myInfo?.address}</p>
              )}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl shadow hover:bg-gray-300 transition">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition">
                Edit Profile
              </button>
              <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl shadow hover:bg-gray-300 transition">
                Logout
              </button>
            </>
          )}
        </div>
        <QrCode user={user} />
      </div>

      {/* qr code for call gest direct */}
    </div>
  );
};

export default Profile;
