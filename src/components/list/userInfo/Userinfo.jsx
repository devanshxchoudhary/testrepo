import React from 'react'
import "./userInfo.css"
import { useUserStore } from "../../../lib/userStore";

const Userinfo = () => {

  const {currentUser} = useUserStore();
  return (
    <div className='userInfo'>
      <div className='user'>
      <img src={currentUser.avatar || "./avatar.png"} alt="User Avatar" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className='icons'>
        <img src = "./more.png" alt = "" />
        <img src = "./camera.png" alt = "" />
        <img src = "./edit.png" alt = "" />
      </div>
    </div>
  )
}

export default Userinfo
