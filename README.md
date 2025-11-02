# Real-Time Chat Application

A modern, scalable real-time chat application built with React, TypeScript, Node.js, and WebSockets. This application enables instant messaging across multiple chat rooms with live user presence tracking.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-time Messaging**: Instant message delivery using WebSocket protocol
- **Multiple Chat Rooms**: Create and join different chat rooms dynamically
- **User Presence**: Live tracking of online users in each room
- **Type Safety**: Full TypeScript implementation for enhanced code reliability
- **Responsive Design**: Modern UI built with Tailwind CSS, optimized for all devices
- **Connection Management**: Automatic reconnection and connection status indicators

## Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript superset
- **Tailwind CSS** - Utility-first CSS framework
- **WebSocket Client** - Real-time bidirectional communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express** - Fast, minimalist web framework
- **ws** - High-performance WebSocket library
- **TypeScript** - Enhanced type safety and development experience

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **Git** (for cloning the repository)

To verify your installations, run:
```bash
node --version
npm --version
git --version
```

## Installation

Follow these steps to set up the application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/anukoolvikram/chat-room-websocket.git
cd chat-room-websocket
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Start the backend server:

```bash
npm run dev
```

The backend server will start on `http://localhost:8080`

### 3. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

### 4. Access the Application

Open your web browser and navigate to:
```
http://localhost:5173
```

## Usage

### Getting Started

1. **Enter the Application**
   - On the welcome screen, enter your desired username
   - Click "Enter Chat" to proceed

2. **Join a Chat Room**
   - Enter an existing room name to join that room
   - Or create a new room by entering a unique room name
   - Click "Join Room" to enter

3. **Start Chatting**
   - Type your message in the input field at the bottom
   - Press Enter or click Send to deliver your message
   - View the online users list in the sidebar
   - All messages appear in real-time for all users in the room

4. **Room Management**
   - Switch rooms by clicking "Leave Room" and joining a different one
   - Monitor your connection status via the indicator in the header
   - The application automatically handles reconnections if disconnected

## Project Structure

```
chat-room-websocket/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Main server file
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.tsx           # Main application component
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server with hot-reload |
| `npm run build` | Compiles TypeScript to JavaScript for production |
| `npm start` | Runs the production build |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates an optimized production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to check code quality |

## Configuration

### Backend Configuration

The backend server uses the following default configuration:

- **Port**: 8080
- **WebSocket Path**: `/`

To customize, create a `.env` file in the backend directory:

```env
PORT=8080
NODE_ENV=development
```

### Frontend Configuration

The frontend connects to the backend using:

- **WebSocket URL**: `ws://localhost:8080`

For production, update the WebSocket URL in the frontend configuration.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [anukoolvikram](https://github.com/anukoolvikram)**

For questions or support, please open an issue on GitHub.
