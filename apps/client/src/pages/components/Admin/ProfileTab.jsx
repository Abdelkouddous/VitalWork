import React, { useState } from "react";
import { useAdminContext } from "../../AdminLayout";
import { useRevalidator } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../../utils/customFetch";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Camera,
} from "lucide-react";

const ProfileTab = () => {
  const { user } = useAdminContext();
  const revalidator = useRevalidator();
  const { name, lastName, email, location, avatar, createdAt } = user;

  // Edit fields
  const [profileName, setProfileName] = useState(name || "");
  const [profileLastName, setProfileLastName] = useState(lastName || "");
  const [profileEmail, setProfileEmail] = useState(email || "");
  const [profileLocation, setProfileLocation] = useState(location || "");
  const [avatarFile, setAvatarFile] = useState(null);
  
  // Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Submit Profile Changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileName || !profileLastName || !profileEmail) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", profileName);
    formData.append("lastName", profileLastName);
    formData.append("email", profileEmail);
    formData.append("location", profileLocation);

    if (avatarFile) {
      if (avatarFile.size > 500000) {
        toast.error("Image size too large. Max size is 500KB.");
        return;
      }
      formData.append("avatar", avatarFile);
    }

    setIsUpdatingProfile(true);
    try {
      await customFetch.patch("/clinics/update-user", formData);
      toast.success("Profile details updated successfully.");
      setAvatarFile(null);
      revalidator.revalidate();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to update profile details.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await customFetch.patch("/clinics/update-user", { password: newPassword });
      toast.success("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString("fr-DZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="admin-tab-container animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-[var(--text-color)]">
        Admin Profile Settings
      </h2>

      <div className="grid-2-3">
        {/* Profile Card details */}
        <div className="admin-card flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar container */}
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--border-color)] mb-4 flex items-center justify-center bg-[var(--background-color)]"
            >
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-[var(--text-secondary-color)]" />
              )}
            </div>
            <h3 className="text-lg font-bold text-[var(--text-color)]">
              {name} {lastName}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-100)] mt-2">
              System Admin
            </span>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[var(--primary-500)]" />
              <div>
                <span className="block text-[10px] uppercase text-[var(--text-secondary-color)] font-bold">
                  Email address
                </span>
                <span className="text-sm font-semibold text-[var(--text-color)]">{email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[var(--primary-500)]" />
              <div>
                <span className="block text-[10px] uppercase text-[var(--text-secondary-color)] font-bold">
                  Location
                </span>
                <span className="text-sm font-semibold text-[var(--text-color)]">
                  {location || "Not Provided"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[var(--primary-500)]" />
              <div>
                <span className="block text-[10px] uppercase text-[var(--text-secondary-color)] font-bold">
                  Member since
                </span>
                <span className="text-sm font-semibold text-[var(--text-color)]">{joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Forms */}
        <div className="space-y-6">
          {/* Edit Details */}
          <div className="admin-card">
            <h3 className="text-base font-bold mb-4 text-[var(--text-color)] flex items-center gap-2">
              <User className="h-4 w-4 text-[var(--primary-500)]" />
              Update Account Information
            </h3>
            <form onSubmit={handleProfileSubmit} className="admin-form">
              {/* Profile Image upload wrapper */}
              <div>
                <label
                  htmlFor="avatar"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--primary-300)] rounded-lg cursor-pointer bg-[var(--background-color)] hover:border-[var(--primary-500)] transition-all"
                >
                  <Camera className="h-6 w-6 text-[var(--primary-500)] mb-1" />
                  <span className="text-xs font-semibold text-[var(--text-color)]">
                    {avatarFile ? avatarFile.name : "Upload profile picture"}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary-color)] mt-0.5">
                    JPG/PNG up to 500KB
                  </span>
                  <input
                    type="file"
                    id="avatar"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-color)] mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--text-color)] text-sm focus:border-[var(--primary-500)] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-color)] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileLastName}
                    onChange={(e) => setProfileLastName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--text-color)] text-sm focus:border-[var(--primary-500)] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-color)] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--text-color)] text-sm focus:border-[var(--primary-500)] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-color)] mb-1.5">
                  Location (City)
                </label>
                <input
                  type="text"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--text-color)] text-sm focus:border-[var(--primary-500)] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="btn w-full mt-2"
                style={{ cursor: "pointer" }}
              >
                {isUpdatingProfile ? "Saving changes..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="admin-card">
            <h3 className="text-base font-bold mb-4 text-[var(--text-color)] flex items-center gap-2">
              <Lock className="h-4 w-4 text-[var(--primary-500)]" />
              Update Account Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="admin-form">
              <div>
                <label className="block text-xs font-bold text-[var(--text-color)] mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--text-color)] text-sm focus:border-[var(--primary-500)] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-color)] mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--text-color)] text-sm focus:border-[var(--primary-500)] outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="btn w-full mt-2"
                style={{ cursor: "pointer" }}
              >
                {isUpdatingPassword ? "Updating password..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
