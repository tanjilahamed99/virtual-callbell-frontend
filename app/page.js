import CallManager from "@/components/CallManager/CallManager";
import QrScanner from "@/components/Dashboard/QrScaner";
import Navbar from "@/components/Navbar/Navbar";
import GuestModal from "@/components/welcomeModal/WelcomeModal";

export default function Home() {
  return (
    <div>
      <Navbar />
      <QrScanner />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
        <GuestModal />
      </div>
    </div>
  );
}
