@echo off
rem Serves the built app to your home Wi-Fi using Windows Node (WSL's network
rem is not reachable from a phone). Build first from WSL: npm run build
cd /d "%~dp0"
node server\index.mjs
pause
