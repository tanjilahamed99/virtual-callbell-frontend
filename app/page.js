import CallManager from "@/components/CallManager/CallManager";
import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
        <CallManager />
      </div>
    </div>
  );
}
