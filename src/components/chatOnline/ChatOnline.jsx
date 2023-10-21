import { Avatar } from '@mui/material'
import "./chatOnline.css"
import { useSelector } from 'react-redux';

export default function ChatOnline({ onlineUsers, userId, setCurrentChat, userFriends }) {
  const token = useSelector(state => state.token);

  const showChat = async (userFriend) => {
    try {
      const res = await fetch(`https://connectserver.onrender.com/chats/getConversation/${userId}/${userFriend._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(res.status===200){
      const conversation = await res.json();
      setCurrentChat(conversation);
    }
      else if(res.status===404){
        console.log(userId , userFriend._id)
       const newConversationResponse= await fetch(`https://connectserver.onrender.com/chats/createConversation`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":"application/json"
          },
          body:JSON.stringify({senderId:userId,receiverId:userFriend._id})
        })


      const newConversation = await newConversationResponse.json();
      setCurrentChat(newConversation);
      }
    }
    catch (err) {
      console.log(err);
    }

   
  }
  return (
    <div className="chatOnline">
      Your Friends
      {userFriends.map((userFriend, i) => (
        <div key={i} className="chatOnlineFriend" onClick={() => showChat(userFriend)}>
          <div className="chatOnlineImgContainer">
            <Avatar src={`https://res.cloudinary.com/ddrbtlpxj/${userFriend?.picturePath}`} sx={{ border: "1px solid white", width: "34px", height: "34px" }} />
            {onlineUsers.includes(userFriend)?(<div className="chatOnlineBadge"></div>):null}
          </div>
          <span className="chatOnlineName">{userFriend.firstName + " " + userFriend.lastName}</span>
        </div>
      ))}

    </div>
  )
}
