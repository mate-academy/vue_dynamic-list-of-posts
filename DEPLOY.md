# 🚀 Інструкція по деплою

## Швидкий деплой на GitHub Pages

### 1. Підготовка проекту

Переконайтеся, що у вас є:
- [Git](https://git-scm.com/) встановлений
- [GitHub](https://github.com/) акаунт
- Код проекту готовий

### 2. Створення GitHub репозиторію

1. Перейдіть на [github.com](https://github.com)
2. Натисніть "New repository"
3. Назва: `vue_dynamic-list-of-posts`
4. Опис: `Vue.js application for dynamic list of posts`
5. Public або Private (за вашого бажання)
6. НЕ створюйте README, .gitignore або license (у нас вже є)
7. Натисніть "Create repository"

### 3. Підключення локального проекту до GitHub

```bash
# Перейдіть в папку проекту
cd vue_dynamic-list-of-posts

# Ініціалізуйте Git (якщо ще не зроблено)
git init

# Додайте всі файли
git add .

# Зробіть перший коміт
git commit -m "Initial commit"

# Додайте віддалений репозиторій (замініть yourusername на ваш username)
git remote add origin https://github.com/yourusername/vue_dynamic-list-of-posts.git

# Перейменуйте гілку на main
git branch -M main

# Завантажте код на GitHub
git push -u origin main
```

### 4. Автоматичний деплой (рекомендовано)

Використовуйте наш скрипт для автоматичного деплою:

```bash
# Зробіть скрипт виконуваним (якщо ще не зроблено)
chmod +x deploy.sh

# Запустіть деплой
./deploy.sh
```

### 5. Вручну через npm

```bash
# Встановіть залежності (якщо потрібно)
npm install

# Запустіть деплой
npm run deploy
```

### 6. Налаштування GitHub Pages

1. Перейдіть в ваш репозиторій на GitHub
2. Натисніть **Settings** (вкладка)
3. У лівому меню знайдіть **Pages**
4. У розділі **Source**:
   - Виберіть **Deploy from a branch**
   - Branch: **main**
   - Folder: **/** (root)
5. Натисніть **Save**

### 7. Очікування деплою

- ⏳ **5-10 хвилин** для першого деплою
- 🔄 **2-5 хвилин** для наступних оновлень
- 📍 Деплой відбувається автоматично при кожному push до main гілки

### 8. Перевірка роботи

Ваш додаток буде доступний за адресою:
```
https://yourusername.github.io/vue_dynamic-list-of-posts/
```

## 🔄 Оновлення коду

Після зміни коду:

```bash
# Додайте зміни
git add .

# Зробіть коміт
git commit -m "Update: опис змін"

# Завантажте на GitHub
git push origin main

# Або використайте скрипт
./deploy.sh
```

## 🌐 Альтернативні хостинги

### Netlify
1. Перейдіть на [netlify.com](https://netlify.com)
2. Drag & Drop папку з проектом
3. Отримайте URL

### Vercel
1. Перейдіть на [vercel.com](https://vercel.com)
2. Import GitHub репозиторій
3. Автоматичний деплой

### Surge.sh
```bash
npm install -g surge
surge
```

## ❗ Вирішення проблем

### Помилка "Repository not found"
- Перевірте правильність URL репозиторію
- Переконайтеся, що репозиторій існує та доступний

### Помилка "Permission denied"
- Перевірте налаштування SSH ключів
- Або використовуйте HTTPS URL

### Сайт не оновлюється
- Перевірте, що зміни завантажені в main гілку
- Дочекайтеся завершення деплою (5-10 хвилин)

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте [GitHub Pages документацію](https://pages.github.com/)
2. Перегляньте логи в Actions вашого репозиторію
3. Переконайтеся, що всі файли завантажені

---

**Успішного деплою! 🎉**
