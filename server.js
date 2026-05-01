/**
 * Nexus Meet — Production Signaling Server
 * Node.js + Express + Socket.io
 * 
 * Install: npm install express socket.io jsonwebtoken bcryptjs mongoose cors helmet
 * Run:     node server.js
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PORT = process.env.PORT || 3000;

// In-memory stores (use MongoDB/Redis in production)
const users = new Map();
const rooms = new Map();

// ─── AUTH ROUTES ───────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (users.has(email)) return res.status(409).json({ error: 'Email already registered' });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = { id: Date.now().toString(), name, email, password: hashedPassword };
  users.set(email, user);

  const token = jwt.sign({ id: user.id, name, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name, email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, name: user.name, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email } });
});

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ─── SOCKET.IO SIGNALING ───────────────────────────────────
io.use((socket, next) => {
  // Allow guest connections without token
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      socket.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      socket.user = { name: 'Guest', id: socket.id };
    }
  } else {
    socket.user = { name: socket.handshake.auth.name || 'Guest', id: socket.id };
  }
  next();
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.name} (${socket.id})`);

  // Join a room
  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);

    if (!rooms.has(roomId)) rooms.set(roomId, new Map());
    const room = rooms.get(roomId);
    room.set(socket.id, { id: socket.id, name: socket.user.name });

    // Notify others of new peer
    socket.to(roomId).emit('user-joined', {
      peerId: socket.id,
      name: socket.user.name,
      participants: [...room.values()],
    });

    // Send current room state to new joiner
    socket.emit('room-state', {
      roomId,
      participants: [...room.values()],
    });

    console.log(`${socket.user.name} joined room ${roomId}`);
  });

  // WebRTC Signaling
  socket.on('offer', ({ to, offer }) => {
    socket.to(to).emit('offer', { from: socket.id, name: socket.user.name, offer });
  });

  socket.on('answer', ({ to, answer }) => {
    socket.to(to).emit('answer', { from: socket.id, answer });
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
  });

  // Chat message — broadcast to room
  socket.on('chat-message', ({ roomId, text }) => {
    io.to(roomId).emit('chat-message', {
      from: socket.id,
      name: socket.user.name,
      text,
      time: new Date().toISOString(),
    });
  });

  // Whiteboard sync
  socket.on('whiteboard-draw', ({ roomId, drawData }) => {
    socket.to(roomId).emit('whiteboard-draw', { from: socket.id, drawData });
  });

  socket.on('whiteboard-clear', ({ roomId }) => {
    socket.to(roomId).emit('whiteboard-clear');
  });

  // Media state changes
  socket.on('media-state', ({ roomId, micOn, camOn }) => {
    socket.to(roomId).emit('peer-media-state', { peerId: socket.id, micOn, camOn });
  });

  // Leave room
  socket.on('leave-room', ({ roomId }) => {
    handleLeave(socket, roomId);
  });

  socket.on('disconnect', () => {
    // Clean up all rooms
    rooms.forEach((room, roomId) => {
      if (room.has(socket.id)) handleLeave(socket, roomId);
    });
    console.log(`User disconnected: ${socket.user.name}`);
  });
});

function handleLeave(socket, roomId) {
  socket.leave(roomId);
  const room = rooms.get(roomId);
  if (room) {
    room.delete(socket.id);
    if (room.size === 0) rooms.delete(roomId);
    else socket.to(roomId).emit('user-left', { peerId: socket.id, name: socket.user.name });
  }
}

// ─── START ─────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 Nexus Meet server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io signaling active`);
  console.log(`🔐 JWT auth enabled\n`);
});
