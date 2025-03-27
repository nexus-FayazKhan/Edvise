import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const ChatApp = () => {
  const { user } = useUser();
  const { mentorId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomId, setRoomId] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Create a unique room ID based on user and mentor IDs
    const sortedIds = [user.id, mentorId].sort();
    const uniqueRoomId = `room_${sortedIds.join('_')}`;
    setRoomId(uniqueRoomId);

    // Create or join room
    newSocket.emit('createRoom', {
      roomId: uniqueRoomId,
      userId: user.id,
      username: user.username || user.firstName,
      email: user.primaryEmailAddress.emailAddress,
      imageUrl: user.imageUrl,
    });

    // Socket event listeners
    newSocket.on('roomCreated', (data) => {
      if (data.success) {
        console.log('Room created/joined successfully');
      }
    });

    newSocket.on('chatMessage', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    newSocket.on('allUsers', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      newSocket.close();
    };
  }, [user, mentorId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      roomId,
      userId: user.id,
      username: user.username || user.firstName,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit('chatMessage', messageData);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-dark-secondary rounded-lg shadow-lg">
        {/* Chat Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Chat Room
          </h2>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {users.length} user(s) online
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[calc(100vh-300px)] overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.userId === user.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.userId === user.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-content text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {msg.username} • {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-tertiary text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;