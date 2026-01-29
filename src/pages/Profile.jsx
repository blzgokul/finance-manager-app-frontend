import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currency: "INR",
    notificationsEnabled: true,
    preferredCategories: [],
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ======================
     AUTH + FETCH PROFILE
  ======================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/users/profile");

      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        currency: res.data.currency || "INR",
        notificationsEnabled:
          res.data.notificationsEnabled ?? true,
        preferredCategories:
          res.data.preferredCategories || [],
      });
    } catch (err) {
      console.error("Failed to load profile", err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UPDATE PROFILE
  ======================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put("/api/users/profile", {
        name: profile.name,
        currency: profile.currency,
        notificationsEnabled: profile.notificationsEnabled,
        preferredCategories: profile.preferredCategories,
      });

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Profile update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold">👤 Profile</h1>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium">
            Email
          </label>
          <input
            value={profile.email}
            disabled
            className="w-full border p-2 bg-gray-100"
          />
        </div>

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium">
            Name
          </label>
          <input
            className="w-full border p-2"
            value={profile.name}
            onChange={(e) =>
              setProfile({
                ...profile,
                name: e.target.value,
              })
            }
          />
        </div>

        {/* CURRENCY */}
        <div>
          <label className="block text-sm font-medium">
            Currency
          </label>
          <select
            className="w-full border p-2"
            value={profile.currency}
            onChange={(e) =>
              setProfile({
                ...profile,
                currency: e.target.value,
              })
            }
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>

        {/* NOTIFICATIONS */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={profile.notificationsEnabled}
            onChange={(e) =>
              setProfile({
                ...profile,
                notificationsEnabled: e.target.checked,
              })
            }
          />
          Enable Notifications
        </label>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Save Profile
        </button>
      </form>
    </div>
  );
}