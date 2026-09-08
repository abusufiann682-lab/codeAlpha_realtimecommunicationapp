# Nexus Meet — Real-Time Video Conferencing App

<div style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; border: 1px solid rgb(224, 224, 224); border-radius: 12px; padding: 20px; max-width: 500px; background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 8px;"><div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;"><img alt="Realtime Communication App " src="https://ph-files.imgix.net/886be735-aea3-46ec-aae6-03f821c080c7.png?auto=compress,format&amp;codec=mozjpeg&amp;cs=strip&amp;fit=crop&amp;h=80&amp;w=80" style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover; flex-shrink: 0;"><div style="flex: 1 1 0%; min-width: 0px;"><h3 style="margin: 0px; font-size: 18px; font-weight: 600; color: rgb(26, 26, 26); line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Realtime Communication App </h3><p style="margin: 4px 0px 0px; font-size: 14px; color: rgb(102, 102, 102); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">Build real-time chat and video calling with WebRTC </p></div></div><a href="https://www.producthunt.com/products/realtime-communication-app?embed=true&amp;utm_source=embed&amp;utm_medium=post_embed" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 4px; margin-top: 12px; padding: 8px 16px; background: rgb(255, 97, 84); color: rgb(255, 255, 255); text-decoration: none; border-radius: 9999px; font-size: 16px; font-weight: 600; line-height: 1.5;">Check it out on Product Hunt →</a></div>
> CodeAlpha Internship Task — Real-Time Communication Application

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=flat&logo=webrtc&logoColor=white)

---

## 🚀 Live Demo

Open `index.html` in any modern browser — no server required for the frontend demo.

---

## 📋 Features

| Feature | Technology |
|---|---|
| 🎥 Multi-user video calling | WebRTC `getUserMedia` |
| 🖥️ Screen sharing | WebRTC `getDisplayMedia` |
| 📁 File sharing | DataChannel / drag-and-drop |
| ✏️ Live collaborative whiteboard | HTML5 Canvas API |
| 💬 In-call chat | Socket.io (real-time events) |
| 🔐 End-to-end encryption | DTLS-SRTP (WebRTC default) |
| 👤 User authentication | JWT + bcrypt (simulated in demo) |
| ⏺️ Call recording | MediaRecorder API |
| 👥 Participant management | Real-time presence |

---

## 🛠️ Tech Stack

### Frontend
- **HTML5 / CSS3 / Vanilla JS** — zero framework dependencies
- **WebRTC** — peer-to-peer video/audio/data
- **Canvas API** — collaborative whiteboard
- **MediaRecorder API** — in-browser call recording
- **Web Storage API** — session persistence

### Backend (production setup)
- **Node.js + Express** — REST API server
- **Socket.io** — WebRTC signaling + real-time events
- **MongoDB** — user accounts and room metadata
- **Redis** — session caching and whiteboard state
- **JWT + bcrypt** — authentication and password hashing
- **AWS S3** — encrypted file storage

### Infrastructure
- **STUN server** — Google public STUN (`stun.l.google.com:19302`)
- **TURN server** — Coturn (self-hosted) for NAT traversal
- **HTTPS + TLS** — mandatory for WebRTC in production
- **DTLS-SRTP** — all media encrypted end-to-end

---

## 📁 Project Structure

```
codeAlpha_task/
├── index.html          # Complete single-file frontend app
├── README.md           # This file
└── (production/)
    ├── server.js       # Node.js + Socket.io signaling server
    ├── routes/
    │   ├── auth.js     # JWT authentication routes
    │   └── files.js    # File upload/download routes
    ├── models/
    │   └── User.js     # MongoDB user schema
    └── public/
        └── index.html  # Frontend (same as root index.html)
```

---

## ⚡ Quick Start

### Run the demo (frontend only)
```bash
git clone https://github.com/YOUR_USERNAME/codeAlpha_task.git
cd codeAlpha_task
# Open index.html in your browser
open index.html
```

### Production setup (full backend)
```bash
# Install dependencies
npm init -y
npm install express socket.io jsonwebtoken bcryptjs mongoose ioredis multer helmet cors express-rate-limit

# Set environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, AWS credentials

# Start server
node server.js
```

---

## 🔒 Security

- All WebRTC media streams are encrypted with **DTLS-SRTP** by default
- Passwords hashed with **bcrypt** (salt rounds: 12)
- API routes protected with **JWT Bearer tokens**
- HTTP security headers via **Helmet.js**
- File uploads validated and size-limited (100MB max)
- Rate limiting on auth endpoints (100 req/15min)

---

## 📸 Screenshots

| Landing Page | Video Room | Whiteboard |
|---|---|---|
| Dark themed landing with feature cards | Multi-tile video grid with toolbar | Full drawing tools with color picker |

---

## 👨‍💻 Author

Built as part of the **CodeAlpha Web Development Internship**.

---

## 📄 License

MIT License — free to use, modify, and distribute.
