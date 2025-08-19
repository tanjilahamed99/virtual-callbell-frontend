import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QrCode = ({ user = {} }) => {
  const qrRef = useRef();
  const qrValue = `userId=${user?.id}&name=${encodeURIComponent(user?.name)}`;

  // Download QR Code
  const handleDownload = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${user?.name}_QRCode.png`;
    link.click();
  };

  // Share QR Code
  const handleShare = async () => {
    try {
      const canvas = qrRef.current.querySelector("canvas");
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      const filesArray = [
        new File([blob], `${user?.name}_QRCode.png`, { type: "image/png" }),
      ];
      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        await navigator.share({
          files: filesArray,
          title: "QR Code",
          text: `Scan this QR code to connect with ${user?.name}`,
        });
      } else {
        alert("Your browser does not support sharing files.");
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Scan to connect with {user?.name}</h2>
      <div ref={qrRef}>
        <QRCodeCanvas value={qrValue} size={200} />
      </div>
      <div className="flex flex-col gap-2 items-center md:flex-row">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Download QR
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Share QR
        </button>
      </div>
    </div>
  );
};

export default QrCode;
