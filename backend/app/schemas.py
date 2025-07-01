from pydantic import BaseModel, validator, EmailStr
from typing import List, Optional
from datetime import datetime, date
import json
import re

# Authentication Schemas
class UserBase(BaseModel):
    full_name: str
    email: EmailStr

    @validator('full_name')
    def validate_full_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Full name must be at least 2 characters long')
        if len(v) > 100:
            raise ValueError('Full name must be less than 100 characters')
        # Only allow letters, spaces, and common punctuation
        if not re.match(r'^[a-zA-Z\s\-\'\.]+$', v):
            raise ValueError('Full name contains invalid characters')
        return v.strip()

class UserCreate(UserBase):
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        
        # Check for uppercase, lowercase, number, and special character
        has_upper = bool(re.search(r'[A-Z]', v))
        has_lower = bool(re.search(r'[a-z]', v))
        has_digit = bool(re.search(r'\d', v))
        has_special = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', v))
        
        if not all([has_upper, has_lower, has_digit, has_special]):
            raise ValueError('Password must contain uppercase, lowercase, number, and special character')
        
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Subscription Schemas
class SubscriptionBase(BaseModel):
    name: str
    phone: str
    plan: str
    meal_types: List[str]
    delivery_days: List[str]
    allergies: Optional[str] = None

    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        if len(v) > 100:
            raise ValueError('Name must be less than 100 characters')
        # Only allow letters, spaces, and common punctuation
        if not re.match(r'^[a-zA-Z\s\-\'\.]+$', v):
            raise ValueError('Name contains invalid characters')
        return v.strip()

    @validator('phone')
    def validate_phone(cls, v):
        # Remove spaces and special characters
        clean_phone = re.sub(r'[^\d]', '', v)
        if len(clean_phone) < 10 or len(clean_phone) > 13:
            raise ValueError('Phone number must be between 10-13 digits')
        return clean_phone

    @validator('plan')
    def validate_plan(cls, v):
        valid_plans = ['diet', 'protein', 'royal']
        if v not in valid_plans:
            raise ValueError(f'Plan must be one of: {valid_plans}')
        return v

    @validator('meal_types')
    def validate_meal_types(cls, v):
        valid_meal_types = ['breakfast', 'lunch', 'dinner']
        if not v:
            raise ValueError('At least one meal type must be selected')
        for meal_type in v:
            if meal_type not in valid_meal_types:
                raise ValueError(f'Invalid meal type: {meal_type}')
        return v

    @validator('delivery_days')
    def validate_delivery_days(cls, v):
        valid_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        if not v:
            raise ValueError('At least one delivery day must be selected')
        for day in v:
            if day not in valid_days:
                raise ValueError(f'Invalid delivery day: {day}')
        return v

    @validator('allergies')
    def validate_allergies(cls, v):
        if v is not None and len(v) > 500:
            raise ValueError('Allergies field must be less than 500 characters')
        return v

class SubscriptionCreate(SubscriptionBase):
    total_price: float

class Subscription(SubscriptionBase):
    id: int
    user_id: int
    total_price: float
    is_active: bool
    pause_start_date: Optional[date] = None
    pause_end_date: Optional[date] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Testimonial Schemas
class TestimonialBase(BaseModel):
    name: str
    message: str
    rating: int

    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        if len(v) > 100:
            raise ValueError('Name must be less than 100 characters')
        # Only allow letters, spaces, and common punctuation
        if not re.match(r'^[a-zA-Z\s\-\'\.]+$', v):
            raise ValueError('Name contains invalid characters')
        return v.strip()

    @validator('message')
    def validate_message(cls, v):
        if not v or len(v.strip()) < 10:
            raise ValueError('Message must be at least 10 characters long')
        if len(v) > 1000:
            raise ValueError('Message must be less than 1000 characters')
        return v.strip()

    @validator('rating')
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

class TestimonialCreate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: int
    user_id: int
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Meal Plan Schemas
class MealPlanBase(BaseModel):
    name: str
    description: str
    price_per_meal: float
    plan_type: str
    features: Optional[List[str]] = None

    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        if len(v) > 100:
            raise ValueError('Name must be less than 100 characters')
        return v.strip()

    @validator('description')
    def validate_description(cls, v):
        if not v or len(v.strip()) < 10:
            raise ValueError('Description must be at least 10 characters long')
        if len(v) > 500:
            raise ValueError('Description must be less than 500 characters')
        return v.strip()

    @validator('price_per_meal')
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError('Price must be greater than 0')
        return v

    @validator('plan_type')
    def validate_plan_type(cls, v):
        valid_types = ['diet', 'protein', 'royal']
        if v not in valid_types:
            raise ValueError(f'Plan type must be one of: {valid_types}')
        return v

class MealPlanCreate(MealPlanBase):
    pass

class MealPlan(MealPlanBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Response Schemas
class SubscriptionResponse(BaseModel):
    success: bool
    message: str
    subscription: Optional[Subscription] = None

class TestimonialResponse(BaseModel):
    success: bool
    message: str
    testimonial: Optional[Testimonial] = None

class MealPlanResponse(BaseModel):
    success: bool
    message: str
    meal_plan: Optional[MealPlan] = None

class ListResponse(BaseModel):
    success: bool
    message: str
    data: List
    total: int

class UserResponse(BaseModel):
    success: bool
    message: str
    user: Optional[User] = None

# Dashboard Schemas
class PauseSubscriptionRequest(BaseModel):
    pause_start_date: date
    pause_end_date: date

    @validator('pause_end_date')
    def validate_pause_dates(cls, v, values):
        if 'pause_start_date' in values and v <= values['pause_start_date']:
            raise ValueError('Pause end date must be after pause start date')
        return v

class DashboardMetrics(BaseModel):
    new_subscriptions: int
    monthly_recurring_revenue: float
    reactivations: int
    active_subscriptions: int
    date_range_start: date
    date_range_end: date

class AdminDashboardResponse(BaseModel):
    success: bool
    message: str
    metrics: DashboardMetrics 