# Traveler - Angular Application

This is a complete Angular conversion of the original React travel website application. The application provides a comprehensive travel booking and management system with user authentication, admin panels, and multimedia management.

## Features

### Public Features
- **Home Page**: Interactive carousel with travel destinations and packages
- **About Page**: Company information and features
- **Services Page**: Travel services offered
- **Packages Page**: Travel package listings
- **Destinations Page**: Popular travel destinations
- **Guides Page**: Travel guide information
- **Blog Page**: Travel blog posts
- **Testimonials Page**: Customer testimonials
- **Contact Page**: Contact form and information

### Authentication
- **User Registration**: Complete user registration with validation
- **User Login**: Secure authentication system
- **Profile Management**: User profile editing and completion
- **Protected Routes**: Route guards for authenticated users

### Admin Features
- **User Management**: Full CRUD operations for users
- **Site Configuration**: Color and typography customization
- **Multimedia Management**: Carousel image and video management
- **Admin Dashboard**: Administrative controls and settings

## Technology Stack

- **Angular 19**: Latest Angular framework with standalone components
- **TypeScript**: Type-safe development
- **Bootstrap 5**: Responsive UI framework
- **Font Awesome**: Icon library
- **RxJS**: Reactive programming
- **Angular Router**: Client-side routing
- **Angular HTTP Client**: API communication

## Project Structure

```
src/
├── app/
│   ├── components/          # Shared components
│   │   ├── navbar/         # Navigation component
│   │   └── topbar/         # Top bar component
│   ├── guards/             # Route guards
│   │   ├── auth.guard.ts   # Authentication guard
│   │   └── admin.guard.ts  # Admin access guard
│   ├── interceptors/       # HTTP interceptors
│   │   └── auth.interceptor.ts
│   ├── models/             # TypeScript interfaces
│   │   ├── usuario.model.ts
│   │   ├── color.model.ts
│   │   ├── tipografia.model.ts
│   │   └── multimedia.model.ts
│   ├── services/           # Angular services
│   │   ├── api.service.ts  # API communication
│   │   ├── auth.service.ts # Authentication service
│   │   └── carousel.service.ts # Carousel state management
│   ├── views/              # Page components
│   │   ├── home/           # Home page
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── profile/        # User profile
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── usuarios-admin/ # Admin user management
│   │   ├── configuraciones/ # Site configuration
│   │   └── multimedia-admin/ # Multimedia management
│   ├── app.ts              # Main app component
│   ├── app.html            # Main app template
│   ├── app.css             # Main app styles
│   ├── app.config.ts       # App configuration
│   └── app.routes.ts       # Routing configuration
├── assets/                 # Static assets
│   ├── images/            # Image files
│   └── styles/            # Additional styles
└── styles.css             # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v19 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd angular-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Backend Setup

The application requires a backend API running on `http://localhost:3001`. Make sure the backend server is running before using the application.

## Key Features Implemented

### 1. Authentication System
- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes with guards
- Automatic token refresh
- Secure logout functionality

### 2. State Management
- Angular services for state management
- Reactive programming with RxJS
- Local storage integration
- Real-time data updates

### 3. Responsive Design
- Mobile-first approach
- Bootstrap 5 integration
- Custom CSS variables for theming
- Responsive navigation

### 4. Form Handling
- Template-driven forms
- Form validation
- Error handling
- User feedback

### 5. API Integration
- HTTP interceptors for authentication
- Error handling
- Loading states
- Type-safe API calls

## Configuration

### Environment Variables
Create a `src/environments/environment.ts` file:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api'
};
```

### Customization
- **Colors**: Modify CSS variables in `styles.css`
- **Typography**: Update font settings in the configuration panel
- **Images**: Replace assets in the `src/assets` folder

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in `dist/` can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## API Endpoints

The application expects the following API endpoints:

- `POST /api/usuarios/login` - User login
- `POST /api/usuarios/register` - User registration
- `GET /api/usuarios` - Get all users (admin)
- `PUT /api/usuarios/:id` - Update user
- `DELETE /api/usuarios/:id` - Delete user
- `GET /api/colores` - Get color configurations
- `GET /api/tipografias` - Get typography configurations
- `POST /api/contact` - Send contact message

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.