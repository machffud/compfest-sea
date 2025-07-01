# SEA Catering Frontend

A comprehensive React.js frontend application for SEA Catering, featuring user authentication, subscription management, admin dashboard, and responsive design.

## Features

- **Modern Design**: Clean and professional UI with responsive design
- **User Authentication**: Login, registration, and profile management
- **Subscription Management**: Create, pause, resume, and cancel subscriptions
- **Admin Dashboard**: Real-time analytics, user management, and testimonial review
- **User Dashboard**: Personal subscription management and status tracking
- **Meal Plan Display**: Browse available meal plans and pricing
- **Component-Based Architecture**: Modular components for easy maintenance
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS transitions and hover effects for better UX
- **Real-time Charts**: Interactive charts for analytics using Chart.js

## Tech Stack

- **Framework**: React.js 18.2.0
- **Routing**: React Router DOM 7.6.2
- **HTTP Client**: Axios 1.6.0
- **Charts**: Chart.js 4.4.0 + React Chart.js 2 5.2.0
- **Date Handling**: date-fns 2.30.0
- **Styling**: CSS3 with custom properties
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd compfest-sea/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── AuthModal.js
│   │   │   ├── AuthModal.css
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   ├── Register.js
│   │   │   └── Register.css
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminDashboard.css
│   │   │   ├── AdminUsers.js
│   │   │   ├── AdminUsers.css
│   │   │   ├── AdminTestimonials.js
│   │   │   ├── AdminTestimonials.css
│   │   │   ├── UserDashboard.js
│   │   │   └── UserDashboard.css
│   │   ├── Navigation/
│   │   │   ├── Navigation.js
│   │   │   └── Navigation.css
│   │   ├── Subscription/
│   │   │   ├── Subscription.js
│   │   │   ├── Subscription.css
│   │   │   ├── UserSubscriptions.js
│   │   │   └── UserSubscriptions.css
│   │   ├── MealPlans/
│   │   │   ├── MealPlans.js
│   │   │   └── MealPlans.css
│   │   ├── Testimonials/
│   │   │   ├── Testimonials.js
│   │   │   └── Testimonials.css
│   │   ├── Layout/
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── Footer.js
│   │   │   └── Footer.css
│   │   ├── Sections/
│   │   │   ├── Hero.js
│   │   │   ├── Hero.css
│   │   │   ├── Services.js
│   │   │   ├── Services.css
│   │   │   ├── Contact.js
│   │   │   └── Contact.css
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Components Overview

### Authentication Components
- **AuthModal**: Modal for login/registration
- **Login**: User login form with validation
- **Register**: User registration form with validation

### Dashboard Components
- **AdminDashboard**: Admin analytics with charts and metrics
- **AdminUsers**: User management with subscription details
- **AdminTestimonials**: Testimonial review and approval system
- **UserDashboard**: Personal subscription management

### Core Components
- **Navigation**: Responsive navigation with authentication state
- **Subscription**: Subscription creation and management
- **UserSubscriptions**: User's subscription list and actions
- **MealPlans**: Meal plan display and selection
- **Testimonials**: Customer review carousel and submission

### Layout Components
- **Header**: Main site header
- **Footer**: Site footer with links
- **Hero**: Landing page hero section
- **Services**: Services showcase
- **Contact**: Contact information

## Key Features

### User Authentication
- JWT-based authentication
- Automatic token management
- Protected routes
- Role-based access control (User/Admin)

### Subscription Management
- Create new subscriptions
- Pause subscriptions with date range
- Resume paused subscriptions
- Cancel subscriptions
- Real-time price calculation
- Status tracking (Active/Paused/Cancelled)

### Admin Dashboard
- Real-time analytics charts
- User management (activate/deactivate/make admin)
- Subscription overview
- Date range filtering for metrics

### User Dashboard
- Personal subscription overview
- Subscription status tracking
- Pause/resume functionality
- Subscription details view

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Adaptive layouts

## Design System

The application uses a consistent design system with CSS custom properties:

### Colors
- **Primary Color**: #667eea (Blue)
- **Secondary Color**: #764ba2 (Purple)
- **Success Color**: #28a745 (Green)
- **Warning Color**: #ffc107 (Yellow)
- **Danger Color**: #dc3545 (Red)
- **Text Colors**: #333 (Primary), #666 (Secondary)
- **Background**: #f8f9fa (Light Gray)

### Typography
- **Font Family**: System fonts with fallbacks
- **Font Sizes**: Responsive scale (0.85rem to 2rem)
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold)

### Spacing
- **Base Unit**: 8px
- **Spacing Scale**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem
- **Container Padding**: 1rem (mobile), 2rem (desktop)

### Components
- **Cards**: Rounded corners (8px), subtle shadows
- **Buttons**: Consistent padding, hover effects
- **Forms**: Clean inputs with focus states
- **Modals**: Overlay with backdrop blur

## API Integration

The frontend integrates with the backend API through the `api.js` service:

### Authentication API
- Login/Register
- Profile management
- Token management

### Subscription API
- CRUD operations
- Pause/Resume functionality
- Price calculation

### Admin API
- User management
- Testimonial approval
- Analytics data


## State Management

- **React Context**: Authentication state management
- **Local State**: Component-specific state
- **API State**: Server data management with loading states

## Security Features

- **Input Validation**: Client-side form validation
- **XSS Protection**: Safe rendering of user content
- **Authentication**: JWT token management
- **Authorization**: Role-based access control

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive images
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: API response caching

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Minimum**: ES6+ support required

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Maintain consistent naming conventions
- Add proper error handling

### Component Structure
- Separate logic from presentation
- Use props for data passing
- Implement proper prop validation
- Keep components focused and reusable

### Styling
- Use CSS custom properties for theming
- Follow BEM methodology for class names
- Implement responsive design patterns
- Maintain accessibility standards

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: Environment (development/production)

### Static Hosting
The build output can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

## Troubleshooting

### Common Issues
1. **API Connection**: Ensure backend is running on port 8000
2. **Authentication**: Clear localStorage if token issues occur
3. **Build Errors**: Check for missing dependencies
4. **Styling Issues**: Verify CSS custom properties are defined

### Development Tips
1. Use browser dev tools for debugging
2. Check network tab for API issues
3. Verify authentication state in React DevTools
4. Test responsive design on different screen sizes

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Test on multiple devices
4. Update documentation as needed
5. Ensure accessibility compliance

## Support

For issues and questions:
1. Check the browser console for errors
2. Verify API connectivity
3. Test with different browsers
4. Review the component documentation 