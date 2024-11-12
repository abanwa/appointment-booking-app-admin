import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import SmallLoader from "../../components/SmallLoader";

function DoctorsList() {
  const { doctors, aToken, getAllDoctors, changeAvailability, changeDocId } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.length > 0 &&
          doctors.map((item) => (
            <div
              className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
              key={item?._id}
            >
              <img
                src={item.image}
                className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
                alt={`doc-${item._id}`}
              />
              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">
                  {item.name}
                </p>
                <p className="text-zinc-600 text-sm">{item.speciality}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  {changeDocId === item._id ? (
                    <SmallLoader />
                  ) : (
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={() => changeAvailability(item._id)}
                      readOnly
                    />
                  )}
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default DoctorsList;
