@echo off
chcp 65001 >nul
title 🌟 Космический портал - Запуск
color 0b
mode con: cols=60 lines=25

echo.
echo ████████████████████████████████████████████████████████
echo ██                                                    ██
echo ██  🌟 КОСМИЧЕСКИЙ ОБРАЗОВАТЕЛЬНЫЙ ПОРТАЛ 🌟          ██
echo ██                                                    ██
echo ██     ⭐ Система личных кабинетов ⭐                   ██
echo ██                                                    ██
echo ████████████████████████████████████████████████████████
echo.
echo 🚀 Инициализация...
timeout /t 2 /nobreak >nul

cd /d "%~dp0"

echo ✓ Проверка Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ОШИБКА: Python не найден!
    pause
    exit /b 1
)

echo ✓ Проверка Flask...
python -c "import flask" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Установка Flask...
    pip install flask
)

echo.
echo 🌌 Запуск космического сайта...
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  🌐 Адрес: http://localhost:8000                    │
echo │  🌙 Темная тема: звезды и космос                    │
echo │  ☀️  Светлая тема: облака и небо                    │
echo │  🎮 Для остановки: Ctrl+C                          │
echo └─────────────────────────────────────────────────────┘
echo.

python simple_start.py

echo.
echo 🛑 Сайт остановлен.
echo 👋 До свидания!
timeout /t 3 /nobreak >nul