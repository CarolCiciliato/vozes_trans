const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve os arquivos estáticos da pasta public

// Conexão e Criação do Banco SQLite
const db = new sqlite3.Database('./vozes_trans.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite (vozes_trans.db).');
  }
});

// Criar tabela de participantes caso não exista
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS participantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      contato TEXT NOT NULL,
      data_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Endpoint para receber o cadastro
app.post('/api/cadastrar', (req, res) => {
  const { nome, contato } = req.body;

  if (!nome || !contato) {
    return res.status(400).json({ error: 'Nome e email/celular são obrigatórios.' });
  }

  const query = `INSERT INTO participantes (nome, contato) VALUES (?, ?)`;
  db.run(query, [nome, contato], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao salvar os dados no banco de dados.' });
    }
    res.status(201).json({ message: 'Inscrição realizada com sucesso!', id: this.lastID });
  });
});

// Endpoint opcional para listar inscritos
app.get('/api/participantes', (req, res) => {
  db.all(`SELECT * FROM participantes ORDER BY data_registro DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar participantes.' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
