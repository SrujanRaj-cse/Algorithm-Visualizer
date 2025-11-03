# Algorithm Visualizer - AlgoViz

A beautiful, interactive web application for visualizing 18+ complex algorithms across multiple categories including Sorting, Dynamic Programming, Graph Algorithms, Recursion, and Search.

## 🎯 Features

- ✨ **18 Algorithm Visualizations** with step-by-step animations
- 🎨 Beautiful UI with smooth animations and transitions
- 🔐 User authentication (Login/Signup)
- 📊 Categories: Sorting, DP, Graph, Recursion, Search, Binary Tree
- 🚀 Real-time algorithm execution
- 💻 Code display for each algorithm

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation & Running

#### Option 1: Run Both Servers (Recommended)

**Windows PowerShell:**

```powershell
# Terminal 1 - Start Server (Backend)
cd server
node src/utils/index.js

# Terminal 2 - Start Client (Frontend)
cd client
npm run dev
```

**Windows Command Prompt:**

```cmd
# Terminal 1 - Start Server (Backend)
cd server
node src/utils/index.js

# Terminal 2 - Start Client (Frontend)
cd client
npm run dev
```

#### Option 2: Run with Background Processes

**Windows PowerShell:**

```powershell
# Start server in background
cd server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node src/utils/index.js" -WindowStyle Minimized

# Start client in background
cd client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Minimized
```

### Access the Application

Once both servers are running:

- **Frontend (Client):** http://localhost:5173
- **Backend (API):** http://localhost:8080

### First Time Setup

If dependencies aren't installed:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd client
npm install
```

## 📁 Project Structure

```
sathv/
├── server/                 # Backend (Express.js)
│   ├── src/
│   │   ├── algorithms/     # 18 algorithm implementations
│   │   │   ├── sorting/
│   │   │   ├── dynamicProgramming/
│   │   │   ├── graph/
│   │   │   ├── recursion/
│   │   │   ├── search/
│   │   │   └── binaryTree/
│   │   ├── controllers/    # API controllers
│   │   └── utils/          # Routes & server setup
│   └── package.json
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/          # Login, Register, Dashboard, Visualizer
│   │   ├── components/     # UI components
│   │   ├── styles/         # CSS files
│   │   ├── context/        # Auth context
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## 🎓 Algorithms Included

### Sorting (5)
- 🔴 Bubble Sort
- 🟡 Selection Sort
- 🟢 Insertion Sort
- 🔵 Merge Sort
- 🟣 Quick Sort

### Dynamic Programming (3)
- 💼 0/1 Knapsack
- 📊 Longest Common Subsequence (LCS)
- 🪙 Coin Change

### Recursion (3)
- 👑 N-Queens
- 🔢 Factorial
- 🌀 Fibonacci

### Graph Algorithms (3)
- 🔍 Breadth-First Search (BFS)
- 🌊 Depth-First Search (DFS)
- 🗺️ Dijkstra's Shortest Path

### Search Algorithms (2)
- 🔎 Linear Search
- ⚡ Binary Search

### Binary Tree (1)
- 🌳 Inorder Traversal

## 🎨 Features

### Authentication
- Beautiful split-screen login/register pages
- Social login buttons (UI only)
- Protected routes
- Session management

### Dashboard
- Organized by categories
- Animated cards with icons
- Hover effects and transitions
- Responsive design

### Visualizations
- Step-by-step algorithm execution
- Interactive controls
- Code display
- Real-time progress

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- React Router
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- CORS enabled
- RESTful API

## 📝 API Endpoints

All endpoints are prefixed with `/api/`

### Sorting
- `POST /api/bubbleSteps`
- `POST /api/selectionSteps`
- `POST /api/insertionSteps`
- `POST /api/mergeSteps`
- `POST /api/quickSteps`

### Dynamic Programming
- `POST /api/knapsack01Steps`
- `POST /api/lcsSteps`
- `POST /api/coinChangeSteps`
- `POST /api/gridPaths2Steps`

### Recursion
- `POST /api/nQueenSteps`
- `POST /api/factorialSteps`
- `POST /api/fibonacciSteps`

### Graph
- `POST /api/bfsSteps`
- `POST /api/dfsSteps`
- `POST /api/dijkstraSteps`

### Search
- `POST /api/linearSearchSteps`
- `POST /api/binarySearchSteps`

### Binary Tree
- `POST /api/inorderSteps`

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Dependencies issue:**
```bash
cd server && npm install
cd ../client && npm install
```

## 📄 License

ISC

## 👨‍💻 Author

SRUJAN_PROJECT

---

**Enjoy visualizing algorithms! 🚀**

