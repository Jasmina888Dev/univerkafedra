# 🚀 БЫСТРЫЙ СТАРТ

## ⚡ Установка за 5 минут

### 1. Распакуйте архив
```bash
unzip university-portal.zip
cd university-portal
```

### 2. Установите PostgreSQL (если еще не установлен)

**Windows:**
Скачайте с https://www.postgresql.org/download/windows/

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3. Создайте базу данных

```bash
# Войдите в PostgreSQL
psql -U postgres

# В консоли PostgreSQL выполните:
CREATE DATABASE university_portal;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE university_portal TO your_user;
\q
```

### 4. Настройте подключение к БД

Отредактируйте файл `backend/.env`:

```env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/university_portal?schema=public"
JWT_SECRET=your_super_secret_jwt_key_change_this
```

### 5. Установите зависимости

```bash
# Установите все зависимости одной командой
cd backend && npm install && cd ../frontend && npm install && cd ..
```

### 6. Инициализируйте базу данных

```bash
cd backend

# Генерируем Prisma Client
npx prisma generate

# Создаем таблицы
npx prisma migrate dev --name init

# Заполняем тестовыми данными
npm run seed

cd ..
```

### 7. Запустите проект

```bash
# Из корневой папки запустите оба сервера
npm run dev
```

### 8. Откройте в браузере

**Frontend:** http://localhost:3000

## 🔑 Тестовые аккаунты

| Email | Пароль | Роль |
|-------|--------|------|
| admin@university.uz | password123 | Администратор |
| teacher1@university.uz | password123 | Преподаватель |
| student1@university.uz | password123 | Студент |

## 🎯 Что дальше?

1. Войдите как администратор
2. Изучите все разделы
3. Попробуйте создать/редактировать/удалить данные
4. Войдите как преподаватель и студент
5. Протестируйте все функции

## ❓ Проблемы?

**Ошибка подключения к БД:**
- Проверьте, запущен ли PostgreSQL: `pg_isready`
- Проверьте правильность данных в `.env`

**Port already in use:**
- Измените порт в `backend/.env` (PORT=5001)
- Измените порт в `frontend/vite.config.js` (port: 3001)

**Prisma ошибки:**
```bash
cd backend
npx prisma generate
npx prisma migrate reset
npm run seed
```

## 📚 Полная документация

См. файл `README.md` для подробной информации.

---

**Наслаждайтесь проектом!** 🎉
