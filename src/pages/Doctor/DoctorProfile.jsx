import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

function DoctorProfile() {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dToken, getProfileData, profileData, setProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  // UPDATE PROFILE
  const updateProfile = async () => {
    try {
      setLoading(true);
      const updateData = {
        address: profileData?.address,
        fees: profileData?.fees,
        available: profileData?.available
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        { headers: { dToken } }
      );

      if (data?.success) {
        console.log("profile updated successfully");
        console.log(data?.updatedProfileData);
        toast.success(data?.message);
        // await getProfileData();
        setProfileData(data?.updatedProfileData);
        setIsEdit(false);
      } else {
        console.log("could not update profile");
        toast.error(data?.message);
        setIsEdit(false);
      }
    } catch (err) {
      console.log(
        "Failed to update profile in updateProfile in DoctorProfile.jsx :  ",
        err
      );
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken, getProfileData]);

  if (!profileData) return null;
  console.log("profiledata : ", profileData);
  return (
    <div>
      <div className="flex flex-col gap-4 m-5">
        <div>
          <img
            src={profileData?.image}
            className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
            alt="profileImg"
          />
        </div>

        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
          {/* --- Doc Info: name, degree, experience */}
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {profileData?.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {profileData?.degree} - {profileData?.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {profileData?.experience}
            </button>
          </div>

          {/* -- Doctor About ---- */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
              About
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {profileData?.about}
            </p>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800">
              {currency}
              {isEdit ? (
                <input
                  type="number"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value
                    }))
                  }
                  value={profileData?.fees}
                />
              ) : (
                profileData?.fees
              )}
            </span>
          </p>
          <div className="flex gap-2 py-2">
            <p>Address:</p>
            <p className="text-sm">
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))
                  }
                  value={profileData?.address?.line1 || ""}
                />
              ) : (
                profileData?.address?.line1
              )}{" "}
              <br />
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))
                  }
                  value={profileData?.address?.line2 || ""}
                />
              ) : (
                profileData?.address?.line2
              )}
            </p>
          </div>

          <div className="flex gap-1 pt-2">
            <input
              type="checkbox"
              checked={profileData?.available}
              onChange={() =>
                isEdit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available
                }))
              }
              readOnly
            />
            <label htmlFor="">Available</label>
          </div>

          {isEdit ? (
            <button
              onClick={updateProfile}
              className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
