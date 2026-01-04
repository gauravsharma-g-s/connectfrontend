import NavbarPage from "scenes/navbar";
import "./messenger.css";
import Chats from "components/chats/Chats";
import Message from "components/message/Message";
import {
  IconButton,
  TextField,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import ChatOnline from "components/chatOnline/ChatOnline";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import ActiveFriends from "scenes/widgets/ActiveFriends";
import { updateOnlineUsers } from "state";

export default function Messenger() {
  const { _id } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { palette } = useTheme();
  const scrollRef = useRef();
  const socket = useRef();

  const isNonMobileScreens = useMediaQuery("(min-width:800px)");
  //  Get All Conversations
  const getConversations = async () => {
    const response = await fetch(
      `https://connectserver.onrender.com/chats/getConversations/${_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const userConversations = await response.json();
    setConversations(userConversations);
  };

  //  Get All Messages
  const getMessages = async () => {
    const response = await fetch(
      `https://connectserver.onrender.com/chats/getMessages/${currentChat?._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const messages = await response.json();

    if (response.status === 404) {
      setMessages([]);
    } else {
      setMessages((prev) => {
        if (
          prev[0]?.conversationId === currentChat?._id &&
          prev.length > messages.length
        ) {
          return prev;
        }
        return messages;
      });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      sender: _id,
      message: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.chatters.find((chatter) => chatter !== _id);

    try {
      socket.current?.emit("sendMessage", {
        conversationId: currentChat._id,
        senderId: _id,
        receiverId: receiverId,
        message: newMessage,
        isRead: false,
      });

      await fetch(
        `https://connectserver.onrender.com/chats/updateLastMessage/${currentChat._id}/${_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: newMessage }),
        }
      );

      const response = await fetch("https://connectserver.onrender.com/chats/sendMessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      const sentMessageRes = await response.json();

      setNewMessage("");
      setMessages([...messages, sentMessageRes]);
    } catch (err) {
      console.log(err);
    }
  };

  /* HANDLE CLICK ON CONVERSATION */
  const openConversation = async (conversation) => {
    try {
      setConversations((prevConversation) =>
        prevConversation.map((conv) =>
          conv._id === conversation._id
            ? { ...conv, isRead: true, count: 0 }
            : conv
        )
      );

      if (!conversation.isRead) {
        const response = await fetch(
          `https://connectserver.onrender.com/chats/markAsRead/${conversation._id}/${conversation.sender}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        conversation = await response.json();
      }
    } catch (err) {
      console.log(err);
    }
    setCurrentChat(conversation);
  };

  const currentChatRef = useRef(null);

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  useEffect(() => {
    getConversations();
    socket.current = io("https://connectserver.onrender.com", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.current.on("getMessage", (data) => {
      setConversations((prevConversation) => {
        return prevConversation.map((conv) =>
          conv._id === data.conversationId
            ? {
                ...conv,
                isRead: false,
                createdAt: Date.now(),
                lastMessage: data.message,
                sender: data.senderId,
                count: conv.count + 1,
                sentTime: Date.now(),
              }
            : conv
        );
      });

      if (
        currentChatRef.current &&
        currentChatRef.current._id === data.conversationId
      ) {
        setMessages((prev) => {
          const newMessages = [
            ...prev,
            {
              sender: data.senderId,
              message: data.message,
              createdAt: Date.now(),
            },
          ];
          return newMessages;
        });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getMessages();
  }, [currentChat, conversations]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);
  const dispatch = useDispatch();
  useEffect(() => {
    socket.current.emit("addUser", _id);
    socket.current.on("getUsers", (users) => {
      dispatch(updateOnlineUsers(users));
    });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box>
      <NavbarPage />
      <Box className="messenger">
        <div
          className="chatMenu"
          style={{ flex: !isNonMobileScreens ? "35%" : undefined }}
        >
          <div className="chatMenuWrapper" style={{ overflowX: "hidden" }}>
            <input placeholder="Search for Friends" className="chatMenuInput" />
            {!isNonMobileScreens && (
              <Box>
                <ActiveFriends userId={_id} setCurrentChat={setCurrentChat} />
              </Box>
            )}
            {conversations.map((conversation, i) => (
              <div key={i} onClick={() => openConversation(conversation)}>
                <Chats conversation={conversation} userId={_id} />
              </div>
            ))}
          </div>
        </div>
        <div
          className="chatBox"
          style={{ flex: !isNonMobileScreens ? "65%" : undefined }}
        >
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((message, i) => (
                    <div key={i} ref={scrollRef}>
                      <Message message={message} own={message.sender === _id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <TextField
                    fullWidth
                    placeholder="Write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  />
                  <IconButton disabled={!newMessage} onClick={handleSend}>
                    <Send
                      sx={{ fontSize: "30px", color: palette.primary.main }}
                    />
                  </IconButton>
                </div>
              </>
            ) : (
              <span className="startChat">
                Open a chat to start a Conversation !
              </span>
            )}
          </div>
        </div>

        {isNonMobileScreens && (
          <div className="chatOnline">
            <div className="chatOnlineWrapper">
              <ChatOnline userId={_id} setCurrentChat={setCurrentChat} />
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
}
