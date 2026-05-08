import { useState, useEffect } from 'react'
import './App.css'

function TodoApp() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editTodoId, setEditTodoId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/todos/')
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      setMessage('Unable to load tasks. Try again later.')
    } finally {
      setIsLoading(false)
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
      setMessage('Task added successfully')
    } catch (error) {
      setMessage('Could not add task')
    }
  }

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id)
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
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)))
    } catch (error) {
      setMessage('Unable to update task')
    }
  }

  const startEdit = (todo) => {
    setEditTodoId(todo.id)
    setEditTitle(todo.title)
    setMessage('')
  }

  const cancelEdit = () => {
    setEditTodoId(null)
    setEditTitle('')
  }

  const saveTodo = async (id) => {
    if (!editTitle.trim()) return
    const todo = todos.find((t) => t.id === id)
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          title: editTitle,
        }),
      })
      const updatedTodo = await response.json()
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)))
      cancelEdit()
      setMessage('Task updated successfully')
    } catch (error) {
      setMessage('Unable to save changes')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'DELETE',
      })
      setTodos(todos.filter((t) => t.id !== id))
      setMessage('Task removed')
    } catch (error) {
      setMessage('Unable to delete task')
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <main className="page shell todo-page">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Task manager</span>
          <h1>Work smarter with your todo list</h1>
          <p>Track progress, edit tasks, and stay focused with a clean workspace.</p>
        </div>
        <div className="hero-summary">
          <div>
            <strong>{todos.length}</strong>
            <span>Tasks</span>
          </div>
          <div>
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </div>
        </div>
      </section>

      <section className="board">
        <div className="board-header">
          <div>
            <h2>Today&apos;s plan</h2>
            <p>Manage your active tasks with a modern, responsive layout.</p>
          </div>
          <button className="primary-button" onClick={fetchTodos}>Refresh</button>
        </div>

        <div className="todo-card">
          <div className="todo-input-row">
            <label htmlFor="new-task">Add a new task</label>
            <div className="todo-input-group">
              <input
                id="new-task"
                type="text"
                placeholder="Enter task name"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              />
              <button className="primary-button" onClick={addTodo}>Add task</button>
            </div>
          </div>

          {message && <div className="toast">{message}</div>}

          {isLoading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : todos.length === 0 ? (
            <div className="empty-state">No tasks yet. Add your first todo.</div>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-main">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    {editTodoId === todo.id ? (
                      <input
                        className="edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    ) : (
                      <span>{todo.title}</span>
                    )}
                  </div>
                  <div className="todo-actions">
                    {editTodoId === todo.id ? (
                      <>
                        <button className="secondary-button" onClick={cancelEdit}>Cancel</button>
                        <button className="primary-button" onClick={() => saveTodo(todo.id)}>Save</button>
                      </>
                    ) : (
                      <>
                        <button className="secondary-button" onClick={() => startEdit(todo)}>Edit</button>
                        <button className="danger-button" onClick={() => deleteTodo(todo.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

export default TodoApp