import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginUser } from '../../store/slices/authSlice'
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../store/selectors'
import './Login.css'

/**
 * Login page component
 * @returns {React.ReactNode} Login form
 */
const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      return
    }

    const result = await dispatch(loginUser({
      username: formData.username,
      password: formData.password
    }))

    if (result.type === 'auth/loginUser/fulfilled') {
      navigate(from, { replace: true })
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      username: 'demo',
      password: 'demo123'
    })
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🎫 Ticket Management</h1>
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              autoComplete="username"
              disabled={loading}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
                disabled={loading}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-section">
          <p>For demo purposes:</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="demo-button"
            disabled={loading}
          >
            Use Demo Credentials
          </button>
          <p className="demo-info">
            Username: <code>demo</code> | Password: <code>demo123</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login