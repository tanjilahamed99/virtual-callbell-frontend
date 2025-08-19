"use client";

import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

const QrScanner = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const html5QrCodeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!scannerOpen) return;

    const html5QrCode = new Html5Qrcode("reader");
    html5QrCodeRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          console.log("QR Code scanned:", decodedText);

          html5QrCode
            .stop()
            .then(() => {
              setScannerOpen(false);

              // decodedText already contains query string (userId & name)
              router.push(`/userInfo?${decodedText}`);
            })
            .catch((err) => console.error("Stop error:", err));
        },
        (errorMessage) => {
          console.warn(errorMessage);
        }
      )
      .catch((err) => console.error(err));

    return () => {};
  }, [scannerOpen, router]);

  const startScanner = () => setScannerOpen(true);

  return (
    <div>
      {!scannerOpen && (
        <button
          onClick={startScanner}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Scan QR Code
        </button>
      )}

      {scannerOpen && <div id="reader" style={{ width: "300px" }}></div>}
    </div>
  );
};

export default QrScanner;
