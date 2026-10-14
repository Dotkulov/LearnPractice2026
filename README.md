# Практика

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?logo=githubpages&logoColor=white)](https://dotkulov.github.io/LearnPractice2026/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](#лицензия)

## Деплой

Проект развёрнут на GitHub Pages:

<p align="center">
  <a href="https://dotkulov.github.io/LearnPractice2026/">
    <img src="https://img.shields.io/badge/Открыть%20сайт-GitHub%20Pages-216CFF?style=for-the-badge&logo=github&logoColor=white" alt="Открыть сайт">
  </a>
</p>

## Просмотр сайта

| Страница | Ссылка |
|---|---|
| ![Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-216CFF?logo=github&logoColor=white) | [dotkulov.github.io/LearnPractice2026](https://dotkulov.github.io/LearnPractice2026/) |
| ![Source](https://img.shields.io/badge/Source-GitHub-181717?logo=github&logoColor=white) | [github.com/Dotkulov/LearnPractice2026](https://github.com/Dotkulov/LearnPractice2026) |

## Стек

| Технология | Назначение |
|---|---|
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) | Логика приложения |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) | Разметка страниц |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) | Стилизация |
| ![Google Fonts](https://img.shields.io/badge/Montserrat-4285F4?logo=googlefonts&logoColor=white) | Шрифт |

## Структура проекта

```
LearnPractice2026/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: автодеплой (опционально)
├── dist/                       # Скомпилированный JavaScript
│   ├── script.js
│   └── script.js.map
├── src/
│   └── script.ts               # Исходный код на TypeScript
├── .gitignore                  # Исключения для Git
├── index.html                  # Главная страница
├── modal.html                  # Страница с модальным окном
├── package.json                # Зависимости и скрипты npm
├── package-lock.json           # Зафиксированные версии пакетов
├── README.md                   # Этот файл
├── style.css                   # Стили приложения
└── tsconfig.json               # Конфигурация TypeScript
```

## Установка и запуск

### Требования

- ![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)
- ![npm](https://img.shields.io/badge/npm-10+-CB3837?logo=npm&logoColor=white)

### Шаги

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Dotkulov/LearnPractice2026.git

# 2. Перейти в папку проекта
cd LearnPractice2026

# 3. Установить зависимости
npm install

# 4. Скомпилировать TypeScript
npm run build

# 5. Открыть index.html в браузере
```
