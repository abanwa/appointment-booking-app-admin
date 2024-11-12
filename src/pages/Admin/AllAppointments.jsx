import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import SmallLoader from "../../components/SmallLoader";

function AllAppointments() {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
    appointmendIdloading
  } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken, getAllAppointments]);
  console.log(appointments.length);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.length > 0 &&
          appointments.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={item?._id}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img
                  src={item.userData?.image}
                  className="w-8 rounded-full"
                  alt={`${item?._id}_app`}
                />{" "}
                <p>{item.userData.name}</p>
              </div>
              <p className="max-sm:hidden">
                {calculateAge(item?.userData?.dob)}
              </p>
              <p>
                {slotDateFormat(item.slotDate)}, {item?.slotTime}
              </p>
              <div className="flex items-center gap-2">
                <img
                  src={item.docData?.image}
                  className="w-8 rounded-full bg-gray-200"
                  alt={`${item?._id}_app_`}
                />{" "}
                <p>{item.docData.name}</p>
              </div>
              <p>
                {currency}
                {item?.amount}
              </p>
              {item?.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : appointmendIdloading === item?._id ? (
                <SmallLoader />
              ) : item?.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
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
  );
}

export default AllAppointments;
