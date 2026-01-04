import { Avatar } from "@mui/material";
import "./chatOnline.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function ChatOnline({ userId, setCurrentChat }) {
  const token = useSelector((state) => state.token);
  const [userFriends, setUserFriends] = useState(null);
  const onlineUsers = useSelector((state) => state.onlineUsers);
  const defaultAvatar =
    "https://res.cloudinary.com/ddrbtlpxj/image/upload/v1767507405/profiles/7ae28c97-cb1f-4d1d-b74c-4db76b2081ad_xp2shk.jpg";
  const getFriends = async () => {
    const response = await fetch(
      `https://connectserver.onrender.com/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setUserFriends(data);
  };

  const showChat = async (userFriend) => {
    try {
      const res = await fetch(
        `https://connectserver.onrender.com/chats/getConversation/${userId}/${userFriend._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        const conversation = await res.json();
        setCurrentChat(conversation);
      } else if (res.status === 404) {
        const newConversationResponse = await fetch(
          `https://connectserver.onrender.com/chats/createConversation`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              senderId: userId,
              receiverId: userFriend._id,
            }),
          }
        );

        const newConversation = await newConversationResponse.json();
        setCurrentChat(newConversation);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {}, [onlineUsers]);
  return (
    <div className="chatOnline">
      Your Friends
      {userFriends?.map((userFriend, i) => (
        <div
          key={i}
          className="chatOnlineFriend"
          onClick={() => showChat(userFriend)}
        >
          <div className="chatOnlineImgContainer">
            <Avatar
              src={
                userFriend?.picturePath
                  ? `https://res.cloudinary.com/ddrbtlpxj/${userFriend?.picturePath}`
                  : defaultAvatar
              }
              sx={{ border: "1px solid white", width: "34px", height: "34px" }}
            />
            {onlineUsers.some(
              (onlineUser) => onlineUser.userId === userFriend._id
            ) ? (
              <div className="chatOnlineBadge"></div>
            ) : null}
          </div>
          <span className="chatOnlineName">
            {userFriend.firstName + " " + userFriend.lastName}
          </span>
        </div>
      ))}
    </div>
  );
}
