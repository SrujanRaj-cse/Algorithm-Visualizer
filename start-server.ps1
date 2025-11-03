Write-Host "Starting Algorithm Visualizer..." -ForegroundColor Green
Write-Host ""

# Start Server
Write-Host "Starting Backend Server on port 8080..." -ForegroundColor Yellow
cd server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'AlgoViz Backend Server' -ForegroundColor Cyan; node src/utils/index.js" -WindowStyle Minimized
Start-Sleep -Seconds 2

# Start Client
Write-Host "Starting Frontend Client on port 5173..." -ForegroundColor Yellow
cd ..
cd client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'AlgoViz Frontend Client' -ForegroundColor Magenta; npm run dev" -WindowStyle Minimized

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  AlgoViz is starting!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script..." -ForegroundColor Gray
Write-Host "(Servers will continue running)" -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

