#!/usr/bin/env python3
"""
Script to create the first admin user for SEA Catering
Run this script once to set up the initial admin account
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash, validate_password, validate_email

def create_admin_user():
    """Create the first admin user"""
    print("=== SEA Catering Admin User Creation ===")
    print("This script will create the first admin user for the system.")
    print()
    
    # Get user input
    full_name = input("Enter full name: ").strip()
    email = input("Enter email: ").strip()
    password = input("Enter password: ").strip()
    confirm_password = input("Confirm password: ").strip()
    
    # Validation
    if not full_name or len(full_name) < 2:
        print("❌ Error: Full name must be at least 2 characters long")
        return False
    
    if not validate_email(email):
        print("❌ Error: Invalid email format")
        return False
    
    if not validate_password(password):
        print("❌ Error: Password must be at least 8 characters and contain:")
        print("   - Uppercase letter")
        print("   - Lowercase letter") 
        print("   - Number")
        print("   - Special character")
        return False
    
    if password != confirm_password:
        print("❌ Error: Passwords do not match")
        return False
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.is_admin == True).first()
        if existing_admin:
            print("❌ Error: Admin user already exists")
            return False
        
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print("❌ Error: Email already registered")
            return False
        
        # Create admin user
        hashed_password = get_password_hash(password)
        admin_user = User(
            full_name=full_name,
            email=email,
            hashed_password=hashed_password,
            is_active=True,
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Admin user created successfully!")
        print(f"   Name: {admin_user.full_name}")
        print(f"   Email: {admin_user.email}")
        print(f"   Admin: Yes")
        print(f"   Active: Yes")
        print()
        print("You can now login to the system with these credentials.")
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating admin user: {str(e)}")
        return False
    
    finally:
        db.close()

if __name__ == "__main__":
    success = create_admin_user()
    if not success:
        sys.exit(1) 