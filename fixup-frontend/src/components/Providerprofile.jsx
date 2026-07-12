import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProviderProfile,
  updateMyProviderProfile,
} from "../api";
import "./ProviderProfile.css";


export default function ProviderProfile() {

  const navigate = useNavigate();

  const emptyProfile = {
    name: "",
    email: "",
    bio: "",
    skills: "",
    serviceArea: "",
    profilePictureUrl: "",
    verified: false,
    avgRating: 0,
  };

  const [provider, setProvider] = useState(emptyProfile);
  const [formData, setFormData] = useState(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);

  // =========================
  // LOAD PROFILE FROM DATABASE
  // =========================
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProviderProfile();
        setProvider(data);
        setFormData(data);

        if (data.profilePictureUrl) {
          setProfileImage(data.profilePictureUrl);
          setTempProfileImage(data.profilePictureUrl);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(err.message || "Couldn't load your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setTempProfileImage(URL.createObjectURL(file));
    }
  }

  function handleDeleteImage() {
    setTempProfileImage(null);
  }

  // SAVE PROFILE TO DATABASE
  async function handleSave() {
    try {
      const updated = await updateMyProviderProfile({
        bio: formData.bio,
        skills: formData.skills,
        serviceArea: formData.serviceArea,
        profilePictureUrl: tempProfileImage,
      });

      setProvider(updated);
      setFormData(updated);
      setProfileImage(updated.profilePictureUrl);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile");
    }
  }

  function handleCancel() {
    setFormData(provider);
    setTempProfileImage(profileImage);
    setIsEditing(false);
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        <button
          className="back-btn"
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {isEditing && (
          <button
            className="close-btn"
            type="button"
            onClick={handleCancel}
          >
            ✕
          </button>
        )}

        <div className="profile-header">
          <h1>Provider Profile</h1>
          <p>Manage how clients see you in the feed.</p>
        </div>

        {loading && <p className="profile-loading">Loading…</p>}
        {error && <div className="profile-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="profile-image-section">
              <img
                src={
                  (isEditing ? tempProfileImage : profileImage) ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(provider.name || "Provider") +
                    "&background=123a5c&color=fff&size=200"
                }
                alt="Profile"
                className="profile-image"
              />

              {isEditing && (
                <>
                  <input
                    id="upload-provider-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                  <div className="image-actions">
                    <label htmlFor="upload-provider-image" className="image-link">
                      Change Photo
                    </label>
                    {(isEditing ? tempProfileImage : profileImage) && (
                      <span className="delete-link" onClick={handleDeleteImage}>
                        Delete Photo
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="provider-status-row">
              {provider.verified && (
                <span className="verified-pill">✓ Verified</span>
              )}
              <span className="rating-pill">
                ★ {provider.avgRating?.toFixed?.(1) ?? provider.avgRating ?? 0}
              </span>
            </div>

            <div className="grid">
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  value={provider.name}
                  readOnly
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={provider.email}
                  readOnly
                />
              </div>

              <div className="input-group">
                <label>Service Area</label>
                <input
                  type="text"
                  name="serviceArea"
                  value={
                    isEditing
                      ? formData.serviceArea
                      : provider.serviceArea
                  }
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="e.g. Achrafieh, Beirut"
                />
              </div>

              <div className="input-group">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={
                    isEditing
                      ? formData.skills
                      : provider.skills
                  }
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="e.g. Plumbing, Pipe repair"
                />
              </div>

              <div className="input-group full-width">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={
                    isEditing
                      ? formData.bio
                      : provider.bio
                  }
                  onChange={handleChange}
                  readOnly={!isEditing}
                  rows={4}
                  placeholder="Tell clients about your experience..."
                />
              </div>
            </div>

            <div className="buttons">
              {!isEditing ? (
                <button
                  className="edit-btn"
                  type="button"
                  onClick={() => {
                    setFormData(provider);
                    setIsEditing(true);
                  }}
                >
                  Edit Settings
                </button>
              ) : (
                <>
                  <button
                    className="save-btn"
                    type="button"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}