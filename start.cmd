@echo off
cd /d "%~dp0"
echo ^=== AutoEsperto - Avvio Rapido ^===
echo.
echo [1] Avvia API + Web
echo [2] Solo API (porta 4000)
echo [3] Solo Web (porta 3000)
echo [4] Test API
echo [5] Database Studio (Prisma)
echo.
set /p scelta="Scegli (1-5): "

if "%scelta%"=="1" (
  start "AutoEsperto API" cmd /c "npx tsx apps/api/src/index.ts"
  timeout /t 3 /nobreak >nul
  start "AutoEsperto Web" cmd /c "npx next dev --port 3000"
  echo ✅ API + Web avviati
  goto :fine
)
if "%scelta%"=="2" (
  npx tsx apps/api/src/index.ts
  goto :fine
)
if "%scelta%"=="3" (
  npx next dev --port 3000
  goto :fine
)
if "%scelta%"=="4" (
  node --import tsx --test apps/api/test/routes.test.ts
  goto :fine
)
if "%scelta%"=="5" (
  npx prisma studio --schema packages/database/prisma/schema.prisma
  goto :fine
)
echo Scelta non valida
:fine
pause
