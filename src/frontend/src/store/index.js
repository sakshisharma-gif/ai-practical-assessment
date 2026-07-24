import { configureStore } from '@reduxjs/toolkit'
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // localStorage
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import ticketsReducer from './slices/ticketsSlice'
import dashboardReducer from './slices/dashboardSlice'

// Temporarily disable Redux Persist to debug storage issues
// Create a safe storage wrapper
// const createNoopStorage = () => {
//   return {
//     getItem() {
//       return Promise.resolve(null)
//     },
//     setItem() {
//       return Promise.resolve()
//     },
//     removeItem() {
//       return Promise.resolve()
//     },
//   }
// }

// Use safe storage or fallback to noop
// const safeStorage = typeof window !== 'undefined' ? storage : createNoopStorage()

// Persist configuration
// const persistConfig = {
//   key: 'root',
//   storage: safeStorage,
//   whitelist: ['auth'], // Only persist auth state
//   blacklist: ['tickets', 'dashboard'], // Don't persist these (fetch fresh data)
// }

// Auth persist configuration (more specific)
// const authPersistConfig = {
//   key: 'auth',
//   storage: safeStorage,
//   whitelist: ['user', 'token', 'isAuthenticated'], // Only persist these auth fields
// }

// Root reducer without persistence for now
const rootReducer = combineReducers({
  auth: authReducer, // persistReducer(authPersistConfig, authReducer),
  tickets: ticketsReducer,
  dashboard: dashboardReducer,
})

// Regular reducer (no persistence for debugging)
// const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store with regular reducer
export const store = configureStore({
  reducer: rootReducer, // persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types in serializability check
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Create persistor (disabled for now)
// export const persistor = persistStore(store)
export const persistor = null // Temporary

export default store