import Repository from './repository.js';

export default class Model {
    constructor() {
        this.view = null;
        this.repo = new Repository();


        this.todos = this.repo.getAll().map(todo => ({
            archived: false,
            createdAt: new Date().toISOString(),
            ...todo
        }));


        if (!this.todos || this.todos.length < 1) {
            this.todos = [{
                id: 0,
                title: 'Learn JS',
                description: 'Watch JS Tutorials',
                completed: false,
            }];

            this.save();
        }


        this.currentId = this.todos.length > 0
            ? this.todos[this.todos.length - 1].id + 1
            : 1;
    }

    setView(view) {
        this.view = view;
    }


    findTodo(id) {
        return this.todos.findIndex((todo) => todo.id === id);
    }


    save() {
        this.repo.saveAll(this.todos);
    }


    getTodos() {
        this.sortByDate();
        return this.todos;
    }


    toggleCompleted(id) {
        const index = this.findTodo(id);
        if (index === -1) return;

        this.todos[index].completed = !this.todos[index].completed;
        this.save();
    }


    editTodo(id, values) {
        const index = this.findTodo(id);
        if (index === -1) return;

        Object.assign(this.todos[index], values);
        this.save();
    }


    addTodo(title, description, dueDate) {
        const todo = {
            id: this.currentId++,
            title,
            description,
            completed: false,
            archived: false,
            createdAt: new Date().toISOString(),
            dueDate: dueDate || null,
        };

        this.todos.push(todo);
        this.save();
        return { ...todo };
    }


    removeTodo(id) {
        const index = this.findTodo(id);
        if (index === -1) return;

        this.todos.splice(index, 1);
        this.save();
    }
    toggleArchived(id) {
        const index = this.findTodo(id);
        if (index === -1) return;

        this.todos[index].archived = !this.todos[index].archived;
        this.save();
    }
    sortByDate() {
        this.todos.sort((a, b) => {
            if (!a.dueDate) return 1;  // sin fecha al final
            if (!b.dueDate) return -1;

            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }



}