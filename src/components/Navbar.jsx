import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

function Navbar() {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    if (aToken) {
      navigate("/login", { state: { from: location } });
    }

    // navigate("/");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
    navigate("/login", { state: { from: location } });
  };
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          src={assets.admin_logo}
          className="w-36 sm:w-40 cursor-pointer"
          alt="admin_logo"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
