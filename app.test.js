const request = require('supertest');
const app = require('./app');
describe('API TODO - Tests', () => {
// Test 1 : Page d'accueil
test('GET / - Devrait retourner les infos de l\'API', async () => {
const response = await request(app).get('/');
expect(response.status).toBe(200);
expect(response.body.message).toBeDefined();
expect(response.body.endpoints).toBeDefined();
});
// Test 2 : Récupérer tous les todos
test('GET /todos - Devrait retourner la liste des todos', async () => {
const response = await request(app).get('/todos');
expect(response.status).toBe(200);
expect(response.body.todos).toBeInstanceOf(Array);
expect(response.body.count).toBeGreaterThanOrEqual(0);
});
// Test 3 : Récupérer un todo spécifique
test('GET /todos/1 - Devrait retourner le todo avec id 1', async () => {
const response = await request(app).get('/todos/1');
expect(response.status).toBe(200);
expect(response.body.id).toBe(1);
expect(response.body.title).toBeDefined();
});
// Test 4 : Todo inexistant
test('GET /todos/999 - Devrait retourner 404', async () => {
const response = await request(app).get('/todos/999');
expect(response.status).toBe(404);
expect(response.body.error).toBeDefined();
});
// Test 5 : Créer un todo valide
test('POST /todos - Devrait créer un nouveau todo', async () => {
const newTodo = { title: 'Test CI/CD' };
const response = await request(app)
.post('/todos')
.send(newTodo);
expect(response.status).toBe(201);
expect(response.body.todo.title).toBe('Test CI/CD');
expect(response.body.todo.completed).toBe(false);
});
// Test 6 : Créer un todo sans titre
test('POST /todos - Devrait rejeter un todo sans titre', async () => {
const response = await request(app)
.post('/todos')
.send({});
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
});
// Test 7 : Modifier un todo
test('PUT /todos/1 - Devrait modifier le todo', async () => {
const response = await request(app)
.put('/todos/1')
.send({ completed: true });
expect(response.status).toBe(200);
expect(response.body.todo.completed).toBe(true);
});
// Test 8 : Health check
test('GET /health - Devrait retourner le status healthy', async () => {
const response = await request(app).get('/health');
expect(response.status).toBe(200);
expect(response.body.status).toBe('healthy');
expect(response.body.timestamp).toBeDefined();
});
});