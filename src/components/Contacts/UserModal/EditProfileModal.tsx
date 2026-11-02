import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { CurrentUserType } from "../../../redux/authSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Avatar, { GenderType } from "../../Common/Avatar";

interface Props {
  close: () => void;
}

const EditProfileModal: React.FC<Props> = ({ close }) => {
  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  const [username, setUsername] = useState(currentUser?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || "");
  const [gender, setGender] = useState<GenderType>(
    (currentUser?.gender as GenderType) || "unspecified"
  );
  const [saving, setSaving] = useState(false);

  const stopClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.warning("Username cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, {
        username: username.trim(),
        avatar: avatarUrl.trim() || null,
        gender,
      });
      toast.success("Profile updated successfully!");
      close();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div onClick={close} className="find-user-modal">
      <div onClick={stopClick} className="inner-user-modal profile-modal-card">
        <h2 style={{ marginBottom: "16px" }}>Edit Profile</h2>

        <div className="profile-modal-header">
          <Avatar
            src={avatarUrl.trim() || null}
            gender={gender}
            alt={username}
          />
        </div>

        <form onSubmit={handleSave} className="edit-profile-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
            />
          </div>

          <div className="form-group">
            <label>Profile Image URL (Leave empty for default avatar)</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="form-group">
            <label>Gender (Sets default avatar background color)</label>
            <div className="gender-selector">
              <button
                type="button"
                className={`gender-btn ${gender === "male" ? "active male" : ""}`}
                onClick={() => setGender("male")}
              >
                Male
              </button>
              <button
                type="button"
                className={`gender-btn ${
                  gender === "female" ? "active female" : ""
                }`}
                onClick={() => setGender("female")}
              >
                Female
              </button>
              <button
                type="button"
                className={`gender-btn ${
                  gender === "unspecified" ? "active unspecified" : ""
                }`}
                onClick={() => setGender("unspecified")}
              >
                Unspecified
              </button>
            </div>
          </div>

          <div className="profile-modal-actions" style={{ marginTop: "16px" }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="btn-close" onClick={close}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
