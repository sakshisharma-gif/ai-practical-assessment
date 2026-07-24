import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentTicket,
  selectTicketsLoading,
  selectTicketsError,
} from '../../store/selectors'
import {
  fetchTicketById,
  updateTicket,
  deleteTicket,
} from '../../store/slices/ticketsSlice'
import './TicketDetail.css'

/**
 * Ticket detail page with view and edit functionality
 * @returns {React.ReactNode} Ticket detail page
 */
const TicketDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const ticket = useSelector(selectCurrentTicket)
  const loading = useSelector(selectTicketsLoading)
  const error = useSelector(selectTicketsError)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [newComment, setNewComment] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchTicketById(parseInt(id)))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (ticket) {
      setEditForm({
        title: ticket.title || '',
        description: ticket.description || '',
        status: ticket.status || 'Open',
        priority: ticket.priority || 'Medium',
        assignee: ticket.assignee || '',
      })
    }
  }, [ticket])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (ticket && !isEditing) {
      setEditForm({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assignee: ticket.assignee,
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    if (!ticket) return
    
    const result = await dispatch(updateTicket({
      ticketId: ticket.id,
      updates: editForm
    }))
    
    if (result.type === 'tickets/updateTicket/fulfilled') {
      setIsEditing(false)
    }
  }

  const handleDeleteTicket = async () => {
    if (!ticket) return
    
    const result = await dispatch(deleteTicket(ticket.id))
    if (result.type === 'tickets/deleteTicket/fulfilled') {
      navigate('/tickets')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    // This would be implemented when API service layer is ready
    console.log('Adding comment:', newComment)
    setNewComment('')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'status-open',
      'In Progress': 'status-progress',
      'Resolved': 'status-resolved',
      'Closed': 'status-closed',
    }
    return colors[status] || 'status-default'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'priority-critical',
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low',
    }
    return colors[priority] || 'priority-default'
  }

  if (loading && !ticket) {
    return (
      <div className="ticket-detail-page">
        <div className="loading">Loading ticket details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ticket-detail-page">
        <div className="error-message">
          Error loading ticket: {error}
        </div>
        <Link to="/tickets" className="back-link">← Back to Tickets</Link>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-page">
        <div className="not-found">
          <h2>Ticket Not Found</h2>
          <p>The ticket you're looking for doesn't exist or has been deleted.</p>
          <Link to="/tickets" className="back-link">← Back to Tickets</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ticket-detail-page">
      <div className="page-header">
        <div className="header-top">
          <Link to="/tickets" className="back-link">← Back to Tickets</Link>
          <div className="ticket-actions">
            <button
              onClick={handleEditToggle}
              className={`edit-button ${isEditing ? 'active' : ''}`}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="ticket-id">Ticket #{ticket.id}</div>
      </div>

      <div className="ticket-content">
        <div className="main-content">
          <div className="ticket-header">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleInputChange}
                className="title-input"
                placeholder="Ticket title"
              />
            ) : (
              <h1 className="ticket-title">{ticket.title}</h1>
            )}
            
            <div className="ticket-badges">
              {isEditing ? (
                <>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleInputChange}
                    className="status-select"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <select
                    name="priority"
                    value={editForm.priority}
                    onChange={handleInputChange}
                    className="priority-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </>
              ) : (
                <>
                  <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="ticket-description">
            <h3>Description</h3>
            {isEditing ? (
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                className="description-textarea"
                placeholder="Ticket description"
                rows="6"
              />
            ) : (
              <div className="description-content">
                {ticket.description || 'No description provided.'}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="edit-actions">
              <button onClick={handleSaveChanges} className="save-button">
                Save Changes
              </button>
              <button onClick={handleEditToggle} className="cancel-button">
                Cancel
              </button>
            </div>
          )}

          {/* Comments Section */}
          <div className="comments-section">
            <h3>Comments</h3>
            
            <form onSubmit={handleAddComment} className="add-comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-textarea"
                rows="3"
              />
              <button type="submit" className="add-comment-button">
                Add Comment
              </button>
            </form>

            <div className="comments-list">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))
              ) : (
                <div className="no-comments">
                  No comments yet. Be the first to add one!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="ticket-info">
            <h3>Ticket Information</h3>
            <div className="info-group">
              <label>Assignee</label>
              {isEditing ? (
                <input
                  type="text"
                  name="assignee"
                  value={editForm.assignee}
                  onChange={handleInputChange}
                  className="assignee-input"
                  placeholder="Assignee name"
                />
              ) : (
                <span className="info-value">
                  {ticket.assignee || 'Unassigned'}
                </span>
              )}
            </div>
            <div className="info-group">
              <label>Reporter</label>
              <span className="info-value">{ticket.reporter}</span>
            </div>
            <div className="info-group">
              <label>Created</label>
              <span className="info-value">
                {formatDate(ticket.createdDate)}
              </span>
            </div>
            <div className="info-group">
              <label>Last Updated</label>
              <span className="info-value">
                {formatDate(ticket.updatedDate)}
              </span>
            </div>
            {ticket.resolutionDate && (
              <div className="info-group">
                <label>Resolved</label>
                <span className="info-value">
                  {formatDate(ticket.resolutionDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Ticket</h3>
            <p>Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={handleDeleteTicket}
                className="confirm-delete-button"
              >
                Delete Ticket
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="cancel-modal-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketDetail