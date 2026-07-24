import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Initial state for dashboard
const initialState = {
  kpiMetrics: {
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
  },
  ticketsByPriority: {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  },
  assignedTickets: [],
  recentTickets: [],
  loading: false,
  error: null,
}

// Async thunks for dashboard actions
export const fetchKPIMetrics = createAsyncThunk(
  'dashboard/fetchKPIMetrics',
  async (_, { rejectWithValue }) => {
    try {
      // This will be implemented when API service layer is ready
      // For now, return mock data
      return {
        totalTickets: 45,
        openTickets: 12,
        inProgressTickets: 8,
        resolvedTickets: 20,
        closedTickets: 5,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch KPI metrics')
    }
  }
)

export const fetchTicketsByPriority = createAsyncThunk(
  'dashboard/fetchTicketsByPriority',
  async (_, { rejectWithValue }) => {
    try {
      // This will be implemented when API service layer is ready
      // For now, return mock data
      return {
        low: 15,
        medium: 18,
        high: 10,
        critical: 2,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets by priority')
    }
  }
)

export const fetchAssignedTickets = createAsyncThunk(
  'dashboard/fetchAssignedTickets',
  async (userId, { rejectWithValue }) => {
    try {
      // This will be implemented when API service layer is ready
      // For now, return mock data
      return [
        {
          id: 1,
          title: 'Fix login issue',
          status: 'In Progress',
          priority: 'High',
          updatedDate: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Update documentation',
          status: 'Open',
          priority: 'Medium',
          updatedDate: new Date().toISOString(),
        },
      ]
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assigned tickets')
    }
  }
)

export const fetchRecentTickets = createAsyncThunk(
  'dashboard/fetchRecentTickets',
  async ({ limit = 10 }, { rejectWithValue }) => {
    try {
      // This will be implemented when API service layer is ready
      // For now, return mock data
      return [
        {
          id: 3,
          title: 'Database performance optimization',
          status: 'Open',
          priority: 'Critical',
          reporter: 'Alice Johnson',
          updatedDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        },
        {
          id: 4,
          title: 'UI component styling fixes',
          status: 'Resolved',
          priority: 'Low',
          reporter: 'Bob Wilson',
          updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: 5,
          title: 'API endpoint authentication',
          status: 'In Progress',
          priority: 'High',
          reporter: 'Carol Davis',
          updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        },
      ]
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent tickets')
    }
  }
)

export const refreshDashboard = createAsyncThunk(
  'dashboard/refreshDashboard',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      // Fetch all dashboard data
      await Promise.all([
        dispatch(fetchKPIMetrics()),
        dispatch(fetchTicketsByPriority()),
        dispatch(fetchAssignedTickets(userId)),
        dispatch(fetchRecentTickets({ limit: 10 })),
      ])
      return true
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to refresh dashboard')
    }
  }
)

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearDashboard: (state) => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch KPI metrics cases
      .addCase(fetchKPIMetrics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchKPIMetrics.fulfilled, (state, action) => {
        state.loading = false
        state.kpiMetrics = action.payload
      })
      .addCase(fetchKPIMetrics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch tickets by priority cases
      .addCase(fetchTicketsByPriority.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTicketsByPriority.fulfilled, (state, action) => {
        state.loading = false
        state.ticketsByPriority = action.payload
      })
      .addCase(fetchTicketsByPriority.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch assigned tickets cases
      .addCase(fetchAssignedTickets.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAssignedTickets.fulfilled, (state, action) => {
        state.loading = false
        state.assignedTickets = action.payload
      })
      .addCase(fetchAssignedTickets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch recent tickets cases
      .addCase(fetchRecentTickets.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRecentTickets.fulfilled, (state, action) => {
        state.loading = false
        state.recentTickets = action.payload
      })
      .addCase(fetchRecentTickets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Refresh dashboard cases
      .addCase(refreshDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(refreshDashboard.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(refreshDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearDashboard } = dashboardSlice.actions

export default dashboardSlice.reducer