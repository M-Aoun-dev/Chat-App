#  ChatSphere – Real-Time Chat Application

ChatSphere is a full-stack real-time chat application designed to provide seamless and instant communication between users across multiple chat rooms. The system is built using the MERN stack and leverages WebSocket technology to deliver real-time updates with minimal latency.

The application focuses on scalability, modular architecture, and user experience, combining secure authentication, persistent messaging, and responsive UI design into a single platform.

---

##  Overview

ChatSphere enables users to:

* Authenticate securely and maintain persistent sessions
* Join multiple chat rooms dynamically
* Exchange messages in real time
* View historical conversations
* Receive live system updates such as user activity and typing indicators

The project follows a **client-server architecture**, where the frontend handles user interaction and the backend manages data, authentication, and real-time communication.

---

##  System Architecture

The application is divided into two major components:

###  Frontend (Client Side)

Built with React, the frontend provides an interactive interface where users can:

* Register and log in
* Join chat rooms
* Send and receive messages instantly
* View typing indicators and system notifications

State management is handled using **React Context API**, ensuring global access to authentication and user data across components.

---

###  Backend (Server Side)

The backend is built using Node.js and Express, acting as the core logic layer of the application.

It is responsible for:

* Handling API requests
* Managing authentication via JWT
* Interacting with MongoDB through Mongoose
* Processing chat data (rooms, messages, users)

---

###  Real-Time Communication Layer

Socket.io is integrated to enable real-time, bidirectional communication between client and server.

This allows:

* Instant message delivery
* Live typing indicators
* User join/leave notifications
* Room-based communication channels

---

##  Core Functional Modules

###  Authentication Module

* Users can register and log in securely
* Passwords are hashed using bcrypt
* JWT tokens are used for session management
* Protected routes ensure only authorized access

---

###  Chat Room Management

* Users can create or join chat rooms
* Each room acts as an isolated communication channel
* Server manages room membership dynamically

---

###  Messaging System

* Messages are sent and received in real time
* Stored in MongoDB for persistence
* Retrieved when users revisit a room

---

###  Typing Indicator System

* Detects when a user is typing
* Broadcasts this state to other users in the same room
* Enhances real-time interaction experience

---

###  Notification System

* Alerts users when someone joins or leaves a room
* Provides system-level updates for better awareness

---

##  Database Design

The application uses MongoDB with three primary models:

### User

Stores:

* Username
* Email
* Password (hashed)

### Room

Stores:

* Room name
* Participants

### Message

Stores:

* Message content
* Sender reference
* Room reference
* Timestamp

---

##  Project Structure Insight

The project follows a **modular and scalable folder structure**:

* **controllers/** → Handles business logic for routes
* **models/** → Defines database schemas
* **routes/** → API endpoints
* **middleware/** → Authentication and request validation
* **socket/** → Real-time event handling logic
* **context/** → Global state management (frontend)
* **pages/** → Main UI screens (Auth & Chat)

This separation ensures:

* Maintainability
* Code reusability
* Clear responsibility boundaries

---

##  Real-Time Event Flow

1. User joins a chat room
2. Socket connection is established
3. Events are emitted (send message, typing, etc.)
4. Server processes and broadcasts updates
5. All connected clients receive updates instantly

---

##  Security Considerations

* Password hashing prevents credential exposure
* JWT ensures secure and stateless authentication
* Protected routes restrict unauthorized access
* Environment variables safeguard sensitive data

---

##  User Experience

The interface is designed with simplicity and usability in mind:

* Dark-themed UI for modern look
* Clean layout with minimal distractions
* Real-time feedback (typing, notifications)
* Smooth interaction across chat rooms

---

##  Key Highlights

* Full MERN stack implementation
* Real-time communication using WebSockets
* Modular backend architecture
* Persistent chat storage
* Scalable room-based messaging system

---

##  Future Scope

The project can be further enhanced with:

* Private one-to-one messaging
* Media/file sharing support
* Online/offline user status
* Push notifications
* Advanced UI/UX improvements

---

##  Folder Structure

chat-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   └── messageRoutes.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── hooks/
    │   │   └── useSocket.js
    │   ├── pages/
    │   │   ├── AuthPage.js
    │   │   └── ChatPage.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
