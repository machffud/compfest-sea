# SEA Catering Backend API v2.0

## Overview
Secure backend API for SEA Catering built with FastAPI, featuring comprehensive authentication, authorization, and input validation to protect against common security threats.

## Security Features

- **🔐 Authentication**: JWT-based user authentication with bcrypt password hashing
- **🛡️ Authorization**: Role-based access control (User/Admin)
- **🛡️ XSS Protection**: Input sanitization and HTML escaping
- **🛡️ SQL Injection Protection**: Parameterized queries with SQLAlchemy ORM
- **🛡️ CSRF Protection**: JWT tokens prevent cross-site request forgery
- **✅ Input Validation**: Comprehensive field validation and sanitization
- **🔒 Secure Headers**: CORS and trusted host middleware

## Features

- **User Management**: Registration, login, profile management
- **Subscription Management**: Create and manage customer subscriptions
- **Testimonial System**: Submit and approve customer reviews
- **Meal Plan Management**: CRUD operations for meal plans
- **Real-time Price Calculation**: Dynamic pricing based on selections
- **Database Integration**: SQLite with SQLAlchemy ORM
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite (development)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Authentication**: JWT + bcrypt
- **Documentation**: Swagger UI / ReDoc

## Installation

### Prerequisites
- Python 3.8+
- pip

### Setup

1. **Navigate to backend directory:**
   ```bash
   cd sea/backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create admin user:**
   ```bash
   python create_admin.py
   ```

4. **Run the application:**
   ```bash
   python run.py
   ```

5. **Access the API:**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health
   - Security Info: http://localhost:8000/security

## API Endpoints

### Authentication (`/api/v1/auth/`)

#### User Registration
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### User Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get User Profile
```http
GET /api/v1/auth/me
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /api/v1/auth/me?full_name=New Name
Authorization: Bearer <jwt_token>
```

### Subscriptions (Authenticated)

#### Create Subscription
```http
POST /api/v1/subscriptions/
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "08123456789",
  "plan": "protein",
  "meal_types": ["breakfast", "dinner"],
  "delivery_days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "allergies": "No allergies"
}
```

#### Get User Subscriptions
```http
GET /api/v1/subscriptions/
Authorization: Bearer <jwt_token>
```

#### Calculate Price
```http
GET /api/v1/subscriptions/calculate-price/?plan=protein&meal_types=["breakfast","dinner"]&delivery_days=["monday","tuesday","wednesday","thursday","friday"]
Authorization: Bearer <jwt_token>
```

### Testimonials

#### Submit Testimonial (Authenticated)
```http
POST /api/v1/testimonials/
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "message": "Amazing service and delicious food!",
  "rating": 5
}
```

#### Get Approved Testimonials (Public)
```http
GET /api/v1/testimonials/?approved_only=true&skip=0&limit=100
```

#### Get User Testimonials (Authenticated)
```http
GET /api/v1/testimonials/my
Authorization: Bearer <jwt_token>
```

### Meal Plans (Public)

#### Get All Meal Plans
```http
GET /api/v1/meal-plans/?active_only=true&skip=0&limit=100
```

#### Get Plans by Type
```http
GET /api/v1/meal-plans/type/diet
```

#### Get Plan Prices
```http
GET /api/v1/meal-plans/prices/
```

### Admin Routes

#### Get All Users (Admin Only)
```http
GET /api/v1/auth/users
Authorization: Bearer <admin_jwt_token>
```

#### Get All Subscriptions (Admin Only)
```http
GET /api/v1/subscriptions/admin/all
Authorization: Bearer <admin_jwt_token>
```

#### Get Pending Testimonials (Admin Only)
```http
GET /api/v1/testimonials/admin/pending
Authorization: Bearer <admin_jwt_token>
```

## Security Implementation

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter (A-Z)
- Must contain lowercase letter (a-z)
- Must contain number (0-9)
- Must contain special character (!@#$%^&*(),.?":{}|<>)

### Input Validation
- **Email**: RFC-compliant format validation
- **Phone**: Indonesian format (10-13 digits)
- **Name**: Letters, spaces, and common punctuation only
- **Message**: Length limits and content filtering

### XSS Protection
- HTML escaping of all user inputs
- Automatic removal of `<script>` tags
- Blocking of `javascript:` protocols
- Removal of event handlers (`onclick`, `onload`, etc.)

### SQL Injection Protection
- All database operations use SQLAlchemy ORM
- Parameterized queries prevent injection
- Input validation before database operations
- No raw SQL execution

## Database Models

### User
- `id`: Primary key
- `full_name`: User's full name
- `email`: Unique email address
- `hashed_password`: Bcrypt hashed password
- `is_active`: Account status
- `is_admin`: Admin privileges
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

### Subscription
- `id`: Primary key
- `user_id`: Foreign key to User
- `name`: Customer name
- `phone`: Contact number
- `plan`: Selected plan (diet/protein/royal)
- `meal_types`: JSON array of selected meals
- `delivery_days`: JSON array of delivery days
- `allergies`: Optional dietary restrictions
- `total_price`: Calculated price
- `is_active`: Subscription status
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

### Testimonial
- `id`: Primary key
- `user_id`: Foreign key to User
- `name`: Customer name
- `message`: Review content
- `rating`: Star rating (1-5)
- `is_approved`: Admin approval status
- `created_at`: Creation timestamp

### MealPlan
- `id`: Primary key
- `name`: Plan name
- `description`: Plan description
- `price_per_meal`: Cost per meal
- `plan_type`: Plan category
- `features`: JSON array of features
- `is_active`: Plan availability
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

## Price Calculation

The subscription price is calculated using the formula:
```
Total Price = Plan Price × Number of Meal Types × Number of Delivery Days × 4.3
```

### Plan Prices
- **Diet Plan**: Rp30.000 per meal
- **Protein Plan**: Rp40.000 per meal
- **Royal Plan**: Rp60.000 per meal

### Example
- Plan: Protein Plan (Rp40.000)
- Meal Types: Breakfast + Dinner (2 types)
- Delivery Days: Monday to Friday (5 days)
- Total: Rp40.000 × 2 × 5 × 4.3 = Rp1.720.000

## Development

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application with security
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas with validation
│   ├── auth.py              # Authentication utilities
│   └── routes/
│       ├── __init__.py
│       ├── auth.py          # Authentication endpoints
│       ├── subscriptions.py # Subscription endpoints
│       ├── testimonials.py  # Testimonial endpoints
│       └── meal_plans.py    # Meal plan endpoints
├── requirements.txt         # Python dependencies
├── create_admin.py          # Admin user creation script
├── run.py                   # Application runner
└── README.md                # This file
```

### Adding New Endpoints

1. Create a new route file in `app/routes/`
2. Define your endpoints with proper authentication and validation
3. Add the router to `app/main.py`
4. Update this README with new endpoint documentation

### Security Best Practices

1. **Always validate and sanitize inputs**
2. **Use authentication for sensitive endpoints**
3. **Implement proper error handling**
4. **Use parameterized queries**
5. **Hash passwords with bcrypt**
6. **Validate JWT tokens**
7. **Implement rate limiting in production**

## Testing

### Manual Testing
Use the Swagger UI at http://localhost:8000/docs to test all endpoints interactively.

### Security Testing
```bash
# Test XSS protection
curl -X POST "http://localhost:8000/api/v1/testimonials/" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "message": "<script>alert(\"XSS\")</script>",
    "rating": 5
  }'

# Test SQL injection protection
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "\"; DROP TABLE users; --",
    "password": "test"
  }'
```

## Production Considerations

1. **Environment Variables**: Move SECRET_KEY to environment variables
2. **Database**: Migrate to PostgreSQL for production
3. **HTTPS**: Enable HTTPS in production
4. **Authentication**: Add JWT refresh tokens
5. **Rate Limiting**: Implement API rate limiting
6. **Logging**: Add security event logging
7. **Monitoring**: Implement security monitoring
8. **Backup**: Regular database backups
9. **Updates**: Keep dependencies updated
10. **Audit**: Regular security audits

## Troubleshooting

### Common Issues

1. **Port already in use**: Change port in `run.py`
2. **Database errors**: Delete `sea_catering.db` and restart
3. **Import errors**: Ensure all dependencies are installed
4. **Authentication errors**: Check JWT token validity
5. **CORS errors**: Check CORS configuration in `main.py`

### Security Issues

1. **Weak passwords**: Ensure password meets complexity requirements
2. **Invalid tokens**: Check token expiration and format
3. **Permission denied**: Verify user has required privileges
4. **Input validation errors**: Check field format requirements

### Logs
Check the console output for detailed error messages and logs.

## Support

For issues and questions:
1. Check the API documentation at http://localhost:8000/docs
2. Review the security info at http://localhost:8000/security
3. Check the error logs in the console
4. Verify all dependencies are installed correctly
5. Ensure proper authentication tokens are used 