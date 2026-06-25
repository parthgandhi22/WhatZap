# Architecture Design (`archi.md`) 🗺️

This document describes the high-level architecture, data flow, and components of **WhatZap**.

---

## 🏛️ System Architecture Overview

WhatZap follows a decoupled **Client-Server Architecture** utilizing HTTP REST APIs for standard CRUD operations (authentication, profile updates, pulling historical messages) and WebSockets (via Socket.io) for real-time bidirection communication (sending/receiving messages, and checking online users).

```mermaid
graph TD
    subgraph Client [Frontend - React & Zustand]
        UI[UI Components: Sidebar, ChatContainer]
        AuthStore[UseAuthstore - Zustand]
        ChatStore[UseChatstore - Zustand]
        SocketClient[Socket.io-client]
    end

    subgraph Server [Backend - Express & Node.js]
        Index[index.js Entrypoint]
        AuthRoute[Auth Routes]
        MsgRoute[Msg Routes]
        ProtectMiddleware[Protect Route Middleware]
        SocketServer[Socket.io Server]
    end

    subgraph Data [Data & Storage]
        DB[(MongoDB Database)]
        Cloud[Cloudinary CDN]
    end

    %% Interactions
    UI --> AuthStore
    UI --> ChatStore
    AuthStore -->|HTTP Request| AuthRoute
    ChatStore -->|HTTP Request| MsgRoute
    MsgRoute -->|Checks Token| ProtectMiddleware
    AuthRoute -->|Saves Profile Pic| Cloud
    MsgRoute -->|Saves Shared Images| Cloud
    
    %% Socket Connections
    SocketClient <===>|Websocket Connection| SocketServer
    
    %% Data Persistence
    AuthRoute -->|Queries & Saves| DB
    MsgRoute -->|Queries & Saves| DB
    SocketServer -->|Emits Online Users / Live Messages| SocketClient
```

---

## 💾 Data Models & Persistence

WhatZap uses MongoDB to persist user identities and chat histories.

### 1. User Schema (`back/src/models/user.js`)
Stores registered accounts and reference data for authentication.
*   `email` (String, required, unique): The login credentials email.
*   `fullname` (String, required): Display name of the user.
*   `password` (String, required, minLength: 6): Encrypted password hashed with `bcryptjs`.
*   `profilepic` (String, default: `""`): Cloudinary image URL representing the user's avatar.
*   `timestamps` (automatic): tracks `createdAt` and `updatedAt` values.

### 2. Message Schema (`back/src/models/message.js`)
Stores individual message payloads exchanging between contacts.
*   `senderId` (ObjectId referencing `User`, required): The sender's ID.
*   `receiverId` (ObjectId referencing `User`, required): The receiver's ID.
*   `text` (String, optional): The textual context of the message.
*   `image` (String, optional): Cloudinary image URL of any attached image.
*   `timestamps` (automatic): tracks `createdAt` and `updatedAt` values.

---

## 🔄 Real-time Communication Flow (Socket.io)

Real-time message forwarding is handled by pairing active user connections in an memory-mapped dictionary on the backend.

```mermaid
sequenceDiagram
    autonumber
    actor Alice as Client A (Alice)
    participant Server as Node.js Socket.io Server
    actor Bob as Client B (Bob)

    Note over Alice, Server: Connection Establishment
    Alice->>Server: Connect with handshake query: { userId: AliceID }
    Server->>Server: Map AliceID to socket.id
    Server->>Alice: Emit "Online users" [AliceID]

    Note over Bob, Server: Bob logs in
    Bob->>Server: Connect with handshake query: { userId: BobID }
    Server->>Server: Map BobID to socket.id
    Server->>Alice: Emit "Online users" [AliceID, BobID]
    Server->>Bob: Emit "Online users" [AliceID, BobID]

    Note over Alice, Bob: Messaging Flow
    Alice->>Server: Send message via HTTP POST `/api/message/send/BobID`
    Server->>Server: Save message to MongoDB
    Server->>Server: Look up Bob's socket.id in mapping table
    alt Bob is online
        Server->>Bob: Emit "New msg" payload via WebSocket
        Note right of Bob: UseChatstore pushes to local message array
    else Bob is offline
        Note over Server: Do nothing. Bob will fetch messages via HTTP when he opens the app
    end
```

---

## 🔐 Authentication & Session Flow

The app enforces stateless session protection using secure cookies.

1.  **Signup / Login**: User submits credentials to `/api/auth/signup` or `/api/auth/login`.
2.  **JWT Issuance**: The server generates a JWT containing the user's MongoDB `_id` and sets it as an `httpOnly`, `sameSite: "strict"`, secure cookie named `jwt`.
3.  **Route Protection**: For any protected endpoint (like fetching messages or checking authentication):
    *   The `protectRoute` middleware intercepts the request.
    *   It retrieves the `jwt` cookie.
    *   If valid, it extracts `userId`, loads user credentials from MongoDB (excluding password), and appends it to `req.user` before calling `next()`.
4.  **Logout**: Clears the `jwt` cookie by setting `maxAge` to `0`.
