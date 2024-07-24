import React, { useEffect, useState, useRef } from 'react';
import "./chat.css";
import EmojiPicker from 'emoji-picker-react';
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from '../../lib/chatStore';
import upload from "../../lib/upload";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [chat, setChat] = useState();
  const [img, setImg] = useState({ file: null, url: "" });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    if (chatId) {
      console.log("Fetching chat data for chatId:", chatId);
      const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
        console.log("Chat data fetched:", res.data());
        setChat(res.data());
      });

      return () => {
        unSub();
      };
    }
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "" && !img.file) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
        console.log("Image URL after upload:", imgUrl);
      }

      const newMessage = {
        senderId: currentUser.id,
        text,
        createdAt: new Date(),
        ...(imgUrl && { img: imgUrl }),
      };

      console.log("New message object:", newMessage);

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(newMessage),
      });

      const userIDs = [currentUser.id, user.id];

      for (const id of userIDs) {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setImg({ file: null, url: "" });
      setText("");
    }
  };

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="User Avatar" />
          <div className="texts">
            <span>{user?.username}</span>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="Phone Icon" />
          <img src="./video.png" alt="Video Icon" />
          <img src="./info.png" alt="Info Icon" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message.createdAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="Sent Image" />}
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="Preview" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="Upload Icon" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="Camera Icon" />
          <img src="./mic.png" alt="Mic Icon" />
        </div>
        <input
          type="text"
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message !":'Type a message...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt="Emoji Icon"
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
