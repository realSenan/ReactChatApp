import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CurrentUserType } from "../../../redux/authSlice";
import { sendFriendRequest } from "./ProfileModal";
import Avatar from "../../Common/Avatar";

interface Props {
  avatar: string | null;
  gender?: string;
  name: string;
  userId: string;
  close: () => void;
}

const ResultUser: React.FC<Props> = ({
  avatar,
  gender,
  name,
  userId,
  close,
}) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  const isSelf = currentUser?.id === userId;
  const isFriend = currentUser?.friends?.includes(userId);
  const isSent = currentUser?.sentRequests?.includes(userId);

  const handleAdd = async () => {
    if (isSelf) return;
    setLoading(true);
    try {
      await sendFriendRequest(currentUser, userId);
      close();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <figure className="result-user">
      <Avatar src={avatar} gender={gender} alt={name} />

      <figcaption className="result-user-description">
        <h3>{name}</h3>
        {!isSelf && (
          <button
            disabled={loading || isFriend || isSent}
            onClick={handleAdd}
          >
            {isFriend
              ? "Friends"
              : isSent
              ? "Request Sent"
              : "Add Friend"}
          </button>
        )}
      </figcaption>
    </figure>
  );
};

export default ResultUser;


