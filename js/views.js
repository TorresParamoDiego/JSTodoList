import AddTodo from './components/add-todo.js';
import Modal from './components/modal.js';
import Filters from './components/filters.js'; export default class View {
    constructor() {
        this.model = null;
        this.table = document.getElementById('table');
        this.addTodoForm = new AddTodo();
        this.modal = new Modal();
        this.filters = new Filters();
        this.addTodoForm.onClick((title, description, dueDate) =>
            this.addTodo(title, description, dueDate)
        );
        this.modal.onClick((id, values) => this.editTodo(id, values));
        this.filters.onClick((filters) => this.filter(filters));
    }
    setModel(model) {
        this.model = model;
    }
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

        const todos = this.model.getTodos();
        todos.forEach(todo => this.createRow(todo));
    }
    filter(filters) {
        const { type, words } = filters;
        const [, ...rows] = this.table.getElementsByTagName('tr');

        for (const row of rows) {
            const [title, description, date, completed] = row.children;

            let shouldHide = false;

            const todo = this.model.getTodos().find(t => t.id == row.id);

            if (words) {
                shouldHide = !title.innerText.includes(words) &&
                    !description.innerText.includes(words);
            }

            if (type === 'completed' && !todo.completed) {
                shouldHide = true;
            }

            if (type === 'uncompleted' && todo.completed) {
                shouldHide = true;
            }

            if (type === 'archived' && !todo.archived) {
                shouldHide = true;
            }

            if (type !== 'archived' && todo.archived) {
                shouldHide = true;
            }

            if (shouldHide) {
                row.classList.add('d-none');
            } else {
                row.classList.remove('d-none');
            }
        }
    }
    addTodo(title, description, dueDate) {
        const todo = this.model.addTodo(title, description, dueDate);
        this.render();
    }
    toggleCompleted(id) {
        this.model.toggleCompleted(id);
    }
    removeTodo(id) {
        this.model.removeTodo(id);
        document.getElementById(id).remove();
    }
    editTodo(id, values) {
        this.model.editTodo(id, values);
        const row = document.getElementById(id);
        row.children[0].innerText = values.title;
        row.children[1].innerText = values.description;
        row.children[3].children[0].checked = values.completed;
    }
    removeTodo(id) {
        this.model.removeTodo(id);
        document.getElementById(id).remove();
    }
    createRow(todo) {
        const row = this.table.insertRow();
        row.setAttribute('id', todo.id);
        const td1 = document.createElement('td');
        row.innerHTML = `
            <td>${todo.title}</td>
            <td>${todo.description}</td>
            <td>${todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '—'}</td>
            <td class="text-center"></td>
            <td class="text-right d-flex justify-content-end gap-2"></td>
        `;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onclick = () => this.toggleCompleted(todo.id);
        row.children[3].appendChild(checkbox);

        const editBtn = document.createElement('button');
        editBtn.classList.add('btn', 'btn-primary', 'mb-1');
        editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
        editBtn.setAttribute('data-toggle', 'modal');
        editBtn.setAttribute('data-target', '#modal');
        editBtn.onclick = () => this.modal.setValues({
            id: todo.id,
            title: row.children[0].innerText,
            description: row.children[1].innerText,
            completed: row.children[3].children[0].checked,
        });
        //row.children[3].appendChild(editBtn);

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('btn', 'btn-danger', 'mb-1', 'ml-1');
        removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
        removeBtn.onclick = () => this.removeTodo(todo.id);
        //row.children[3].appendChild(removeBtn);

        const archiveBtn = document.createElement('button');
        archiveBtn.classList.add('btn', 'btn-warning', 'mb-1', 'ml-1');
        archiveBtn.innerHTML = '<i class="fa fa-archive"></i>';

        archiveBtn.onclick = () => {
            this.model.toggleArchived(todo.id);

            const updated = this.model.getTodos().find(t => t.id === todo.id);

            if (updated.archived) {
                row.classList.add('table-secondary');
            } else {
                row.classList.remove('table-secondary');
            }

            this.filter({ type: 'all', words: '' });
        };
        const actionsCell = row.children[4];

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(removeBtn);
        actionsCell.appendChild(archiveBtn);

        row.children[4].appendChild(archiveBtn);
        if (todo.archived) {
             row.classList.remove('table-danger', 'table-warning');
            row.classList.add('table-secondary');
        }

        if (todo.dueDate) {
            const today = new Date();
            const due = new Date(todo.dueDate);

            // quitar horas para comparar solo fecha
            today.setHours(0, 0, 0, 0);
            due.setHours(0, 0, 0, 0);

            const diffDays = (due - today) / (1000 * 60 * 60 * 24);

            if (diffDays < 0) {
                //vencida
                row.classList.add('table-danger');
               
            } else if (diffDays <= 2) {
                // próxima (2 días o menos)
                row.classList.add('table-warning');
            }
        }
    }
}