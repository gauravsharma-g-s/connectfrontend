import { Box, Avatar } from '@mui/material'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function ActiveFriends({ onlineUsers, userId, setCurrentChat }) {
  const token = useSelector(state => state.token);
  const [userFriends, setUserFriends] = useState(null)

  const getFriends = async () => {
    const response = await fetch(`https://connectserver.onrender.com/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const data = await response.json();
    setUserFriends(data)
  };

  const showChat = async (userFriend) => {
    try {
      const res = await fetch(`http://localhost:3001/chats/getConversation/${userId}/${userFriend._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        const conversation = await res.json();
        setCurrentChat(conversation);
      }
      else if (res.status === 404) {
        console.log(userId, userFriend._id)
        const newConversationResponse = await fetch(`http://localhost:3001/chats/createConversation`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ senderId: userId, receiverId: userFriend._id })
        })


        const newConversation = await newConversationResponse.json();
        setCurrentChat(newConversation);
      }
    }
    catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    getFriends();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <Box display='flex' sx={{ mr: '10px', overflow: 'auto' }}>
      {userFriends?.map((userFriend, i) => (
        <Box key={i} sx={{ position: 'relative' }}>
          <Avatar src={`https://res.cloudinary.com/ddrbtlpxj/${userFriend?.picturePath}`} onClick={() => showChat(userFriend)}
            sx={{
              width: "44px", height: "44px", cursor: 'pointer', ml: '8px', mt: '12px',
              border: '2px solid black'
            }} />    
          {onlineUsers.includes(userFriend._id) ? (<div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'limegreen',
            position: 'absolute',
            top: '10px',
            right: '2px'
          }}></div>) : null}
        </Box>
      ))}

    </Box>
  )
}
