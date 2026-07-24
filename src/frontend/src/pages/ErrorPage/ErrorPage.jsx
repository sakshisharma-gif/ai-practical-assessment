import React from 'react'
import { Link, useRouteError } from 'react-router-dom'
import './ErrorPage.css'

/**
 * Error page component for handling router errors
 * @returns {React.ReactNode} Error page
 */
const ErrorPage = () => {
  const error = useRouteError()
  
  const getErrorMessage = () => {
    if (error?.status === 404) {
      return {
        title: '404 - Page Not Found',
        message: "Sorry, the page you're looking for doesn't exist.",
        suggestion: "The page might have been moved, deleted, or you might have mistyped the URL."
      }
    }
    
    if (error?.status === 403) {
      return {
        title: '403 - Access Forbidden',
        message: "You don't have permission to access this resource.",
        suggestion: "Please check your credentials or contact an administrator for access."
      }
    }
    
    if (error?.status >= 500) {
      return {
        title: '500 - Server Error',
        message: "Something went wrong on our end.",
        suggestion: "Please try again later or contact support if the problem persists."
      }
    }
    
    return {
      title: 'Oops! Something went wrong',
      message: error?.message || error?.statusText || 'An unexpected error occurred.',
      suggestion: "Please try refreshing the page or go back to the dashboard."
    }
  }

  const { title, message, suggestion } = getErrorMessage()

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-illustration">
          <div className="error-icon">
            {error?.status === 404 ? '🔍' : error?.status >= 500 ? '⚠️' : '❌'}
          </div>
        </div>

        <div className="error-content">
          <h1 className="error-title">{title}</h1>
          <p className="error-message">{message}</p>
          <p className="error-suggestion">{suggestion}</p>

          {error && process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>Technical Details (Development Mode)</summary>
              <div className="error-stack">
                <strong>Error:</strong> {error.message}
                {error.stack && (
                  <>
                    <br />
                    <strong>Stack:</strong>
                    <pre>{error.stack}</pre>
                  </>
                )}
              </div>
            </details>
          )}
        </div>

        <div className="error-actions">
          <Link to="/dashboard" className="primary-action">
            Go to Dashboard
          </Link>
          <button onClick={handleGoBack} className="secondary-action">
            Go Back
          </button>
          <button onClick={handleRefresh} className="secondary-action">
            Refresh Page
          </button>
        </div>

        <div className="error-help">
          <h3>Need Help?</h3>
          <p>If you continue to experience issues, you can:</p>
          <ul>
            <li>
              <Link to="/tickets/create" className="help-link">
                Create a support ticket
              </Link>
            </li>
            <li>Clear your browser cache and cookies</li>
            <li>Try using a different browser</li>
            <li>Check your internet connection</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage