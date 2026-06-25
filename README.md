# WhatZap 💬

WhatZap is a full-stack, real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js) with Socket.io for instantaneous message delivery and Cloudinary for media uploads. It provides a polished, interactive chat experience complete with image attachments and user profiles.

---

## 🚀 Key Features

*   **Real-Time Messaging**: Instant message delivery using WebSockets via Socket.io.
*   **Authentication & Authorization**: Secure signup, login, and session persistence using JWT stored in `httpOnly` cookies.
*   **Media Sharing**: Send text messages or share images (processed as Base64 and stored securely via Cloudinary).
*   **User Directory & Presence**: View other registered contacts and check who is currently online in real-time.
*   **User Profiles**: Customizable profile avatars uploaded directly to Cloudinary.
*   **Sleek Responsive UI**: Fully responsive interface built with React, TailwindCSS, and DaisyUI.

---

## 🛠️ Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose ODM)
*   **Real-time Communication**: Socket.io
*   **Storage**: Cloudinary API (for media assets)
*   **Authentication**: JWT (JSON Web Tokens) & bcryptjs

### Frontend
*   **Bundler**: Vite
*   **Framework**: React (v18)
*   **State Management**: Zustand
*   **Client API**: Axios
*   **Styling**: TailwindCSS & DaisyUI
*   **Icons**: Lucide React
*   **Notifications**: React Hot Toast

---

## 📦 Getting Started

### Prerequisites
*   Node.js (v18.x or above recommended)
*   MongoDB (Local server or Atlas URL)
*   Cloudinary Account (Cloud Name, API Key, API Secret)

### 1. Clone & Setup
Clone the repository and install dependencies in both the backend and frontend folders:

```bash
# Clone the repository (or navigate to directory)
cd WhatZap

# Install backend dependencies
cd back
npm install

# Install frontend dependencies
cd ../front
npm install
```

### 2. Configure Environment Variables
Create a `.env` file inside the `back/` directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Run the Application

#### Start Backend Server
From the `back/` directory:
```bash
npm run dev
```
The server will boot up on `http://localhost:5001`.

#### Start Frontend Client
From the `front/` directory:
```bash
npm run dev
```
Access the client at `http://localhost:5173` (or `http://localhost:5174` if port 5173 is occupied).

> **Note on CORS:** The backend CORS configuration allows connections from both `http://localhost:5173` and `http://localhost:5174`. This ensures smooth client-server communication without CORS restrictions regardless of which local port Vite selects.

---

## 📁 Repository Structure

```text
WhatZap/
├── back/                      # Backend Node/Express Server
│   ├── src/
│   │   ├── lib/               # Database, Cloudinary & Socket helpers
│   │   ├── middlewares/       # Auth guard middlewares
│   │   ├── models/            # Mongoose Schemas (User, Message)
│   │   └── routes/            # REST API endpoints (Auth, Message)
│   └── index.js               # Express application entrypoint
│
└── front/                     # Frontend Vite + React Client
    ├── src/
    │   ├── components/        # Sidebar, ChatContainer, Navbar, etc.
    │   ├── lib/               # Zustand stores & HTTP client
    │   └── pages/             # Home, Login, Signup, Profile pages
    └── index.html             # React entry document
```

---

## 📝 License
This project is licensed under the ISC License.
