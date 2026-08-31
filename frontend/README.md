# Slot Game

Стартовый проект браузерного слота без игровой реализации.

## Стек

- React + TypeScript + Vite
- Zustand — состояние игры
- Framer Motion — анимация интерфейса
- Howler.js — звуки
- ESLint

## Архитектура

```text
src/
  app/             запуск приложения и глобальные стили
  game/
    config/        параметры игры
    model/         Zustand-store и игровая логика
    types/         доменные типы
    ui/            React-компоненты
  shared/          общие UI-компоненты, утилиты, звук и ресурсы
```

## Запуск

```bash
npm install
npm run dev
```
