import { Avatar } from "@mui/material";
import "./chats.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

function Chats({ conversation, userId }) {
  const chatters = conversation.chatters;
  const token = useSelector((state) => state.token);
  const [friend, setFriend] = useState(null);
  const sentTime = new Date(conversation.sentTime);

  const defaultAvatar =
    "https://res.cloudinary.com/ddrbtlpxj/image/upload/v1767507405/profiles/7ae28c97-cb1f-4d1d-b74c-4db76b2081ad_xp2shk.jpg";
  const getFriend = async (req, res) => {
    const friendId = chatters.find((id) => id !== userId); // Get the other chatter Id

    const response = await fetch(`https://connectserver.onrender.com/users/${friendId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const friend = await response.json();
    setFriend(friend);
  };
  useEffect(() => {
    getFriend();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="chat">
      <Avatar
        src={
          friend?.picturePath
            ? `https://res.cloudinary.com/ddrbtlpxj/${friend?.picturePath}`
            : defaultAvatar
        }
        sx={{ marginRight: "10px" }}
      />
      <div className="senderDetails">
        <span className="chatName">
          {friend?.firstName + " " + friend?.lastName}
        </span>
        <span
          style={{ fontWeight: 600, fontSize: "0.8rem" }}
          className="truncate-text"
        >
          {!conversation.isRead && conversation.sender !== userId
            ? conversation.lastMessage.slice(0, 10)
            : ""}
        </span>
      </div>
      <div className="timeDetails">
        {!conversation.isRead && conversation.sender !== userId ? (
          <span
            style={{
              backgroundColor: "#41C941",
              width: "18px",
              fontWeight: 600,
              height: "18px",
              borderRadius: "50%",
              marginLeft: "auto",
              color: "#8E41C9",
              textAlign: "center",
            }}
          >
            {conversation.count}
          </span>
        ) : null}
        <span style={{ fontWeight: 600, fontSize: "0.8rem" }}>
          {!conversation.isRead &&
          conversation.sender !== userId &&
          !isNaN(sentTime)
            ? timeAgo.format(sentTime)
            : ""}
        </span>
      </div>
    </div>
  );
}

export default Chats;
