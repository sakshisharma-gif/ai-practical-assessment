# Ticket Management System - Project Structure

## Project Folder Structure

This document outlines the complete folder structure for the Ticket Management System based on the technical architecture specifications.

```
ticket-management-system/
├── src/
│   ├── frontend/                    # React.js Frontend Application
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── common/              # Shared components (Button, Input, Modal)
│   │   │   ├── layout/              # Layout components (Header, Sidebar, Footer)
│   │   │   └── ticket/              # Ticket-specific components
│   │   ├── pages/                   # Page-level Components
│   │   │   ├── Dashboard/           # Dashboard page with KPI metrics
│   │   │   ├── TicketList/          # Ticket listing page
│   │   │   ├── TicketDetail/        # Individual ticket view
│   │   │   └── TicketCreate/        # Ticket creation form
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── store/                   # Redux Store Configuration
│   │   │   ├── slices/              # Redux slices for different features
│   │   │   └── middleware/          # Custom middleware
│   │   ├── services/                # API Service Layer (Axios)
│   │   ├── utils/                   # Utility Functions
│   │   ├── constants/               # Application Constants
│   │   ├── assets/                  # Static Assets
│   │   │   ├── images/              # Image files
│   │   │   └── styles/              # Global styles and themes
│   │   ├── __tests__/               # Frontend Test Files
│   │   │   ├── components/          # Component tests
│   │   │   │   ├── common/          # Common component tests
│   │   │   │   ├── layout/          # Layout component tests
│   │   │   │   └── ticket/          # Ticket component tests
│   │   │   ├── pages/               # Page component tests
│   │   │   ├── hooks/               # Custom hook tests
│   │   │   ├── services/            # API service tests
│   │   │   └── utils/               # Utility function tests
│   │   ├── __mocks__/               # Mock Files
│   │   └── setupTests.js            # Test Configuration (to be created)
│   │
│   └── backend/                     # Node.js/Express Backend API
│       ├── controllers/             # Request Handlers and Business Logic
│       │   ├── ticketController.js  # Ticket CRUD operations (to be created)
│       │   ├── commentController.js # Comment operations (to be created)
│       │   └── dashboardController.js # Dashboard KPI operations (to be created)
│       ├── models/                  # MongoDB/Mongoose Schemas
│       │   ├── Ticket.js            # Ticket model (to be created)
│       │   ├── Comment.js           # Comment model (to be created)
│       │   └── User.js              # User model (to be created)
│       ├── routes/                  # API Route Definitions
│       │   ├── tickets.js           # Ticket routes (to be created)
│       │   ├── comments.js          # Comment routes (to be created)
│       │   └── dashboard.js         # Dashboard routes (to be created)
│       ├── middleware/              # Custom Middleware Functions
│       │   ├── auth.js              # Authentication middleware (to be created)
│       │   ├── validation.js        # Input validation middleware (to be created)
│       │   └── errorHandler.js      # Error handling middleware (to be created)
│       ├── services/                # Business Logic Services
│       │   ├── ticketService.js     # Ticket business logic (to be created)
│       │   ├── commentService.js    # Comment business logic (to be created)
│       │   └── dashboardService.js  # Dashboard business logic (to be created)
│       ├── utils/                   # Utility Functions
│       │   ├── helpers.js           # General helper functions (to be created)
│       │   └── validators.js        # Validation utilities (to be created)
│       ├── config/                  # Configuration Files
│       │   ├── database.js          # Database configuration (to be created)
│       │   └── environment.js       # Environment configuration (to be created)
│       ├── __tests__/               # Backend Test Files
│       │   ├── controllers/         # Controller tests
│       │   │   ├── ticketController.test.js
│       │   │   ├── commentController.test.js
│       │   │   └── dashboardController.test.js
│       │   ├── models/              # Model tests
│       │   │   ├── Ticket.test.js
│       │   │   ├── Comment.test.js
│       │   │   └── User.test.js
│       │   ├── services/            # Service layer tests
│       │   ├── middleware/          # Middleware tests
│       │   └── routes/              # Route integration tests
│       ├── fixtures/                # Test Data Fixtures
│       ├── helpers/                 # Test Helper Functions
│       └── app.js                   # Express App Configuration (to be created)
│
├── database/                        # Database Management
│   ├── config/                      # Database Configuration
│   │   └── connection.js            # MongoDB connection setup (to be created)
│   ├── migrations/                  # Database Migration Files
│   │   └── initial-setup.js         # Initial database setup (to be created)
│   └── seeds/                       # Database Seed Files
│       ├── users.js                 # User seed data (to be created)
│       └── tickets.js               # Sample ticket data (to be created)
│
├── test/                           # Testing Workflow
│   ├── unit/                       # Unit Tests
│   │   ├── frontend/               # Frontend unit tests
│   │   └── backend/                # Backend unit tests
│   ├── integration/                # Integration Tests
│   │   ├── api/                    # API integration tests
│   │   └── database/               # Database integration tests
│   ├── e2e/                        # End-to-End Tests
│   │   ├── user-journeys/          # Complete user workflow tests
│   │   └── cross-browser/          # Browser compatibility tests
│   ├── fixtures/                   # Shared Test Data
│   │   ├── tickets.json            # Sample ticket data (to be created)
│   │   ├── users.json              # Sample user data (to be created)
│   │   └── comments.json           # Sample comment data (to be created)
│   ├── mocks/                      # Mock Data and Services
│   │   ├── api-mocks.js            # API response mocks (to be created)
│   │   └── database-mocks.js       # Database operation mocks (to be created)
│   ├── helpers/                    # Test Helper Functions
│   │   ├── test-utils.js           # Common test utilities (to be created)
│   │   └── setup-helpers.js        # Test environment setup (to be created)
│   └── config/                     # Test Configuration
│       ├── jest.config.js          # Jest configuration (to be created)
│       └── test-env.js             # Test environment setup (to be created)
│
├── docs/                           # Documentation
│   ├── requirements.md             # ✅ Created - Project Requirements
│   ├── technical-architecture.md   # ✅ Created - Technical Architecture
│   ├── coding-guidelines.md        # ✅ Created - Coding Standards
│   ├── project-structure.md        # ✅ Created - This file
│   └── api-documentation.md        # API documentation (to be created)
│
├── scripts/                        # Build and Deployment Scripts
│   ├── build.sh                    # Build script (to be created)
│   ├── deploy.sh                   # Deployment script (to be created)
│   └── test.sh                     # Test execution script (to be created)
│
├── .env.example                    # Environment variables template (to be created)
├── .gitignore                      # Git ignore file (to be created)
├── package.json                    # Project dependencies (to be created)
├── README.md                       # Project overview (to be created)
└── prompt-history.md               # ✅ Created - Development prompt history
```

## Folder Structure Purpose

### `/src` Directory
- **Purpose**: Contains all source code for both frontend and backend applications
- **Organization**: Separated by application layer (frontend/backend)
- **Benefits**: Clear separation of concerns, easy navigation, scalable structure

### `/src/frontend` Directory
- **Framework**: React.js with Redux state management
- **Structure**: Component-based architecture with clear separation of UI, logic, and data
- **Testing**: Co-located test files with comprehensive coverage
- **Assets**: Organized static resources (images, styles)

### `/src/backend` Directory
- **Framework**: Node.js with Express.js
- **Pattern**: MVC (Model-View-Controller) architecture
- **Structure**: Layered architecture with controllers, services, and models
- **Testing**: Comprehensive API and business logic testing

### `/database` Directory
- **Purpose**: Database-related configurations and operations
- **Migration**: Database schema versioning and updates
- **Seeding**: Initial and test data population
- **Configuration**: Database connection and setup

### `/test` Directory
- **Strategy**: Testing pyramid approach (Unit → Integration → E2E)
- **Framework**: Jest as primary testing framework
- **Coverage**: Minimum 80% code coverage requirement
- **Organization**: Tests organized by type and scope

## Key Features Supported

### Ticket Management
- Create, read, update, delete tickets
- Status management with state machine
- Field updates (title, description, priority, assignee, labels/tags)
- Ticket listing with filtering and search

### Comments System
- Add comments to tickets
- View comments with author and timestamp
- Chronological comment display

### Dashboard
- KPI metrics display
- Recently updated tickets
- Tickets assigned to current user
- Filter and search functionality

### User Management
- User authentication and authorization
- Role-based access control
- User profiles and preferences

## Development Workflow

1. **Feature Development**: Implement in respective frontend/backend folders
2. **Testing**: Create tests in corresponding test directories
3. **Database Changes**: Update migrations and seeds as needed
4. **Documentation**: Update relevant documentation files
5. **Integration**: Ensure frontend-backend integration works correctly

## Next Steps

1. Initialize package.json files for frontend and backend
2. Set up development dependencies and build tools
3. Create basic configuration files (.env, .gitignore)
4. Implement core models and database schemas
5. Set up basic routing and API structure
6. Create fundamental React components and Redux store
7. Implement authentication and authorization
8. Begin feature development with testing

---

*This structure follows the technical architecture specifications and provides a solid foundation for scalable development of the Ticket Management System.*