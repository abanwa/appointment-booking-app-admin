import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCallback } from "react";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  // the aToken is set in the Login.jsx when the admin logs in
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [changeDocId, setChangeDocId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmendIdloading, setAppointmendIdloading] = useState(false);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        {
          headers: { aToken }
        }
      );
      if (data?.success) {
        setDoctors(data?.doctors);
        console.log(data?.doctors);
      } else {
        console.log("Could not fetch all doctors data");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error getAllDoctors : ", err);
      toast.error(err?.message);
    }
  }, [aToken, backendUrl]);

  const changeAvailability = async (docId) => {
    try {
      setChangeDocId(docId);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { headers: { aToken } }
      );

      if (data?.success) {
        console.log(data?.message);
        toast.success(data?.message);
        // we will refetch all the doctors
        getAllDoctors();
      } else {
        console.log("Could not change availability");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error changeAvailability : ", err);
      toast.error(err?.message);
    } finally {
      setChangeDocId("");
    }
  };

  const getAllAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { aToken }
      });
      if (data?.success) {
        setAppointments(data?.appointments);
        console.log(data?.appointments);
      } else {
        console.log("failed to fetch appointments");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error getAllAppointments : ", err);
      toast.error(err?.message);
    }
  }, [aToken, backendUrl]);

  // Cancel Appointment
  const cancelAppointment = async (appointmendId) => {
    try {
      setAppointmendIdloading(appointmendId);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmendId },
        { headers: { aToken } }
      );

      if (data?.success) {
        toast.success(data?.message);
        console.log("Appointment cancelled");
        await getAllAppointments();
      } else {
        console.log("failed to cancel appointment");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error cancelAppointment in AdminController : ", err);
      toast.error(err?.message);
    } finally {
      setAppointmendIdloading(false);
    }
  };

  // Dashboard Data
  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { aToken }
      });
      if (data?.success) {
        console.log("Dashboard data fetched");
        setDashData(data?.dashData);
      } else {
        console.log("could not fetch dashboard data");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error getDashData in AdminController : ", err);
      toast.error(err?.message);
    }
  }, [aToken, backendUrl]);

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    changeDocId,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    appointmendIdloading,
    dashData,
    getDashData
  };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
