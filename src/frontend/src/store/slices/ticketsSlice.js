import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Initial state for tickets
const initialState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    assignee: '',
    search: '',
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
  },
}

// Async thunks for ticket actions
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async ({ page = 1, pageSize = 10, filters = {} }, { rejectWithValue }) => {
    try {
      // This will be implemented when API service layer is ready
      // For now, return mock data
      const mockTickets = [
        {
          id: 1,
          title: 'Sample Ticket 1',
          description: 'This is a sample ticket description',
          status: 'Open',
          priority: 'High',
          assignee: 'John Doe',
          reporter: 'Jane Smith',
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Sample Ticket 2',
          description: 'Another sample ticket description',
          status: 'In Progress',
          priority: 'Medium',
          assignee: 'Alice Johnson',
          reporter: 'Bob Wilson',
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        }
      ]

      return {
        tickets: mockTickets,
        totalCount: 2,
        totalPages: 1,
        currentPage: page,
        pageSize
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets')
    }
  }
)

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (ticketId, { rejectWithValue }) => {
    try {
      // This will be implemented when API service layer is ready
      // For now, return mock data
      return {
        id: ticketId,
        title: `Sample Ticket ${ticketId}`,
        description: 'This is a sample ticket description with more details',
        status: 'Open',
        priority: 'High',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        comments: [
          {
            id: 1,
            content: 'This is a sample comment',
            author: 'John Doe',
            timestamp: new Date().toISOString(),
          }
        ]
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket')
    }
  }
)

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      // This will be implemented when API service layer is ready
      // For now, return mock data
      const newTicket = {
        id: Date.now(), // Mock ID
        ...ticketData,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      }
      return newTicket
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create ticket')
    }
  }
)

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ ticketId, updates }, { rejectWithValue }) => {
    try {
      // This will be implemented when API service layer is ready
      // For now, return mock data
      return {
        id: ticketId,
        ...updates,
        updatedDate: new Date().toISOString(),
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update ticket')
    }
  }
)

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (ticketId, { rejectWithValue }) => {
    try {
      // This will be implemented when API service layer is ready
      return ticketId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete ticket')
    }
  }
)

// Tickets slice
const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tickets cases
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false
        state.tickets = action.payload.tickets
        state.pagination = {
          currentPage: action.payload.currentPage,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalCount,
        }
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch ticket by ID cases
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false
        state.currentTicket = action.payload
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create ticket cases
      .addCase(createTicket.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false
        state.tickets.unshift(action.payload) // Add to beginning of list
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update ticket cases
      .addCase(updateTicket.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id)
        if (index !== -1) {
          state.tickets[index] = { ...state.tickets[index], ...action.payload }
        }
        if (state.currentTicket && state.currentTicket.id === action.payload.id) {
          state.currentTicket = { ...state.currentTicket, ...action.payload }
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete ticket cases
      .addCase(deleteTicket.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.loading = false
        state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload)
        if (state.currentTicket && state.currentTicket.id === action.payload) {
          state.currentTicket = null
        }
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentPage,
  setPageSize,
  clearCurrentTicket,
} = ticketsSlice.actions

export default ticketsSlice.reducer