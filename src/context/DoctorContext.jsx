import axios from "axios";
import { createContext, useCallback, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [appIdLoading, setAppIdLoading] = useState(false);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        { headers: { dToken } }
      );

      if (data?.success) {
        console.log("doc appointments fetched");
        setAppointments(data?.appointments);
      } else {
        console.log(
          "Could not fethc doctor appointments in getAppointments in Doctor Context"
        );
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error in getAppointments in DoctorContext : ", err);
      toast.error(err?.message);
    }
  }, [backendUrl, dToken]);

  const completeAppointment = useCallback(
    async (appointmentId) => {
      try {
        setAppIdLoading(appointmentId);
        const { data } = await axios.post(
          `${backendUrl}/api/doctor/complete-appointment`,
          { appointmentId },
          { headers: { dToken } }
        );

        if (data?.success) {
          console.log("appointment completed");
          toast.success(data?.message);
          await getAppointments();
        } else {
          console.log(
            "Could not complete appointment in completeAppointment in Doctor Context"
          );
          toast.error(data?.message);
        }
      } catch (err) {
        console.log("Error in completeAppointment in DoctorContext : ", err);
        toast.error(err?.message);
      } finally {
        setAppIdLoading(false);
      }
    },
    [backendUrl, dToken, getAppointments]
  );

  const cancelAppointment = useCallback(
    async (appointmentId) => {
      try {
        setAppIdLoading(appointmentId);
        const { data } = await axios.post(
          `${backendUrl}/api/doctor/cancel-appointment`,
          { appointmentId },
          { headers: { dToken } }
        );

        if (data?.success) {
          console.log("appointment cancelled");
          toast.success(data?.message);
          await getAppointments();
        } else {
          console.log(
            "Could not cancel appointment in cancelAppointment in Doctor Context"
          );
          toast.error(data?.message);
        }
      } catch (err) {
        console.log("Error in cancelAppointment in DoctorContext : ", err);
        toast.error(err?.message);
      } finally {
        setAppIdLoading(false);
      }
    },
    [backendUrl, dToken, getAppointments]
  );

  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { dToken }
      });
      if (data?.success) {
        console.log("doctor Dashboard data fetched");
        setDashData(data?.dashData);
      } else {
        console.log("could not fetch doctor dashboard data");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error getDashData in DoctorController : ", err);
      toast.error(err?.message);
    }
  }, [dToken, backendUrl]);

  const getProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { dToken }
      });
      if (data?.success) {
        console.log("doctor profile data fetched");
        setProfileData(data?.profileData);
      } else {
        console.log("could not fetch doctor profile data");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error getProfileData in DoctorController : ", err);
      toast.error(err?.message);
    }
  }, [dToken, backendUrl]);

  const value = {
    backendUrl,
    dToken,
    setDToken,
    appointments,
    getAppointments,
    appIdLoading,
    completeAppointment,
    cancelAppointment,
    getDashData,
    dashData,
    profileData,
    getProfileData,
    setProfileData
  };
  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
