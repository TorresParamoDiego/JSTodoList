import Repository from './repository.js';

export default class Model {
    constructor() {
        this.view = null;
        this.repo = new Repository();
        this.todos = [];
        this.currentId = 1;
    }

    async init() {
        try {
            const todos = await this.repo.getAll();

            this.todos = (todos || []).map(todo => ({
                archived: false,
                createdAt: new Date().toISOString(),
                ...todo
            }));

            if (this.todos.length < 1) {
                const defaultTodo = {
                    title: 'Learn JS',
                    description: 'Watch JS Tutorials',
                    completed: false,
                    archived: false,
                    createdAt: new Date().toISOString()
                };
                const saved = await this.repo.create(defaultTodo);
                this.todos = [saved];
            }

            this.currentId = this.todos.length > 0
                ? Math.max(...this.todos.map(t => t.id)) + 1
                : 1;

        } catch (error) {
            console.error('Error cargando todos:', error);
            this.todos = [];
            if (this.view) {
                this.view.showError('No se pudo conectar al servidor');
            }
        }
    }

    setView(view) {
        this.view = view;
    }

    findTodo(id) {
        return this.todos.findIndex((todo) => todo.id === id);
    }

    async save() {
    }

    getTodos() {
        this.sortByDate();
        return this.todos;
    }

    async toggleCompleted(id) {
        const index = this.findTodo(id);
        if (index === -1) return;

        const todo = this.todos[index];
        todo.completed = !todo.completed;
        if (this.view) this.view.render();
        try {
            await this.repo.update(id, todo);

        } catch (err) {
            console.error(err);
            if (this.view) {
                this.view.showError('Error al actualizar');
            }
        }
    }

    async editTodo(id, values) {
        const index = this.findTodo(id);
        if (index === -1) return;

        Object.assign(this.todos[index], values);

        try {
            await this.repo.update(id, this.todos[index]);
            if (this.view) this.view.render();
        } catch (err) {
            console.error(err);
            if (this.view) {
                this.view.showError('No se pudo actualizar');
            }
        }
    }

    async addTodo(title, description, dueDate) {
        const todo = {
            title,
            description,
            completed: false,
            archived: false,
            createdAt: new Date().toISOString(),
            dueDate: dueDate || null,
        };
        try {
            const saved = await this.repo.create(todo);
            this.todos.push(saved);
            return { ...saved };
        } catch (err) {
            console.error(err);
            if (this.view) {
                this.view.showError('No se pudo guardar el todo');
            }
        }
    }

    async removeTodo(id) {
        const index = this.findTodo(id);
        if (index === -1) return;
        if (this.view) this.view.render();
        try {
            await this.repo.delete(id);
            this.todos.splice(index, 1);
        } catch (err) {
            console.error(err);
            if (this.view) {
                this.view.showError('No se pudo eliminar');
            }
        }
    }

    async toggleArchived(id) {
        const index = this.findTodo(id);
        if (index === -1) return;

        const todo = this.todos[index];
        todo.archived = !todo.archived;
        if (this.view) this.view.render();
        try {
            await this.repo.update(id, todo);
        } catch (err) {
            console.error(err);
            if (this.view) {
                this.view.showError('Error al actualizar');
            }
        }
    }

    sortByDate() {
        this.todos.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }
}