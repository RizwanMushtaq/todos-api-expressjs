const express = require('express');
const fs = require('fs').promises;
const app = express();
app.use(express.json());

const TODOS_FILENAME = './todos.json';

let readTodos = async () => {
    try {
        let todos = await fs.readFile(TODOS_FILENAME);
        return JSON.parse(todos);
    } catch (error) {
        return [];
    }
};

let writeTodos = async (todos) => {
    await fs.writeFile(TODOS_FILENAME, JSON.stringify(todos));
};

app.get('/todos', async (req, res) => {
    let todos = await readTodos();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    let todos = await readTodos();
    let newTodo = {
        id: todos.length + 1,
        title: req.body.title,
        completed: false,
    };
    todos.push(newTodo);
    await writeTodos(todos);
    res.status(201).json(newTodo);
});

app.get('/todos/:id', async (req, res) => {
    let todos = await readTodos();
    let todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (todo) {
        res.json(todo);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.put('/todos/:id', async (req, res) => {
    let todos = await readTodos();
    let todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (todoIndex !== -1) {
        todos[todoIndex].title = req.body.title;
        await writeTodos(todos);
        res.json(todos[todoIndex]);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    let todos = await readTodos();
    let todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        await writeTodos(todos);
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.listen(3000, () => console.log('Todo API is listening on port 3000!'));
