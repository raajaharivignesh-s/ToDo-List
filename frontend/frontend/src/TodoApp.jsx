import { useState, useEffect } from 'react'
import './App.css'

function TodoApp() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8000/todos/')
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    try {
      const response = await fetch('http://localhost:8000/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodo,
          description: '',
          completed: false,
        }),
      })
      const data = await response.json()
      setTodos([...todos, data])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id)
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed,
        }),
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(t => t.id === id ? updatedTodo : t))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'DELETE',
      })
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className="app">
      <h1>Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.title}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoApp