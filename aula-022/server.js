const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const mockPessoas = [
  { nome: 'Ana Souza', email: 'ana.souza@email.com', telefone: '(11) 98888-1001' },
  { nome: 'Bruno Lima', email: 'bruno.lima@email.com', telefone: '(21) 97777-2002' },
  { nome: 'Carla Mendes', email: 'carla.mendes@email.com', telefone: '(31) 96666-3003' },
  { nome: 'Diego Ferreira', email: 'diego.ferreira@email.com', telefone: '(41) 95555-4004' },
  { nome: 'Elisa Rocha', email: 'elisa.rocha@email.com', telefone: '(51) 94444-5005' }
];

// Configurar conexão com o PostgreSQL
const pool = new Pool({
  user: 'root',
  host: 'db',
  database: 'projeto',
  password: 'root',
  port: 5432,
});

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Rota raiz redireciona para cadastro
app.get('/', (req, res) => {
  res.redirect('/cadastro.html');
});

// Rotas API
app.post('/pessoas', async (req, res) => {
  const { nome, email, telefone } = req.body;
  try {
    await pool.query(
      'INSERT INTO pessoas (nome, email, telefone) VALUES ($1, $2, $3)',
      [nome, email, telefone]
    );
    res.redirect('/lista.html');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar pessoa');
  }
});

app.get('/pessoas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pessoas');
    if (result.rows.length === 0) {
      return res.json(mockPessoas);
    }

    return res.json(result.rows);
  } catch (err) {
    return res.json(mockPessoas);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});