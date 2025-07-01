from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import date

from ..database import get_db
from ..models import Subscription, User
from ..schemas import SubscriptionBase, Subscription as SubscriptionSchema, SubscriptionResponse, ListResponse, PauseSubscriptionRequest
from ..auth import get_current_user, get_current_admin_user, sanitize_input

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

def calculate_total_price(plan: str, meal_types: List[str], delivery_days: List[str]) -> float:
    """Calculate total price based on the formula"""
    plan_prices = {
        'diet': 30000,
        'protein': 40000,
        'royal': 60000
    }
    
    plan_price = plan_prices.get(plan, 0)
    meal_types_count = len(meal_types)
    delivery_days_count = len(delivery_days)
    
    return plan_price * meal_types_count * delivery_days_count * 4.3

@router.post("/", response_model=SubscriptionResponse)
def create_subscription(
    subscription: SubscriptionBase, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new subscription (authenticated users only)"""
    try:
        # Calculate total price
        total_price = calculate_total_price(
            subscription.plan,
            subscription.meal_types,
            subscription.delivery_days
        )
        
        # Sanitize inputs
        sanitized_name = sanitize_input(subscription.name)
        sanitized_phone = subscription.phone  # Already validated in schema
        sanitized_allergies = sanitize_input(subscription.allergies) if subscription.allergies else None
        
        # Create subscription object
        db_subscription = Subscription(
            user_id=current_user.id,
            name=sanitized_name,
            phone=sanitized_phone,
            plan=subscription.plan,
            meal_types=json.dumps(subscription.meal_types),
            delivery_days=json.dumps(subscription.delivery_days),
            allergies=sanitized_allergies,
            total_price=total_price
        )
        
        db.add(db_subscription)
        db.commit()
        db.refresh(db_subscription)
        
        # Convert JSON strings back to lists for response
        db_subscription.meal_types = json.loads(db_subscription.meal_types)
        db_subscription.delivery_days = json.loads(db_subscription.delivery_days)
        
        return SubscriptionResponse(
            success=True,
            message="Subscription created successfully",
            subscription=db_subscription
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[SubscriptionSchema])
def get_user_subscriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's subscriptions"""
    try:
        subscriptions = db.query(Subscription).filter(
            Subscription.user_id == current_user.id
        ).order_by(Subscription.created_at.desc()).all()
        print("subscriptions 88", subscriptions)
        # Convert JSON strings back to lists
        for sub in subscriptions:
            print("sub 88", sub)
            sub.meal_types = json.loads(sub.meal_types)
            sub.delivery_days = json.loads(sub.delivery_days)
            print("delivery days 94", sub.delivery_days)
        total = len(subscriptions)
        print("Hasil return")
        return subscriptions
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{subscription_id}", response_model=SubscriptionResponse)
def get_subscription(
    subscription_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific subscription (user can only access their own)"""
    try:
        subscription = db.query(Subscription).filter(
            Subscription.id == subscription_id,
            Subscription.user_id == current_user.id
        ).first()
        
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        # Convert JSON strings back to lists
        subscription.meal_types = json.loads(subscription.meal_types)
        subscription.delivery_days = json.loads(subscription.delivery_days)
        
        return SubscriptionResponse(
            success=True,
            message="Subscription retrieved successfully",
            subscription=subscription
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{subscription_id}/deactivate")
def deactivate_subscription(
    subscription_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deactivate a subscription (user can only deactivate their own)"""
    try:
        subscription = db.query(Subscription).filter(
            Subscription.id == subscription_id,
            Subscription.user_id == current_user.id
        ).first()
        
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        subscription.is_active = False
        db.commit()
        
        return {"success": True, "message": "Subscription deactivated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/calculate-price/")
def calculate_price(
    plan: str, 
    meal_types: str, 
    delivery_days: str,
    current_user: User = Depends(get_current_user)
):
    """Calculate price for given parameters (authenticated users only)"""
    try:
        meal_types_list = json.loads(meal_types)
        delivery_days_list = json.loads(delivery_days)
        
        total_price = calculate_total_price(plan, meal_types_list, delivery_days_list)
        
        return {
            "success": True,
            "total_price": total_price,
            "breakdown": {
                "plan": plan,
                "meal_types_count": len(meal_types_list),
                "delivery_days_count": len(delivery_days_list),
                "formula": f"Plan Price × {len(meal_types_list)} × {len(delivery_days_list)} × 4.3"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{subscription_id}/pause")
def pause_subscription(
    subscription_id: int,
    pause_request: PauseSubscriptionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Pause a subscription for a specific date range (user can only pause their own)"""
    try:
        subscription = db.query(Subscription).filter(
            Subscription.id == subscription_id,
            Subscription.user_id == current_user.id
        ).first()
        
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        if not subscription.is_active:
            raise HTTPException(status_code=400, detail="Cannot pause an inactive subscription")
        
        # Validate pause dates
        if pause_request.pause_start_date < date.today():
            raise HTTPException(status_code=400, detail="Pause start date cannot be in the past")
        
        subscription.pause_start_date = pause_request.pause_start_date
        subscription.pause_end_date = pause_request.pause_end_date
        db.commit()
        
        return {
            "success": True, 
            "message": f"Subscription paused from {pause_request.pause_start_date} to {pause_request.pause_end_date}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{subscription_id}/resume")
def resume_subscription(
    subscription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Resume a paused subscription (user can only resume their own)"""
    try:
        subscription = db.query(Subscription).filter(
            Subscription.id == subscription_id,
            Subscription.user_id == current_user.id
        ).first()
        
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        if not subscription.is_active:
            raise HTTPException(status_code=400, detail="Cannot resume an inactive subscription")
        
        if not subscription.pause_start_date or not subscription.pause_end_date:
            raise HTTPException(status_code=400, detail="Subscription is not paused")
        
        subscription.pause_start_date = None
        subscription.pause_end_date = None
        db.commit()
        
        return {
            "success": True, 
            "message": "Subscription resumed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Admin routes
@router.get("/admin/all", response_model=List[SubscriptionSchema])
def get_all_subscriptions(
    skip: int = 0,
    limit: int = 100,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all subscriptions (admin only)"""
    try:
        subscriptions = db.query(Subscription).offset(skip).limit(limit).all()
        
        # Convert JSON strings back to lists
        for sub in subscriptions:
            sub.meal_types = json.loads(sub.meal_types)
            sub.delivery_days = json.loads(sub.delivery_days)
        
        total = db.query(Subscription).count()
        
        return subscriptions
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/admin/{subscription_id}", response_model=SubscriptionResponse)
def get_any_subscription(
    subscription_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get any subscription by ID (admin only)"""
    try:
        subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
        
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        # Convert JSON strings back to lists
        subscription.meal_types = json.loads(subscription.meal_types)
        subscription.delivery_days = json.loads(subscription.delivery_days)
        
        return SubscriptionResponse(
            success=True,
            message="Subscription retrieved successfully",
            subscription=subscription
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/admin/{subscription_id}/deactivate")
def admin_deactivate_subscription(
    subscription_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Deactivate any subscription (admin only)"""
    try:
        subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
        
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        subscription.is_active = False
        db.commit()
        
        return {"success": True, "message": "Subscription deactivated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e)) 