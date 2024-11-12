import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import SmallLoader from "../../components/SmallLoader";
import { AppContext } from "../../context/AppContext";

function Dashboard() {
  const {
    aToken,
    getDashData,
    dashData,
    cancelAppointment,
    appointmendIdloading
  } = useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken, getDashData]);

  if (!dashData) return null;
  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img src={assets.doctor_icon} className="w-14" alt="doctor_icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData?.doctors}
            </p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img
            src={assets.appointments_icon}
            className="w-14"
            alt="appointments_icon"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData?.appointments}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img
            src={assets.patients_icon}
            className="w-14"
            alt="patients_icon"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData?.patients}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="list_icon" />
          <p className="font-semibold">Latest Bookings</p>
        </div>
        <div className="pt-4 border border-t-0">
          {dashData.latestAppointments.length > 0 &&
            dashData.latestAppointments.map((item) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={item?._id}
              >
                <img
                  src={item?.docData.image}
                  className="rounded-full w-10"
                  alt={`${item?._id}_appointment_img`}
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item?.docData?.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item?.slotDate)}
                  </p>
                </div>
                {item?.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : appointmendIdloading === item?._id ? (
                  <SmallLoader />
                ) : item?.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Cancelled
                  </p>
                ) : (
                  <img
                    src={assets.cancel_icon}
                    className="w-10 cursor-pointer"
                    onClick={() => cancelAppointment(item?._id)}
                    alt="cancel_icon"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
