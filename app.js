const express = require('express');
const app = express();
// Middleware pour parser le JSON
app.use(express.json());
// Base de donnÃ©es en mÃ©moire (simple tableau)
let todos = [
{ id: 1, title: 'Apprendre CI/CD', completed: false },
{ id: 2, title: 'DÃ©ployer sur Render', completed: false }
];
let nextId = 3;
// ========== ROUTES ==========
// GET / - Page d'accueil
app.get('/', (req, res) => {
res.json({
message: 'API TODO - CI/CD Demo',
endpoints: {
'GET /todos': 'Liste des todos',
'GET /todos/:id': 'Un todo spÃ©cifique',
'POST /todos': 'CrÃ©er un todo',
'PUT /todos/:id': 'Modifier un todo',
'DELETE /todos/:id': 'Supprimer un todo',
'GET /health': 'Status de l\'API'
},
version: '1.0.0'
});
});
// GET /todos - RÃ©cupÃ©rer tous les todos
app.get('/todos', (req, res) => {
res.json({
count: todos.length,
todos: todos
});
});
// GET /todos/:id - RÃ©cupÃ©rer un todo par ID
app.get('/todos/:id', (req, res) => {
const id = parseInt(req.params.id);
const todo = todos.find(t => t.id === id);
if (!todo) {
return res.status(404).json({ error: 'Todo non trouvÃ©' });
}
res.json(todo);
});
// POST /todos - CrÃ©er un nouveau todo
app.post('/todos', (req, res) => {
const { title } = req.body;
// Validation
if (!title || title.trim() === '') {
return res.status(400).json({ error: 'Le titre est requis' });
}
const newTodo = {
id: nextId++,
title: title.trim(),
completed: false
};
todos.push(newTodo);
res.status(201).json({
message: 'Todo crÃ©Ã©',
todo: newTodo
});
});
// PUT /todos/:id - Modifier un todo
app.put('/todos/:id', (req, res) => {
const id = parseInt(req.params.id);
const { title, completed } = req.body;
const todo = todos.find(t => t.id === id);
if (!todo) {
return res.status(404).json({ error: 'Todo non trouvÃ©' });
}
// Mise Ã  jour
if (title !== undefined) todo.title = title.trim();
if (completed !== undefined) todo.completed = completed;
res.json({
message: 'Todo mis Ã  jour',
todo: todo
});
});
// DELETE /todos/:id - Supprimer un todo
app.delete('/todos/:id', (req, res) => {
const id = parseInt(req.params.id);
const index = todos.findIndex(t => t.id === id);
if (index === -1) {
return res.status(404).json({ error: 'Todo non trouvÃ©' });
}
todos.splice(index, 1);
res.status(204).send();
});
// GET /health - Status de l'API
app.get('/health', (req, res) => {
res.json({
status: 'healthy',
timestamp: new Date().toISOString(),
uptime: process.uptime(),
todos_count: todos.length
});
});
// Route 404
app.use((req, res) => {
res.status(404).json({ error: 'Route non trouvÃ©e' });
});
module.exports = app;
