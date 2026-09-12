# Bolt

A short-video social app built on the MERN stack. Users post short videos, scroll a feed, like and comment, and message each other directly. The UI takes cues from Reels and TikTok.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-media-3448C5?style=flat-square&logo=cloudinary&logoColor=white)

## Features

- JWT auth with bcrypt password hashing
- Video post creation with uploads handled by Multer and stored on Cloudinary
- Feed with the post grid and the vertical Bolt (short video) view
- Likes, comments, and shares
- Direct messages with conversation list and chat view
- Profile viewing and editing, plus account deletion
- Search across users and posts
- Theme toggle and a responsive layout

## Stack

- Frontend: React 18, Vite, React Router 6, Tailwind CSS 3, lucide-react
- Backend: Node.js, Express 5, Mongoose 8
- Media: Multer with `multer-storage-cloudinary`
- Auth: `jsonwebtoken` and `bcrypt`

## Layout

```
Backend/
  src/
    server.js
    config/db.js
    controllers/   auth, post, comment, message, user
    middleware/    authmiddleware, multer
    models/        User, Post, Comment, Message
    routes/        auth, post, comment, message, user
    utils/         cloudinary
Frontend/
  src/
    pages/         Home, Bolts, Messages, Profile, Login, Signup
    components/    PostCard, PostGrid, BoltCard, ChatInterface, modals, navbars
    context/       AuthContext, ThemeContext
    layouts/       AuthLayout, MainLayout
    services/      api client
```

## Getting started

Backend:

```bash
cd Backend
npm install
# create .env with MONGO_URI, PORT, SECRET_KEY,
# CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
npm run dev
```

Frontend:

```bash
cd Frontend
npm install
npm run dev
```

## Environment

| Variable                 | Used by | Notes                          |
| ------------------------ | ------- | ------------------------------ |
| `MONGO_URI`              | backend | MongoDB connection string      |
| `SECRET_KEY`             | backend | JWT signing key                |
| `PORT`                   | backend | API port                       |
| `CLOUDINARY_CLOUD_NAME`  | backend | Cloudinary account             |
| `CLOUDINARY_API_KEY`     | backend | Cloudinary key                 |
| `CLOUDINARY_API_SECRET`  | backend | Cloudinary secret              |

## Notes

- Video and image uploads require Cloudinary credentials, so the app will not run fully without them.
- `Frontend` currently has no `VITE_API_URL`; check `services/api.js` for the API base and point it at your backend if it differs from the default.
