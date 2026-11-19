# Blog API

Backend блог-платформи (лабораторна робота №1). Стек: **Node.js**, **Express.js**, **PostgreSQL**, **Prisma ORM**.

## Предметна область

Блог-платформа з п'ятьма сутностями:

| Сутність | Опис | Зв'язки |
|----------|------|---------|
| `User` | Користувач (роль `USER` / `ADMIN`) | 1:N з `Post`, 1:N з `Comment` |
| `Category` | Категорія статей | 1:N з `Post` |
| `Post` | Стаття | N:1 з `User`, N:1 з `Category`, **N:M з `Tag`**, 1:N з `Comment` |
| `Tag` | Тег | N:M з `Post` |
| `Comment` | Коментар до статті | N:1 з `Post`, N:1 з `User` |

## Структура проєкту

```
blog-api/
├── prisma/
│   └── schema.prisma          # схема бази даних
├── src/
│   ├── app.js                 # точка входу, налаштування Express
│   ├── routes/                # маршрути (URL → контролер + валідація)
│   ├── controllers/           # обробка запитів і формування відповідей
│   ├── models/                # робота з БД через Prisma
│   ├── middleware/            # валідація та обробка помилок
│   └── utils/                 # допоміжні функції
├── reports/                   # звіт і скріншоти
├── .env.example               # приклад змінних середовища
└── package.json
```

## Запуск

1. Встановіть Node.js (18+), PostgreSQL та створіть порожню базу даних:
   ```sql
   CREATE DATABASE blog_db;
   ```
2. Встановіть залежності:
   ```bash
   npm install
   ```
3. Створіть файл `.env` на основі прикладу та вкажіть свої дані підключення:
   ```bash
   cp .env.example .env
   ```
4. Виконайте міграцію (створить таблиці та згенерує Prisma Client):
   ```bash
   npx prisma migrate dev --name init
   ```
5. Запустіть сервер:
   ```bash
   npm run dev     # з автоперезапуском (nodemon)
   npm start       # звичайний запуск
   ```

Перевірка: `GET http://localhost:3000/health` → `{"status":"ok", ...}`.

## Змінні середовища

| Змінна | Опис | Приклад |
|--------|------|---------|
| `PORT` | Порт сервера | `3000` |
| `NODE_ENV` | Режим роботи | `development` |
| `DATABASE_URL` | Рядок підключення до PostgreSQL | `postgresql://postgres:postgres@localhost:5432/blog_db?schema=public` |

## Документація API

Базовий URL: `http://localhost:3000/api`. Усі запити та відповіді — у форматі JSON.

### Користувачі — `/users`

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/users?page=1&limit=10` | Список користувачів |
| GET | `/users/:id` | Користувач за id (з кількістю статей і коментарів) |
| POST | `/users` | Створити користувача |
| PUT | `/users/:id` | Оновити (достатньо одного поля) |
| DELETE | `/users/:id` | Видалити (разом зі статтями та коментарями) |

Тіло `POST /users`:
```json
{ "email": "ivan@example.com", "username": "ivan", "password": "secret123", "role": "USER" }
```
`role` необов'язкове. Пароль зберігається у вигляді хешу (scrypt) і ніколи не повертається у відповіді.

### Категорії — `/categories`

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/categories` | Усі категорії |
| GET | `/categories/:id` | Категорія за id |
| POST | `/categories` | Створити |
| PUT | `/categories/:id` | Оновити |
| DELETE | `/categories/:id` | Видалити (у статей `categoryId` стане `null`) |

Тіло: `{ "name": "Технології", "description": "Статті про IT" }` (`description` необов'язкове).

### Теги — `/tags`

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/tags` | Усі теги |
| GET | `/tags/:id` | Тег за id |
| POST | `/tags` | Створити: `{ "name": "nodejs" }` |
| PUT | `/tags/:id` | Перейменувати |
| DELETE | `/tags/:id` | Видалити |

### Статті — `/posts`

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/posts` | Список статей із фільтрами |
| GET | `/posts/:id` | Стаття з автором, категорією, тегами |
| POST | `/posts` | Створити статтю |
| PUT | `/posts/:id` | Оновити статтю |
| DELETE | `/posts/:id` | Видалити (разом з коментарями) |

Параметри `GET /posts`: `page`, `limit`, `published` (`true`/`false`), `categoryId`, `authorId`, `tag` (назва тегу), `search` (пошук у заголовку).

Тіло `POST /posts`:
```json
{
  "title": "Вступ до Express.js",
  "content": "Текст статті...",
  "authorId": 1,
  "categoryId": 1,
  "published": true,
  "tags": ["nodejs", "express"]
}
```
`categoryId`, `published` (за замовчуванням `false`) і `tags` необов'язкові. Теги, яких ще немає, створюються автоматично. При `PUT` передача `tags` повністю замінює список тегів статті; `authorId` змінити не можна.

### Коментарі — `/comments`

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/comments?postId=1&page=1&limit=10` | Коментарі (можна відфільтрувати за статтею) |
| GET | `/comments/:id` | Коментар за id |
| POST | `/comments` | Створити: `{ "content": "Дякую!", "postId": 1, "authorId": 2 }` |
| PUT | `/comments/:id` | Змінити текст: `{ "content": "Новий текст" }` |
| DELETE | `/comments/:id` | Видалити |

### Формат відповідей

Списки з пагінацією:
```json
{ "data": [ ... ], "meta": { "page": 1, "limit": 10, "total": 42 } }
```
Успішне видалення повертає `204 No Content`, створення — `201 Created`.

### Помилки

Усі помилки повертаються у єдиному форматі:
```json
{ "error": "Помилка валідації", "details": ["Поле \"email\" має бути коректною email-адресою"] }
```

| Код | Коли виникає |
|-----|--------------|
| 400 | Помилка валідації, некоректний `id`, некоректний JSON, неіснуючий зовнішній ключ |
| 404 | Запис або маршрут не знайдено |
| 409 | Порушення унікальності (наприклад, email уже зайнятий) |
| 500 | Внутрішня помилка сервера (деталі в відповідь не потрапляють) |

## Приклади запитів (curl)

```bash
# створити користувача
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" \
  -d '{"email":"ivan@example.com","username":"ivan","password":"secret123"}'

# створити категорію
curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" \
  -d '{"name":"Технології"}'

# створити статтю з тегами
curl -X POST http://localhost:3000/api/posts -H "Content-Type: application/json" \
  -d '{"title":"Вступ до Express","content":"Текст","authorId":1,"categoryId":1,"published":true,"tags":["nodejs","express"]}'

# отримати опубліковані статті з тегом nodejs
curl "http://localhost:3000/api/posts?published=true&tag=nodejs"

# додати коментар
curl -X POST http://localhost:3000/api/comments -H "Content-Type: application/json" \
  -d '{"content":"Корисна стаття!","postId":1,"authorId":1}'

# приклад помилки валідації
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"email":"bad"}'
```
