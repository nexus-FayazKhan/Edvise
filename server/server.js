const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const { addUser, getUser, removeUser, getUsersInRoom } = require('./utils/users');

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let roomIdGlobal, imgURLGlobal;
// Store pending join requests
const pendingRequests = new Map(); // roomId -> Map of pending requests (socketId -> request)
const approvedUsers = new Map(); // roomId -> Set of approved socketIds

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When admin creates a room
    socket.on('createRoom', (data) => {
        const { email, userId, username, imageUrl, roomId } = data;
        socket.join(roomId);
        const users = addUser({
            email,
            userId,
            username,
            imageUrl,
            roomId,
            host: true,
            guest: false,
            socketId: socket.id,
        });
        socket.emit('roomCreated', { success: true, roomId });
        io.to(roomId).emit('userJoined', { userId, username, email });
        roomIdGlobal = roomId;
    });

    // When a user requests to join
    socket.on('requestJoin', (data) => {
        const { email, userId, username, imageUrl, roomId } = data;
        console.log('Join request received:', { email, username, roomId });
        
        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room) {
            console.log('Room not found:', roomId);
            socket.emit('joinResponse', { 
                success: false, 
                message: 'Room does not exist' 
            });
            return;
        }

        // Get the admin's socket ID
        const users = getUsersInRoom(roomId);
        const admin = users.find(user => user.host);

        if (!admin) {
            console.log('Admin not found for room:', roomId);
            socket.emit('joinResponse', {
                success: false,
                message: 'Room admin not found'
            });
            return;
        }

        console.log('Found admin:', admin);

        // Store the request
        if (!pendingRequests.has(roomId)) {
            pendingRequests.set(roomId, new Map());
        }
        pendingRequests.get(roomId).set(socket.id, {
            email,
            userId,
            username,
            imageUrl,
            socketId: socket.id
        });

        // Send join request to admin
        console.log('Sending join request to admin:', admin.socketId);
        io.to(admin.socketId).emit('joinRequest', {
            email,
            userId,
            username,
            imageUrl,
            socketId: socket.id,
            roomId
        });
        
        // Notify the user that their request is pending
        socket.emit('joinResponse', {
            success: true,
            status: 'pending',
            message: 'Waiting for admin approval'
        });
    });

    // When admin responds to join request
    socket.on('respondToJoinRequest', (data) => {
        const { approved, socketId, roomId } = data;
        console.log('Join request response:', data);
        
        const pendingRequest = pendingRequests.get(roomId)?.get(socketId);
        if (!pendingRequest) {
            console.log('No pending request found:', { socketId, roomId });
            return;
        }

        // Remove from pending requests
        pendingRequests.get(roomId).delete(socketId);
        
        if (approved) {
            const { email, userId, username, imageUrl } = pendingRequest;
            console.log('Approving join request for:', username);
            
            // Add user to room
            const users = addUser({
                email,
                userId,
                username,
                imageUrl,
                roomId,
                host: false,
                guest: true,
                socketId
            });
            
            // Get the socket instance for the joining user
            const userSocket = io.sockets.sockets.get(socketId);
            if (userSocket) {
                userSocket.join(roomId);
                
                // Notify the user they're approved
                io.to(socketId).emit('joinResponse', { 
                    success: true,
                    status: 'approved',
                    roomId,
                    users: getUsersInRoom(roomId)
                });

                // Notify all users in room about new participant
                io.to(roomId).emit('userJoined', {
                    userId,
                    username,
                    email
                });
            } else {
                console.log('User socket not found:', socketId);
            }
        } else {
            console.log('Rejecting join request for socket:', socketId);
            // Notify the user they're rejected
            io.to(socketId).emit('joinResponse', {
                success: false,
                status: 'rejected',
                message: 'Your join request was rejected'
            });
        }
    });

    socket.on('UserJoined', (data) => {
        const { email, userId, username, imageUrl, roomId, host, guest } = data;
        console.log('User joined room:', { username, roomId, host, guest });
        
        roomIdGlobal = roomId;
        socket.join(roomId);
        
        const users = addUser({
            email,
            userId,
            username,
            imageUrl,
            roomId,
            host,
            guest,
            socketId: socket.id,
        });

        // Notify the user who joined
        socket.emit('UserIsJoined', { users, success: true });
        
        // Notify other users in the room
        socket.broadcast.to(roomId).emit('allUsers', users);
        
        // Send current canvas state to new user
        if (imgURLGlobal) {
            socket.emit('drawingResponse', { imageUrl: imgURLGlobal });
        }
    });

    // Handle drawing events
    socket.on('draw', (data) => {
        const { roomId, drawData } = data;
        // Broadcast the drawing data to all other users in the room
        socket.to(roomId).emit('draw', drawData);
    });

    socket.on('clearCanvas', ({ roomId }) => {
        // Broadcast canvas clear to all other users in the room
        socket.to(roomId).emit('clearCanvas');
    });

    socket.on('canvas-update', ({ roomId, canvasData }) => {
        imgURLGlobal = canvasData;
        socket.broadcast.to(roomId).emit('canvas-update', canvasData);
    });

    socket.on('drawing', (data) => {
        imgURLGlobal = data.imageUrl;
        socket.broadcast.to(roomIdGlobal).emit('drawingResponse', {
            imageUrl: data.imageUrl,
        });
    });

    // Handle chat messages
    socket.on('chatMessage', (messageData) => {
        const { roomId } = messageData;
        console.log('Chat message received:', messageData);

        // Verify room exists and socket is in the room
        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room) {
            console.log('Room not found for message:', roomId);
            return;
        }

        // Verify sender is in the room
        const users = getUsersInRoom(roomId);
        const sender = users.find(u => u.socketId === socket.id);
        if (!sender) {
            console.log('Sender not found in room:', socket.id);
            return;
        }

        console.log('Broadcasting message to room:', roomId, 'from user:', sender.username);
        
        // Broadcast to everyone in the room
        io.to(roomId).emit('chatMessage', {
            ...messageData,
            timestamp: new Date().toISOString()
        });
    });

    // Remove old message handlers
    socket.on('sendMessage', (data) => {
        console.log('Warning: Using deprecated sendMessage event');
        const { roomId, message, sender } = data;
        io.to(roomId).emit('receiveMessage', {
            message,
            sender,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('message', (data) => {
        const { message } = data;
        const user = getUser(socket.id);
        if (user) {
            socket.broadcast.to(roomIdGlobal).emit('messageResponse', {
                message,
                email: user.email,
                timestamp: new Date(),
            });
        }
    });

    socket.on('disconnect', () => {
        const user = getUser(socket.id);
        if (user) {
            const roomId = user.roomId;
            
            // If admin disconnects, notify all pending requests
            if (user.host) {
                const roomRequests = pendingRequests.get(roomId);
                if (roomRequests) {
                    roomRequests.forEach((request, socketId) => {
                        io.to(socketId).emit('joinResponse', {
                            success: false,
                            message: 'Room admin disconnected'
                        });
                    });
                    pendingRequests.delete(roomId);
                }
                approvedUsers.delete(roomId);
            }
            
            removeUser(socket.id);
            io.to(roomId).emit('userLeft', { userId: user.userId });
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
