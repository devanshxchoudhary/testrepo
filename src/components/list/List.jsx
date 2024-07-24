import React from 'react';
import ChatList from './chatList/ChatList'; // Adjust the import path based on your directory structure
import './list.css';
import Userinfo from './userInfo/Userinfo';

const List = () => {
  return (
    <div className='list'>
      <Userinfo />
      <ChatList/> {/* Ensure this path is correct */}
    </div>
  );
}

export default List;
