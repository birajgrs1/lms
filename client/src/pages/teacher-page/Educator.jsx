import { Outlet } from "react-router-dom";
import Navbar from "../../components/teachers/Navbar";
import Sidebar from "../../components/teachers/Sidebar";
import Footer from "../../components/teachers/Footer";

const Educator = () => {
  return (
    <div className="min-h-screen bg-white text-default">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;
