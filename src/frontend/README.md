# Ticket Management System - Frontend

React.js frontend application for the Ticket Management System built with Vite.

## Technology Stack

- **React.js**: Component-based UI library
- **Vite**: Build tool and development server
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Vitest**: Testing framework
- **React Testing Library**: Component testing utilities

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 3000

### Installation

1. Navigate to the frontend directory:
```bash
cd src/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.development
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173/

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint (when configured)
- `npm run lint:fix` - Fix linting issues (when configured)

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components
│   ├── layout/          # Layout components
│   └── ticket/          # Ticket-specific components
├── pages/               # Page-level components
│   ├── Dashboard/       # Dashboard page
│   ├── TicketList/      # Ticket listing page
│   ├── TicketDetail/    # Individual ticket view
│   └── TicketCreate/    # Ticket creation form
├── store/               # Redux store configuration
│   ├── slices/          # Redux slices for different features
│   └── middleware/      # Custom middleware
├── services/            # API service layer
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constants/           # Application constants
└── __tests__/           # Test files
```

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:3000/api)
- `VITE_APP_NAME` - Application name
- `VITE_NODE_ENV` - Environment mode

### Testing

Run tests:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### API Integration

The frontend is configured to proxy API requests to the backend running on port 3000. The API base URL is configurable via the `VITE_API_BASE_URL` environment variable.

## Next Steps

1. Configure Redux store with feature slices (Task 1.2.2)
2. Set up routing with React Router (Task 1.2.3)
3. Create API service layer (Task 1.2.4)
4. Set up comprehensive testing (Task 1.2.5)