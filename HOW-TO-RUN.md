# 🚀 How to Run AlgoViz

## Quick Start (Easiest Method)

### Windows Users:

**Option A: Double-click to run**
```
1. Double-click: start-server.bat
2. Wait for browsers to open automatically
```

**Option B: PowerShell**
```powershell
.\start-server.ps1
```

### Mac/Linux Users:

```bash
# Terminal 1 - Backend
cd server
node src/utils/index.js

# Terminal 2 - Frontend  
cd client
npm run dev
```

---

## Manual Setup (First Time)

### Step 1: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd client
npm install
```

### Step 2: Run Servers

**Terminal 1 (Backend):**
```bash
cd server
node src/utils/index.js
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### Step 3: Open Browser

- Go to: http://localhost:5173
- API running at: http://localhost:8080

---

## What to Expect

1. **Login Page** - Beautiful split-screen auth
2. **Register** - Create account (demo mode)
3. **Dashboard** - 18 algorithm cards organized by category
4. **Visualizer** - Click any algorithm to visualize

---

## Troubleshooting

### Port Already in Use

**Windows:**
```powershell
# Kill port 8080
netstat -ano | findstr :8080
Stop-Process -Id <PID> -Force

# Kill port 5173
netstat -ano | findstr :5173
Stop-Process -Id <PID> -Force
```

### Node Not Found

Install Node.js: https://nodejs.org/

### Dependencies Error

```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Features Checklist

- ✅ Login/Signup pages
- ✅ Beautiful Dashboard with 18 algorithms
- ✅ Sorting algorithms (5)
- ✅ Dynamic Programming (3)
- ✅ Recursion algorithms (3)
- ✅ Graph algorithms (3)
- ✅ Search algorithms (2)
- ✅ Binary Tree (1)
- ✅ Smooth animations
- ✅ Responsive design

---

**Enjoy! 🎉**

