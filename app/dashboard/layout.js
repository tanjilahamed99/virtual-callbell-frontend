import Drawer from "@/components/Dashboard/Drawer";
import UserDashboardNavLinks from "@/components/Dashboard/UserDashboardNavbar";

const layout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar Navbar */}
      <div className="lg:w-[25%] md:w-[30%] hidden md:block bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 text-white shadow-lg p-6">
        <UserDashboardNavLinks />
      </div>
      {/* Mobile Navbar */}
      <div className="md:hidden">
        <Drawer />
      </div>

      {/* Main Page Content */}
      <div className="lg:w-[75%] md:w-[70%] w-full bg-gray-50 lg:p-8">
        {children}
      </div>
    </div>
  );
};

export default layout;
