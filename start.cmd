@echo off
cd /d "%~dp0"
echo === AutoEsperto - Avvio Rapido ===
echo.
echo [1] Avvia API + Web
echo [2] Solo API (porta 4000)
echo [3] Solo Web (porta 3000)
echo [4] Test API
echo [5] Verifica tipi (lint)
echo.
set /p scelta="Scegli (1-5): "

if "%scelta%"=="1" (
  start "AutoEsperto API" cmd /c "npm run dev:api"
  timeout /t 3 /nobreak >nul
  start "AutoEsperto Web" cmd /c "npm run dev"
  echo API + Web avviati (web: http://localhost:3000, api: http://localhost:4000)
  goto :fine
)
if "%scelta%"=="2" (
  npm run dev:api
  goto :fine
)
if "%scelta%"=="3" (
  npm run dev
  goto :fine
)
if "%scelta%"=="4" (
  npm test
  goto :fine
)
if "%scelta%"=="5" (
  npm run lint
  goto :fine
)
echo Scelta non valida
:fine
pause
