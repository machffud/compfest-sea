from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models import MealPlan
from ..schemas import MealPlanCreate, MealPlan as MealPlanSchema, MealPlanResponse, ListResponse

router = APIRouter(prefix="/meal-plans", tags=["meal-plans"])

@router.post("/", response_model=MealPlanResponse)
def create_meal_plan(meal_plan: MealPlanCreate, db: Session = Depends(get_db)):
    """Create a new meal plan"""
    try:
        db_meal_plan = MealPlan(
            name=meal_plan.name,
            description=meal_plan.description,
            price_per_meal=meal_plan.price_per_meal,
            plan_type=meal_plan.plan_type,
            features=json.dumps(meal_plan.features) if meal_plan.features else None
        )
        
        db.add(db_meal_plan)
        db.commit()
        db.refresh(db_meal_plan)
        
        # Convert JSON string back to list for response
        if db_meal_plan.features:
            db_meal_plan.features = json.loads(db_meal_plan.features)
        
        return MealPlanResponse(
            success=True,
            message="Meal plan created successfully",
            meal_plan=db_meal_plan
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=ListResponse)
def get_meal_plans(
    active_only: bool = True, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Get meal plans with optional active filter"""
    try:
        query = db.query(MealPlan)
        
        if active_only:
            query = query.filter(MealPlan.is_active == True)
        
        meal_plans = query.order_by(MealPlan.created_at.desc()).offset(skip).limit(limit).all()
        
        # Convert JSON strings back to lists
        for plan in meal_plans:
            if plan.features:
                plan.features = json.loads(plan.features)
        
        total = query.count()
        
        return ListResponse(
            success=True,
            message="Meal plans retrieved successfully",
            data=meal_plans,
            total=total
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{meal_plan_id}", response_model=MealPlanResponse)
def get_meal_plan(meal_plan_id: int, db: Session = Depends(get_db)):
    """Get a specific meal plan by ID"""
    try:
        meal_plan = db.query(MealPlan).filter(MealPlan.id == meal_plan_id).first()
        
        if not meal_plan:
            raise HTTPException(status_code=404, detail="Meal plan not found")
        
        # Convert JSON string back to list
        if meal_plan.features:
            meal_plan.features = json.loads(meal_plan.features)
        
        return MealPlanResponse(
            success=True,
            message="Meal plan retrieved successfully",
            meal_plan=meal_plan
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/type/{plan_type}", response_model=ListResponse)
def get_meal_plans_by_type(plan_type: str, db: Session = Depends(get_db)):
    """Get meal plans by type (diet, protein, royal)"""
    try:
        meal_plans = db.query(MealPlan).filter(
            MealPlan.plan_type == plan_type,
            MealPlan.is_active == True
        ).all()
        
        # Convert JSON strings back to lists
        for plan in meal_plans:
            if plan.features:
                plan.features = json.loads(plan.features)
        
        return ListResponse(
            success=True,
            message=f"Meal plans of type '{plan_type}' retrieved successfully",
            data=meal_plans,
            total=len(meal_plans)
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{meal_plan_id}/deactivate")
def deactivate_meal_plan(meal_plan_id: int, db: Session = Depends(get_db)):
    """Deactivate a meal plan"""
    try:
        meal_plan = db.query(MealPlan).filter(MealPlan.id == meal_plan_id).first()
        
        if not meal_plan:
            raise HTTPException(status_code=404, detail="Meal plan not found")
        
        meal_plan.is_active = False
        db.commit()
        
        return {"success": True, "message": "Meal plan deactivated successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{meal_plan_id}/activate")
def activate_meal_plan(meal_plan_id: int, db: Session = Depends(get_db)):
    """Activate a meal plan"""
    try:
        meal_plan = db.query(MealPlan).filter(MealPlan.id == meal_plan_id).first()
        
        if not meal_plan:
            raise HTTPException(status_code=404, detail="Meal plan not found")
        
        meal_plan.is_active = True
        db.commit()
        
        return {"success": True, "message": "Meal plan activated successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/prices/")
def get_plan_prices():
    """Get current plan prices"""
    return {
        "success": True,
        "prices": {
            "diet": 30000,
            "protein": 40000,
            "royal": 60000
        },
        "formula": "Total Price = Plan Price × Number of Meal Types × Number of Delivery Days × 4.3"
    } 