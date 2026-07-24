import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectIsAuthenticated } from '../store/selectors'
import { logoutUser } from '../store/slices/authSlice'
import './Navigation.css'

/**
 * Navigation component with links and user actions
 * @returns {React.ReactNode} Navigation bar
 */
const Navigation = () => {
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/dashboard" className="brand-link">
            🎫 Ticket Management
          </NavLink>
        </div>

        <div className="nav-links">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/tickets" 
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Tickets
          </NavLink>
          <NavLink 
            to="/tickets/create" 
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Create Ticket
          </NavLink>
        </div>

        <div className="nav-user">
          <span className="user-info">
            👤 {user?.fullName || user?.username || 'User'}
          </span>
          <button 
            onClick={handleLogout}
            className="logout-btn"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation