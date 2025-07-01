from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import Optional
from datetime import datetime, date, timedelta
import json

from ..database import get_db
from ..models import Subscription, User
from ..schemas import AdminDashboardResponse, DashboardMetrics
from ..auth import get_current_admin_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/admin/metrics", response_model=AdminDashboardResponse)
def get_admin_dashboard_metrics(
    start_date: Optional[date] = Query(None, description="Start date for metrics (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date for metrics (YYYY-MM-DD)"),
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard metrics for the specified date range"""
    try:
        # Set default date range to current month if not provided
        if not start_date:
            start_date = date.today().replace(day=1)
        if not end_date:
            end_date = date.today()
        
        # Validate date range
        if start_date > end_date:
            raise HTTPException(status_code=400, detail="Start date must be before end date")
        
        # Get new subscriptions in date range
        new_subscriptions = db.query(Subscription).filter(
            and_(
                Subscription.created_at >= datetime.combine(start_date, datetime.min.time()),
                Subscription.created_at <= datetime.combine(end_date, datetime.max.time())
            )
        ).count()
        
        # Get active subscriptions (not cancelled and not paused)
        active_subscriptions = db.query(Subscription).filter(
            and_(
                Subscription.is_active == True,
                or_(
                    Subscription.pause_start_date.is_(None),
                    and_(
                        Subscription.pause_start_date.isnot(None),
                        Subscription.pause_end_date.isnot(None),
                        or_(
                            Subscription.pause_end_date < date.today(),
                            Subscription.pause_start_date > date.today()
                        )
                    )
                )
            )
        ).count()
        
        # Calculate Monthly Recurring Revenue (MRR)
        active_subscriptions_for_mrr = db.query(Subscription).filter(
            and_(
                Subscription.is_active == True,
                or_(
                    Subscription.pause_start_date.is_(None),
                    and_(
                        Subscription.pause_start_date.isnot(None),
                        Subscription.pause_end_date.isnot(None),
                        or_(
                            Subscription.pause_end_date < date.today(),
                            Subscription.pause_start_date > date.today()
                        )
                    )
                )
            )
        ).all()
        
        monthly_recurring_revenue = sum(sub.total_price for sub in active_subscriptions_for_mrr)
        
        # Calculate reactivations (subscriptions that were cancelled and then reactivated)
        # This is a simplified calculation - in a real system you'd track status changes
        reactivations = db.query(Subscription).filter(
            and_(
                Subscription.is_active == True,
                Subscription.updated_at >= datetime.combine(start_date, datetime.min.time()),
                Subscription.updated_at <= datetime.combine(end_date, datetime.max.time())
            )
        ).count()
        
        metrics = DashboardMetrics(
            new_subscriptions=new_subscriptions,
            monthly_recurring_revenue=monthly_recurring_revenue,
            reactivations=reactivations,
            active_subscriptions=active_subscriptions,
            date_range_start=start_date,
            date_range_end=end_date
        )
        
        return AdminDashboardResponse(
            success=True,
            message="Dashboard metrics retrieved successfully",
            metrics=metrics
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving dashboard metrics: {str(e)}")

@router.get("/admin/subscriptions/active")
def get_active_subscriptions_count(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get count of active subscriptions"""
    try:
        active_count = db.query(Subscription).filter(
            and_(
                Subscription.is_active == True,
                or_(
                    Subscription.pause_start_date.is_(None),
                    and_(
                        Subscription.pause_start_date.isnot(None),
                        Subscription.pause_end_date.isnot(None),
                        or_(
                            Subscription.pause_end_date < date.today(),
                            Subscription.pause_start_date > date.today()
                        )
                    )
                )
            )
        ).count()
        
        return {
            "success": True,
            "active_subscriptions": active_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving active subscriptions count: {str(e)}")

@router.get("/admin/subscriptions/paused")
def get_paused_subscriptions_count(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get count of paused subscriptions"""
    try:
        paused_count = db.query(Subscription).filter(
            and_(
                Subscription.is_active == True,
                Subscription.pause_start_date.isnot(None),
                Subscription.pause_end_date.isnot(None),
                Subscription.pause_start_date <= date.today(),
                Subscription.pause_end_date >= date.today()
            )
        ).count()
        
        return {
            "success": True,
            "paused_subscriptions": paused_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving paused subscriptions count: {str(e)}") 