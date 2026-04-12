import { useEffect, useState } from "react";
import { getAuthUser, saveAuthUser } from "../lib/auth";
import { getProfileById, updateProfileById } from "../services/userServices/userService";

const toStringValue = (value) => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    if (typeof value.name === "string") return value.name;
    if (typeof value.id === "string") return value.id;
    if (typeof value._id === "string") return value._id;
  }
  return "";
};

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProfile = async () => {
    try {
      setError(null);

      const localUser = getAuthUser();
      if (!localUser) {
        setUser(null);
        return;
      }

      setUser(localUser);

      const userId = localUser._id || localUser.id;
      if (!userId) return;

      const remoteUser = await getProfileById(userId);
      setUser(remoteUser || localUser);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch profile:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    const existingUser = getAuthUser();
    const userId = existingUser?._id || existingUser?.id || user?._id || user?.id;
    if (!userId) {
      throw new Error("User ID not found");
    }

    const normalizedUpdates = {
      ...updates,
      ...(Object.prototype.hasOwnProperty.call(updates, "school")
        ? { school: toStringValue(updates.school) }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(updates, "class")
        ? { class: toStringValue(updates.class) }
        : {}),
    };

    const updatedUser = await updateProfileById(userId, normalizedUpdates);
    if (updatedUser) {
      setUser(updatedUser);
      saveAuthUser(updatedUser);
    }
    return updatedUser;
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return { user, setUser, loading, error, refreshProfile, updateProfile };
};
