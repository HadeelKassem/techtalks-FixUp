import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyClientProfile,
  updateMyClientProfile,
} from "../api";
import "./ClientProfile.css";


export default function ClientProfile() {

  const navigate = useNavigate();


  const emptyProfile = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    profilePictureUrl: "",
  };


  const [client, setClient] = useState(emptyProfile);

  const [formData, setFormData] = useState(emptyProfile);

  const [isEditing, setIsEditing] = useState(false);


  const [profileImage, setProfileImage] = useState(null);

  const [tempProfileImage, setTempProfileImage] = useState(null);



  // =========================
  // LOAD PROFILE FROM DATABASE
  // =========================

  useEffect(() => {


    async function loadProfile() {

      try {

        const data = await getMyClientProfile();


        setClient(data);

        setFormData(data);


        if (data.profilePictureUrl) {

          setProfileImage(data.profilePictureUrl);

          setTempProfileImage(data.profilePictureUrl);

        }


      } catch (error) {

        console.error(
          "Failed to load profile:",
          error
        );

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

      setTempProfileImage(
        URL.createObjectURL(file)
      );

    }


  }

  function handleDeleteImage() {

    setTempProfileImage(null);

  } 
  // SAVE PROFILE TO DATABASE

  async function handleSave() {
    try {


      const updated =
        await updateMyClientProfile({

          name: formData.name,

          phone: formData.phone,

          address: formData.address,

          city: formData.city,

          profilePictureUrl:
            tempProfileImage,

        });



      setClient(updated);

      setFormData(updated);


      setProfileImage(
        updated.profilePictureUrl
      );


      setIsEditing(false);



    } catch (error) {


      console.error(
        "Update failed:",
        error
      );


      alert(
        "Failed to update profile"
      );


    }


  }







  function handleCancel() {


    setFormData(client);

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


          <h1>
            Client Profile
          </h1>
          <p>
            Manage your personal information.
          </p>
        </div>

        <div className="profile-image-section">
          <img
            src={

              (isEditing
                ? tempProfileImage
                : profileImage)

              ||

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

                hidden

                onChange={handleImageChange}

              />
              <div className="image-actions">
                <label

                  htmlFor="upload-image"

                  className="image-link"

                >

                  Change Photo

                </label>
                {tempProfileImage && (

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

        <div className="grid">
          <div className="input-group">

            <label>
              Name
            </label>
            <input

              type="text"

              name="name"

              value={
                isEditing
                  ? formData.name
                  : client.name
              }

              onChange={handleChange}

              readOnly={!isEditing}

            />

          </div>
          <div className="input-group">

            <label>
              Email
            </label>
            <input

              type="email"

              value={client.email}

              readOnly

            />
          </div>
          <div className="input-group">

            <label>
              Phone
            </label>
            <input

              type="text"

              name="phone"

              value={
                isEditing
                  ? formData.phone
                  : client.phone
              }

              onChange={handleChange}

              readOnly={!isEditing}

            />
          </div>
          <div className="input-group">

            <label>
              City
            </label>

            <input

              type="text"

              name="city"

              value={
                isEditing
                  ? formData.city
                  : client.city
              }

              onChange={handleChange}

              readOnly={!isEditing}

            />


          </div>
          <div className="input-group full-width">
            <label>
              Address
            </label>
            <input

              type="text"

              name="address"

              value={
                isEditing
                  ? formData.address
                  : client.address
              }

              onChange={handleChange}

              readOnly={!isEditing}

            />


          </div>
        </div>
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