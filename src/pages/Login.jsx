import { useContext, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { useLocation, useNavigate } from "react-router-dom";

function Login() {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const location = useLocation();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Admin") {
        console.log("Admin");
        // console.log(email, password);
        // LOGIN AS ADMIN
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password
        });
        console.log("data:", data);
        if (data?.success) {
          localStorage.setItem("aToken", data?.token);
          setAToken(data?.token);
          // go to the last page you were before you try to access this page
          navigate(location.state?.from?.pathname || "/");
        } else {
          console.log("could not login as a admin");
          toast.error(data?.message);
        }
      } else {
        console.log("Doctor");
        // LOGIN AS DOCTOR
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password
        });

        if (data?.success) {
          console.log("login doctor");
          localStorage.setItem("dToken", data?.token);
          setDToken(data?.token);
          // go to the last page you were before you try to access this page
          navigate(location.state?.from?.pathname || "/");
        } else {
          console.log("could not login as a doctor");
          toast.error(data?.message);
        }
      }
    } catch (err) {
      console.log("error from Admin Login.jsx : ", err.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              onClick={() => setState("Doctor")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              onClick={() => setState("Admin")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

export default Login;
