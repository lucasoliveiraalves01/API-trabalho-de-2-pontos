const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const ARQUIVO = path.join(__dirname, 'dados.json');

app.use(express.json());

function lerDados() {
  if (!fs.existsSync(ARQUIVO)) {
    fs.writeFileSync(ARQUIVO, '[]');
    return [];
  }

  const texto = fs.readFileSync(ARQUIVO, 'utf-8').trim();
  return texto ? JSON.parse(texto) : [];
}

function salvarDados(itens) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(itens, null, 2));
}

app.get('/itens', (req, res) => {
  res.json(lerDados());
});

app.post('/itens', (req, res) => {
  const itens = lerDados();
  const novo = { id: Date.now(), ...req.body };
  itens.push(novo);
  salvarDados(itens);
  res.status(201).json(novo);
});

app.get('/itens/:id', (req, res) => {
  const itens = lerDados();
  const id = Number(req.params.id);
  const item = itens.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  res.json(item);
});

app.delete('/itens/:id', (req, res) => {
  const itens = lerDados();
  const id = Number(req.params.id);
  const index = itens.findIndex((i) => i.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  const [itemRemovido] = itens.splice(index, 1);
  salvarDados(itens);
  res.json({ mensagem: 'Item removido com sucesso', item: itemRemovido });
});

app.put('/itens/:id', (req, res) => {
  const itens = lerDados();
  const id = Number(req.params.id);
  const index = itens.findIndex((i) => i.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  const itemAtualizado = { ...itens[index], ...req.body, id };
  itens[index] = itemAtualizado;
  salvarDados(itens);

  res.json(itemAtualizado);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
