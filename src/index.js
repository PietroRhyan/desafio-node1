const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(user => user.username === username)

  if(!user) {
    return response.status(400).send({error: 'Username not found!'})
  }

  request.username = user

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const valideteUser = (users.find(user => user.username === username))

  if(valideteUser) {
    return response.status(400).json({error: 'User already exists!'})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  }

  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request

  return response.status(200).json(username.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request

  const { title, deadline } = request.body

  username.todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  })

  return response.status(201).json(username.todos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request

  const { title, deadline } = request.body
  const { id } = request.query

  const todo = username.todos.find(todo => todo.id === id)

  todo.title = title
  todo.deadline = deadline

  return response.status(200).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request

  const { done } = request.body
  const { id } = request.query

  const todo = username.todos.find(todo => todo.id === id)

  todo.done = done

  return response.status(200).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request

  const { id } = request.query

  const todo = username.todos.find(todo => todo.id === id)

  username.todos.splice(todo)

  return response.status(200).send()
});

module.exports = app;