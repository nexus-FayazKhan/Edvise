import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const MentorChat = () => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [connectedMentees, setConnectedMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    // Fetch connected mentees
    const fetchConnectedMentees = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/users/mentees?mentorId=${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setConnectedMentees(data);
        }
      } catch (error) {
        console.error('Error fetching mentees:', error);
        toast.error('Failed to load mentees');
      }
    };

    fetchConnectedMentees();

    // Setup socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  const handleSelectMentee = async (mentee) => {
    setSelectedMentee(mentee);
    if (!socket) return;

    // Create/join chat room
    const sortedIds = [user.id, mentee._id].sort();
    const roomId = `room_${sortedIds.join('_')}`;
    
    socket.emit('createRoom', {
      roomId,
      userId: user.id,
      username: user.username || user.firstName,
      email: user.primaryEmailAddress.emailAddress,
      imageUrl: user.imageUrl,
    });

    // Get chat history
    try {
      const response = await fetch(
        `http://localhost:5001/api/messages/${user.id}/${mentee._id}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMentee || !socket) return;

    const sortedIds = [user.id, selectedMentee._id].sort();
    const roomId = `room_${sortedIds.join('_')}`;

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

  useEffect(() => {
    if (!socket) return;

    socket.on('chatMessage', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [socket]);

  if (!user) return <div>Please sign in to access your chats.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary flex">
      {/* Mentees Sidebar */}
      <div className="w-64 bg-white dark:bg-dark-secondary shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Connected Mentees</h2>
        {connectedMentees.length > 0 ? (
          <ul className="space-y-2">
            {connectedMentees.map((mentee) => (
              <li
                key={mentee._id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-content ${
                  selectedMentee?._id === mentee._id ? 'bg-gray-100 dark:bg-dark-content' : ''
                }`}
                onClick={() => handleSelectMentee(mentee)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {mentee.username[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{mentee.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No connected mentees yet.</p>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4">
        {selectedMentee ? (
          <div className="h-full flex flex-col bg-white dark:bg-dark-secondary rounded-lg shadow-lg">
            {/* Chat Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chat with {selectedMentee.username}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.userId === user.id ? 'justify-end' : 'justify-start'}`}
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
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Select a mentee to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorChat;
