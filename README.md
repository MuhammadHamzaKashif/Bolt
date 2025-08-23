# Bolt

---

Bolt is a full-stack social media application built with the MERN stack.
It lets users share short video posts, interact with others through likes, comments, and shares, and experience a modern UI inspired by TikTok and Instagram Reels.

---

## Features

- Authentication & Authorization with JWT
- Video posts with auto-play and custom controls
- Likes, comments, and shares system
- Search & filter support
- Dark/Light theme toggle (with shadcn/ui)
- Responsive UI with Tailwind CSS
- Optimized backend APIs with Express & MongoDB

---

## Tech Stack

# Frontend

- React
- Tailwind CSS
- shadcn/ui + lucide-react (icons)

# Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT (authentication)
- Bcrypt (password hashing)

---

# Project Structure

```
Bolt/
 |── backend/         # Express + MongoDB server
 |   ├── models/      # User, Post, etc.
 │   ├── routes/      # API routes
 │   ├── controllers/ # Business logic
 │   ├── middleware/  # Auth & validation
 │   └── server.js    # Entry point
 │
 │── frontend/        # React + Tailwind app
 │   ├── src/
 │   │   ├── components/  # Reusable UI
 │   │   ├── pages/       # App pages
 │   │   ├── utils/       # Helper functions
 │   │   └── App.jsx
 │   └── public/
 │
 └── README.md
```

---

## Future Improvements

- User profiles & follow system
- Notifications
- Real-time chat with Socket.io
- Deployment with Docker
