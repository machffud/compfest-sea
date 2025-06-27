from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Testimonial, User
from ..schemas import TestimonialCreate, Testimonial as TestimonialSchema, TestimonialResponse, ListResponse
from ..auth import get_current_user, get_current_admin_user, sanitize_input

router = APIRouter(prefix="/testimonials", tags=["testimonials"])

@router.post("/", response_model=TestimonialResponse)
def create_testimonial(
    testimonial: TestimonialCreate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new testimonial (authenticated users only)"""
    try:
        # Sanitize inputs
        sanitized_name = sanitize_input(testimonial.name)
        sanitized_message = sanitize_input(testimonial.message)
        
        db_testimonial = Testimonial(
            user_id=current_user.id,
            name=sanitized_name,
            message=sanitized_message,
            rating=testimonial.rating,
            is_approved=False  # New testimonials need approval
        )
        
        db.add(db_testimonial)
        db.commit()
        db.refresh(db_testimonial)
        
        return TestimonialResponse(
            success=True,
            message="Testimonial submitted successfully and pending approval",
            testimonial=db_testimonial
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=ListResponse)
def get_testimonials(
    approved_only: bool = True, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Get testimonials with optional approval filter (public endpoint)"""
    try:
        query = db.query(Testimonial)
        
        if approved_only:
            query = query.filter(Testimonial.is_approved == True)
        
        testimonials = query.order_by(Testimonial.created_at.desc()).offset(skip).limit(limit).all()
        total = query.count()
        
        return ListResponse(
            success=True,
            message="Testimonials retrieved successfully",
            data=testimonials,
            total=total
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/my", response_model=ListResponse)
def get_user_testimonials(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's testimonials"""
    try:
        testimonials = db.query(Testimonial).filter(
            Testimonial.user_id == current_user.id
        ).order_by(Testimonial.created_at.desc()).all()
        
        return ListResponse(
            success=True,
            message="User testimonials retrieved successfully",
            data=testimonials,
            total=len(testimonials)
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{testimonial_id}", response_model=TestimonialResponse)
def get_testimonial(
    testimonial_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific testimonial (user can only access their own or approved ones)"""
    try:
        testimonial = db.query(Testimonial).filter(
            Testimonial.id == testimonial_id
        ).first()
        
        if not testimonial:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Users can only access their own testimonials or approved ones
        if testimonial.user_id != current_user.id and not testimonial.is_approved:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return TestimonialResponse(
            success=True,
            message="Testimonial retrieved successfully",
            testimonial=testimonial
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{testimonial_id}/approve")
def approve_testimonial(
    testimonial_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Approve a testimonial (admin only)"""
    try:
        testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
        
        if not testimonial:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        testimonial.is_approved = True
        db.commit()
        
        return {"success": True, "message": "Testimonial approved successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{testimonial_id}/reject")
def reject_testimonial(
    testimonial_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Reject a testimonial (admin only)"""
    try:
        testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
        
        if not testimonial:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        db.delete(testimonial)
        db.commit()
        
        return {"success": True, "message": "Testimonial rejected and deleted"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/admin/pending", response_model=ListResponse)
def get_pending_testimonials(
    skip: int = 0, 
    limit: int = 100, 
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get pending testimonials for admin approval"""
    try:
        testimonials = db.query(Testimonial).filter(
            Testimonial.is_approved == False
        ).order_by(Testimonial.created_at.desc()).offset(skip).limit(limit).all()
        
        total = db.query(Testimonial).filter(Testimonial.is_approved == False).count()
        
        return ListResponse(
            success=True,
            message="Pending testimonials retrieved successfully",
            data=testimonials,
            total=total
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/stats/")
def get_testimonial_stats(db: Session = Depends(get_db)):
    """Get testimonial statistics (public endpoint)"""
    try:
        total = db.query(Testimonial).count()
        approved = db.query(Testimonial).filter(Testimonial.is_approved == True).count()
        pending = db.query(Testimonial).filter(Testimonial.is_approved == False).count()
        
        # Calculate average rating
        avg_rating = db.query(Testimonial).filter(Testimonial.is_approved == True).with_entities(
            db.func.avg(Testimonial.rating)
        ).scalar() or 0
        
        return {
            "success": True,
            "stats": {
                "total": total,
                "approved": approved,
                "pending": pending,
                "average_rating": round(float(avg_rating), 1)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 