import { useState } from "react";
import "./ClientProfile.css";

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);

  const initialData = {
  firstName: "Ghinwa",
  lastName: "Geagea",
  email: "ghinwa@example.com",
  phone: "+961 71 123 456",
  address: "Beirut, Lebanon",
};

const [client, setClient] = useState(initialData);

const [formData, setFormData] = useState(initialData);

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
  if (isEditing) {
    setTempProfileImage(null);
  } else {
    setProfileImage(null);
  }
}

  function handleSave() {
  const onlyLetters = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+961\s\d{2}\s\d{3}\s\d{3}$/;

  if (!onlyLetters.test(formData.firstName)) {
    alert("First Name must contain letters only.");
    return;
  }

  if (!onlyLetters.test(formData.lastName)) {
    alert("Last Name must contain letters only.");
    return;
  }

  if (!emailRegex.test(formData.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!phoneRegex.test(formData.phone)) {
    alert("Phone number must be in this format:\n+961 71 123 456");
    return;
  }

  setClient(formData);
  setProfileImage(tempProfileImage);
  setIsEditing(false);
}

  function handleCancel() {
  setFormData(client);
  setTempProfileImage(profileImage);
  setIsEditing(false);
}

  return (
    <div className="profile-page">
      <div className="profile-card">

        {isEditing && (
    <button
      type="button"
      className="close-btn"
      onClick={handleCancel}
    >
      ✕
    </button>
  )}

        <div className="profile-header">
          <h1>Client Profile</h1>
          <p>Manage your personal information.</p>
        </div>

        {/* Profile Picture */}

        <div className="profile-image-section">

          <img
            src={
  (isEditing ? tempProfileImage : profileImage) ||
  "https://ui-avatars.com/api/?name=User&background=e5e7eb&color=374151&size=200"
}
            alt="Profile"
            className="profile-image"
          />

          {isEditing && (
            <>
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />

              <div className="image-actions">

                <label
                  htmlFor="upload-image"
                  className="image-link"
                >
                  Change Photo
                </label>

               {(isEditing ? tempProfileImage : profileImage) && (
                  <span
                    className="delete-link"
                    onClick={handleDeleteImage}
                  >
                    Delete Photo
                  </span>
                )}

              </div>
            </>
          )}

        </div>

        {/* Form */}

        <div className="grid">

          <div className="input-group">
            <label>First Name</label>

            <input
              type="text"
              name="firstName"
              value={isEditing ? formData.firstName : client.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
          </div>

          <div className="input-group">
            <label>Last Name</label>

            <input
              type="text"
              name="lastName"
              value={isEditing ? formData.lastName : client.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={isEditing ? formData.email : client.email}
              onChange={handleChange}
              readOnly={!isEditing}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              value={isEditing ? formData.phone : client.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              required
              pattern="\+961\s\d{2}\s\d{3}\s\d{3}"
              placeholder="+961 71 123 456"
            />
          </div>

          <div className="input-group full-width">
            <label>Address</label>

            <input
              type="text"
              name="address"
              value={isEditing ? formData.address : client.address}
              onChange={handleChange}
              readOnly={!isEditing}
              placeholder="Beirut, Lebanon"
              required
            />
          </div>

        </div>

        {/* Buttons */}

        <div className="buttons">

          {!isEditing ? (

            <button
              className="edit-btn"
              type="button"
              onClick={() => {
  setFormData(client);
  setTempProfileImage(profileImage);
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

      </div>
    </div>
  );
}