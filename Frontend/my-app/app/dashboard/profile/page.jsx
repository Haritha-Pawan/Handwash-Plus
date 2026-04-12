"use client";

import { Camera, Pencil } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import profileImage from "../../../public/images/profile.avif";

function InfoGrid({ rows }) {
  return (
    <div className="">
      {rows.map((row, i) => (
        <div key={i}>
          {i > 0 && <hr className="border-gray-100 mb-5" />}
          <div className="grid grid-cols-3 gap-x-4 gap-y-5">
            {row.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                  {label}
                </p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const toDisplayText = (value, fallback = "") => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    if (typeof value.name === "string") return value.name;
  }
  return fallback;
};

export default function ProfilePage() {
  const { user, loading, updateProfile, uploadProfilePicture } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    class: "",
  });

  const fullName = user?.name || "";
  const [firstName = "-", ...restName] = fullName.split(" ").filter(Boolean);
  const lastName = restName.length > 0 ? restName.join(" ") : "-";
  const role = user?.role || "-";
  const email = user?.email || "-";
  const className = toDisplayText(user?.class?.name ?? user?.class, "-");
  const schoolName = toDisplayText(
    user?.school?.name ?? user?.schoolName ?? user?.school,
    "-"
  );
  const initialSchoolName = toDisplayText(
    user?.school?.name ?? user?.schoolName ?? user?.school,
    ""
  );
  const initialClassName = toDisplayText(user?.class?.name ?? user?.class, "");
  

  const personalRows = useMemo(
    () => [
      [
        { label: "First Name", value: firstName },
        { label: "Last Name", value: lastName },
        { label: "Class Name", value: className },
      ],
      [
        { label: "Email Address", value: email },
        { label: "School", value: schoolName },
        { label: "User Role", value: role },
      ],
    ],
    [className, email, firstName, lastName, role, schoolName],
  );

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      school: initialSchoolName,
      class: initialClassName,
    });
  }, [initialClassName, initialSchoolName, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = () => {
    setSubmitError("");
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      school: initialSchoolName,
      class: initialClassName,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handlePickProfileImage = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitError("");
    setIsUploadingPhoto(true);

    try {
      await uploadProfilePicture(file);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Failed to update profile photo.");
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSaving(true);

    updateProfile({
      name: formData.name,
      email: formData.email,
      school: formData.school,
      class: formData.class,
    })
      .then(() => {
        closeEditModal();
      })
      .catch((err) => {
        setSubmitError(err?.response?.data?.message || "Failed to update profile.");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className=" max-w-5xl space-y-4">
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-7 flex items-center gap-5">
          <div className="relative w-[76px] h-[76px] shrink-0">
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="rounded-full object-cover border-2 border-green-100"
            />
            <button
              onClick={handlePickProfileImage}
              disabled={isUploadingPhoto}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center disabled:opacity-60"
            >
              <Camera className="w-3 h-3 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {loading ? "Loading profile..." : fullName || "User"}
            </h2>
            <p className="text-sm text-gray-500">{role}</p>
            <p className="text-sm text-gray-500">{schoolName}</p>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-sm p-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-blue-500">Personal Information</h3>
            <button
              onClick={openEditModal}
              className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Edit <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <InfoGrid rows={personalRows} />
        </div>

     {/* About Me Card */}
<div className="bg-white rounded-2xl shadow-sm p-7">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-base font-bold text-blue-500">About Me</h3>
    <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
      Edit <Pencil className="w-3.5 h-3.5" />
    </button>
  </div>

  <textarea
    className="w-full text-sm text-gray-700 leading-relaxed resize-non"
    rows={5}
    placeholder="Write something about yourself..."
    defaultValue={fullName ? `Hi! I'm ${fullName}.` : ""}
  />
</div>

      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={closeEditModal}
                className="rounded-md px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">School</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Class</label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSaving}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
              {submitError && (
                <p className="text-sm font-medium text-red-500">{submitError}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}