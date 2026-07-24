import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'
import { store } from './store' // , persistor 
import App from './App.jsx'
import './index.css'

// Loading component for PersistGate
// const Loading = () => (
//   <div style={{
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     fontSize: '1.2rem',
//     color: '#666'
//   }}>
//     Loading...
//   </div>
// )

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Temporarily disabled PersistGate for debugging */}
      {/* <PersistGate loading={<Loading />} persistor={persistor}> */}
        <App />
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>,
)