// test/model.test.js
import Model from '../js/model.js'; // ← tu archivo original, sin copias

// Mock localStorage
global.localStorage = {
  _data: {},
  getItem(key) { return this._data[key] || null; },
  setItem(key, value) { this._data[key] = value; },
};

beforeEach(() => {
  global.localStorage._data = {};
});

test('Agrega una tarea correctamente', () => {
  const model = new Model();
  const todo = model.addTodo('Estudiar TDD', 'Revisar Jest');

  expect(todo.title).toBe('Estudiar TDD');
  expect(todo.description).toBe('Revisar Jest');
  expect(todo.completed).toBe(false);
  // Verifica que la tarea existe en el array por su id
  const found = model.todos.find(t => t.id === todo.id);
  expect(found).toBeDefined();
});

// PRUEBA 2: Eliminar tarea
test('Elimina una tarea correctamente', () => {
  const model = new Model();
  const todo = model.addTodo('Tarea a eliminar', '');
  const lengthAntes = model.todos.length;
  model.removeTodo(todo.id);

  expect(model.todos.length).toBe(lengthAntes - 1);
  const found = model.todos.find(t => t.id === todo.id);
  expect(found).toBeUndefined();
});

// PRUEBA 3: Marcar como completada
test('Marca una tarea como completada', () => {
  const model = new Model();
  const todo = model.addTodo('Completar tarea', '');
  model.toggleCompleted(todo.id);

  const found = model.todos.find(t => t.id === todo.id);
  expect(found.completed).toBe(true);
});

// PRUEBA 4: Toggle dos veces vuelve a false
test('Toggle dos veces regresa a no completada', () => {
  const model = new Model();
  const todo = model.addTodo('Toggle doble', '');
  model.toggleCompleted(todo.id);
  model.toggleCompleted(todo.id);

  const found = model.todos.find(t => t.id === todo.id);
  expect(found.completed).toBe(false);
});
// PRUEBA 5: Editar tarea
test('Edita el título de una tarea correctamente', () => {
  const model = new Model();
  const todo = model.addTodo('Título viejo', 'Desc');
  model.editTodo(todo.id, { title: 'Título nuevo' });

  const found = model.todos.find(t => t.id === todo.id);
  expect(found.title).toBe('Título nuevo');
});

// PRUEBA 6: Persistencia en localStorage
test('Guarda y recupera tareas desde localStorage', () => {
  const model1 = new Model();
  model1.addTodo('Persistente', 'Se guarda');

  const model2 = new Model();
  const found = model2.todos.find(t => t.title === 'Persistente');
  expect(found).toBeDefined();
});