import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        navigate('/todos')
      } else {
        setError(data.detail || 'Login failed')
      }
    } catch (error) {
      setError('Unable to connect. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="page shell login-page">
      <div className="login-hero">
        <span className="eyebrow">Welcome Back</span>
        <h1>Access Your Tasks</h1>
        <p>Sign in to your account to manage your daily tasks and stay productive.</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

    
    </main>
  )
}
  export default Login