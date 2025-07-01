# SEA Catering Frontend

This is the frontend application for SEA Catering, built with React.js.

## Features

- **Modern Design**: Clean and professional UI with responsive design
- **Component-Based Architecture**: Modular components for easy maintenance
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS transitions and hover effects for better UX

## Components

- **Header**: Navigation bar with smooth scrolling
- **Hero**: Main landing section with call-to-action
- **Services**: Showcase of SEA Catering's key features
- **Contact**: Contact information and company story
- **Footer**: Additional links and copyright information

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
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
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Hero.js
│   │   ├── Hero.css
│   │   ├── Services.js
│   │   ├── Services.css
│   │   ├── Contact.js
│   │   ├── Contact.css
│   │   ├── Footer.js
│   │   └── Footer.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Design System

The application uses a consistent design system with CSS custom properties:

- **Primary Color**: #2D5A27 (Dark Green)
- **Secondary Color**: #4A7C59 (Medium Green)
- **Accent Color**: #8FBC8F (Light Green)
- **Text Colors**: #2C3E50 (Primary), #7F8C8D (Secondary)
- **Background**: #F8F9FA (Light Gray)

## Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px) 