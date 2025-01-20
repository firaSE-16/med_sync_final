// /src/components/Chat.js
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';

const Chat = ({ userRole }) => {
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Fetch users (patients or doctors)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/message/user', { withCredentials: true });
        const filteredUsers = response.data.filter(user => user.role === (userRole === 'doctor' ? 'patient' : 'doctor'));
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };
    fetchUsers();
  }, [userRole]);

  // Join a chat room and listen for messages
  useEffect(() => {
    if (socket && currentChat) {
      socket.emit('join_room', currentChat._id);

      socket.on('receive_message', message => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket, currentChat]);

  // Fetch chat messages
  const fetchMessages = async userId => {
    try {
      const response = await axios.get(`/api/message/${userId}`, { withCredentials: true });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(`/api/message/send/${currentChat._id}`, { text: newMessage }, { withCredentials: true });
      socket.emit('send_message', { ...response.data, roomId: currentChat._id });
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <h3>{userRole === 'doctor' ? 'Patients' : 'Doctors'}</h3>
        {users.map(user => (
          <div
            key={user._id}
            style={{
              padding: '10px',
              margin: '10px 0',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
            onClick={() => {
              setCurrentChat(user);
              fetchMessages(user._id);
            }}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, padding: '1rem' }}>
        {currentChat ? (
          <>
            <h3>Chat with {currentChat.name}</h3>
            <div
              style={{
                height: '70%',
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: '1rem',
              }}
            >
              {messages.map((msg, index) => (
                <div key={index} style={{ margin: '10px 0' }}>
                  <strong>{msg.senderId === 'currentUserId' ? 'You' : currentChat.name}</strong>: {msg.text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', marginTop: '10px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message"
                style={{ flex: 1, padding: '10px' }}
              />
              <button onClick={handleSendMessage} style={{ padding: '10px' }}>
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
