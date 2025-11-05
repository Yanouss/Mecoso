# MECOSO Industrial Solutions - Full Stack Web Application

## 📋 Project Overview

MECOSO is a comprehensive full-stack web application for an industrial solutions company based in Morocco. The platform showcases the company's services, machinery portfolio, project gallery, and facilitates client engagement through a modern, multilingual web interface with a robust content management system.

## 🏗️ Project Architecture

### Frontend (React + TypeScript + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router for single-page application navigation
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React Context for theme, authentication, and translations
- **UI Components**: Custom components with Sonner for toast notifications

### Backend (Node.js + Express + MongoDB)
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with role-based access control
- **File Handling**: Multer for image and file uploads
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Error Handling**: Centralized error handling with custom error responses

## 🎯 Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication system
- Role-based access control (Admin, Moderator)
- Secure password reset functionality
- User management for administrators

### 🌐 Multilingual Support
- Comprehensive translation system (English & French)
- Dynamic language switching
- Translation management interface
- JSON-based translation storage

### 🖼️ Content Management
- **Hero Section**: Customizable landing page banner
- **About Page**: Company story, mission, vision, and team
- **Services**: Service offerings with ordering capability
- **Machines**: Equipment portfolio with specifications
- **Gallery**: Project portfolio with categorization
- **Testimonials**: Client feedback and reviews
- **Contact**: Company information and contact details

### 📁 File Management
- Image upload and optimization
- Portfolio file management (PDF, PPT, PPTX)
- Video support for content sections
- Automatic file cleanup and storage management

### 🎨 User Experience
- Responsive design for all devices
- Dark/light theme toggle
- Smooth animations and transitions
- Accessible navigation and interactions

## 📁 Project Structure

```
mecoso-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Route components
│   │   └── utils/            # Helper functions and API calls
│   └── public/               # Static assets
│
├── backend/                  # Node.js backend application
│   ├── controllers/          # Route handlers
│   ├── models/               # MongoDB schemas
│   ├── routes/               # Express route definitions
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Utility functions
│   └── uploads/              # File storage
│
└── documentation/            # Project documentation
```

## 🗄️ Database Models

### Core Models:
- **User**: Authentication and user management
- **Hero**: Landing page hero section content
- **About**: Company information and story
- **Service**: Service offerings and details
- **Machine**: Equipment specifications and status
- **GalleryItem**: Project portfolio items
- **Testimonial**: Client testimonials
- **Contact**: Contact information
- **Translation**: Multi-language content

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User authentication
- `GET /me` - Get current user
- `PUT /updatedetails` - Update user profile
- `PUT /updatepassword` - Change password
- `POST /forgotpassword` - Password reset request
- `PUT /resetpassword/:token` - Password reset
- `POST /create-user` - Create new user (Admin only)
- `GET /users` - Get all users (Admin only)

### Content Management
- **Hero** (`/api/hero`) - Landing page banner management
- **About** (`/api/about`) - Company information
- **Services** (`/api/services`) - Service offerings
- **Machines** (`/api/machines`) - Equipment portfolio
- **Gallery** (`/api/gallery`) - Project portfolio
- **Testimonials** (`/api/testimonials`) - Client feedback
- **Contact** (`/api/contact`) - Contact information

### File Management
- Multiple file upload endpoints
- Image processing and optimization
- Portfolio file handling
- Automatic file cleanup

## 🛠️ Technical Implementation

### Frontend Technical Stack:
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **React Router v6** for navigation
- **Axios** for API communication
- **Sonner** for toast notifications
- **Context API** for state management

### Backend Technical Stack:
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Express Rate Limit** for API protection

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Rate limiting on API endpoints
- File upload validation
- XSS protection

## 🚀 Deployment & Environment

### Environment Variables:
```env
# Database
MONGODB_URI=mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Client URLs
CLIENT_URL=http://localhost:3000
CLIENT_URL_PROD=production_url

# Server
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📦 Installation & Setup

### Prerequisites:
- Node.js (v16 or higher)
- MongoDB Atlas or local MongoDB instance
- npm or yarn package manager

### Backend Setup:
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend Setup:
```bash
cd frontend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

## 🎨 Customization

### Adding New Languages:
1. Update translation controller
2. Add language keys to translation model
3. Create corresponding frontend language files
4. Update language selector component

### Adding New Content Sections:
1. Create new MongoDB model
2. Implement controller with CRUD operations
3. Create corresponding routes
4. Build frontend components
5. Add to admin dashboard

### Theming:
- Modify Tailwind configuration
- Update ThemeContext for new themes
- Add corresponding CSS variables

## 📈 Performance Optimizations

- Image optimization and lazy loading
- API response caching
- Database query optimization
- Code splitting and lazy loading
- Bundle size optimization
- CDN for static assets

## 🔄 Development Workflow

1. **Content Updates**: Use admin dashboard for real-time content changes
2. **Translation Management**: Update translations through admin interface
3. **File Management**: Upload and manage images through dedicated endpoints
4. **User Management**: Admin panel for user roles and permissions
5. **Backup & Export**: Built-in data export functionality

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary and developed for MECOSO Industrial Solutions.

## 🆘 Support

For technical support or questions about this application, contact the development team or refer to the API documentation available at `/api` endpoint when the server is running.

---

**Built with modern web technologies to deliver a scalable, maintainable, and user-friendly industrial company website with comprehensive content management capabilities.**