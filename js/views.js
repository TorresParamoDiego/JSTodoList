import AddTodo from './components/add-todo.js';
import Modal from './components/modal.js';
import Filters from './components/filters.js';

export default class View {
    constructor() {
        this.model = null;
        this.table = document.getElementById('table');

        this.addTodoForm = new AddTodo();
        this.modal = new Modal();
        this.filtersComponent = new Filters();

        // 🔥 estado de filtros
        this.filters = {
            type: 'all',
            words: ''
        };

        this.addTodoForm.onClick((title, description, dueDate) =>
            this.addTodo(title, description, dueDate)
        );

        this.modal.onClick((id, values) => this.editTodo(id, values));

        this.filtersComponent.onClick((filters) => {
            this.filters = filters;
            this.render();
        });
    }

    setModel(model) {
        this.model = model;
    }

    // 🔥 render centralizado
    render() {
        this.table.innerHTML = `
        <thead>
            <tr>
                <th>Todo</th>
                <th>Description</th>
                <th>Date</th>
                <th>Completed</th>
                <th></th>
            </tr>
        </thead>
        <tbody></tbody>
        `;

        let todos = this.model.getTodos();

        // 🔥 aplicar filtros aquí
        todos = this.applyFilters(todos);

        todos.forEach(todo => this.createRow(todo));
    }

    // 🔥 NUEVO: filtro basado en datos (NO DOM)
    applyFilters(todos) {
        const { type, words } = this.filters;

        return todos.filter(todo => {

            const matchText =
                !words ||
                todo.title.toLowerCase().includes(words.toLowerCase()) ||
                todo.description.toLowerCase().includes(words.toLowerCase());

            let matchType = true;

            if (type === 'completed') matchType = todo.completed;
            if (type === 'uncompleted') matchType = !todo.completed;
            if (type === 'archived') matchType = todo.archived;
            if (type !== 'archived') matchType = !todo.archived;

            return matchText && matchType;
        });
    }

    async addTodo(title, description, dueDate) {
        await this.model.addTodo(title, description, dueDate);
        this.render();
    }

    async toggleCompleted(id) {
        await this.model.toggleCompleted(id);
        this.render();
    }

    async removeTodo(id) {
        await this.model.removeTodo(id);
        this.render();
    }

    async editTodo(id, values) {
        await this.model.editTodo(id, values);
        this.render();
    }

    createRow(todo) {
        const row = this.table.insertRow();
        row.setAttribute('id', todo.id);

        row.innerHTML = `
            <td>${todo.title}</td>
            <td>${todo.description}</td>
            <td>${todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '—'}</td>
            <td class="text-center"></td>
            <td class="text-right d-flex justify-content-end gap-2"></td>
        `;

        // checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onclick = () => this.toggleCompleted(todo.id);
        row.children[3].appendChild(checkbox);

        // botones
        const editBtn = document.createElement('button');
        editBtn.classList.add('btn', 'btn-primary');
        editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
        editBtn.setAttribute('data-toggle', 'modal');
        editBtn.setAttribute('data-target', '#modal');
        editBtn.onclick = () => this.modal.setValues(todo);

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('btn', 'btn-danger');
        removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
        removeBtn.onclick = () => this.removeTodo(todo.id);

        const archiveBtn = document.createElement('button');
        archiveBtn.classList.add('btn', 'btn-warning');
        archiveBtn.innerHTML = '<i class="fa fa-archive"></i>';
        archiveBtn.onclick = () => this.toggleArchived(todo.id);

        const actionsCell = row.children[4];
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(removeBtn);
        actionsCell.appendChild(archiveBtn);

        // 🔥 estilos SOLO basados en estado
        if (todo.archived) {
            row.classList.add('table-secondary');
        }

        if (todo.dueDate) {
            const today = new Date();
            const due = new Date(todo.dueDate);

            today.setHours(0, 0, 0, 0);
            due.setHours(0, 0, 0, 0);

            const diffDays = (due - today) / (1000 * 60 * 60 * 24);

            if (diffDays < 0) {
                row.classList.add('table-danger');
            } else if (diffDays <= 2) {
                row.classList.add('table-warning');
            }
        }
    }

    async toggleArchived(id) {
        await this.model.toggleArchived(id);
        this.render();
    }

    showError(message) {
        alert(message);
    }
}