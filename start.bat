@echo off
title Algorithm Visualizer - Starting Servers
color 0A

echo ================================================
echo   Algorithm Visualizer - Startup Script
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH!
    pause
    exit /b 1
)

echo [OK] npm found
echo.

REM Check if server .env file exists
if not exist "server\.env" (
    echo [WARNING] server\.env file not found!
    echo Please create server\.env with the following variables:
    echo   MONGO_URI=your_mongodb_connection_string
    echo   JWT_SECRET=your_jwt_secret
    echo   PORT=8080
    echo.
    echo Press any key to continue anyway...
    pause >nul
)

REM Check if server node_modules exist
if not exist "server\node_modules" (
    echo [INFO] Installing server dependencies...
    cd server
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install server dependencies!
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Server dependencies installed
    echo.
)

REM Check if client node_modules exist
if not exist "client\node_modules" (
    echo [INFO] Installing client dependencies...
    cd client
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install client dependencies!
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Client dependencies installed
    echo.
)

echo ================================================
echo   Starting Servers...
echo ================================================
echo.

REM Start backend server
echo [INFO] Starting Backend Server (Port 8080)...
cd server
start "AlgoViz Backend Server" cmd /k "npm start"
cd ..
timeout /t 3 /nobreak >nul

REM Start frontend client
echo [INFO] Starting Frontend Client (Port 5173)...
cd client
start "AlgoViz Frontend Client" cmd /k "npm run dev"
cd ..

echo.
echo ================================================
echo   Servers Started Successfully!
echo ================================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080
echo.
echo   Press any key to close this window.
echo   (Servers will continue running in separate windows)
echo.
pause >nul

