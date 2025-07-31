from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List
import logging
from pathlib import Path
from datetime import datetime, timedelta
import calendar

from database import get_db, create_tables, Category as DBCategory, Transaction as DBTransaction, TransactionType
from models import (
    CategoryCreate, CategoryUpdate, Category,
    TransactionCreate, TransactionUpdate, Transaction,
    MonthlyData, DashboardSummary
)

# Create tables on startup
create_tables()

# Create the main app
app = FastAPI()

# Create API router
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Personal Finance Tracker API"}

# Category endpoints
@api_router.get("/categories", response_model=List[Category])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(DBCategory).order_by(DBCategory.name).all()
    return categories

@api_router.post("/categories", response_model=Category)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    # Check if category name already exists
    existing = db.query(DBCategory).filter(DBCategory.name == category.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    
    db_category = DBCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@api_router.put("/categories/{category_id}", response_model=Category)
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    db_category = db.query(DBCategory).filter(DBCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if new name conflicts with existing category (excluding current one)
    existing = db.query(DBCategory).filter(
        DBCategory.name == category.name,
        DBCategory.id != category_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    
    for field, value in category.dict().items():
        setattr(db_category, field, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@api_router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(DBCategory).filter(DBCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if category has transactions
    transaction_count = db.query(DBTransaction).filter(DBTransaction.category_id == category_id).count()
    if transaction_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete category. It has {transaction_count} transactions."
        )
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}

# Transaction endpoints
@api_router.get("/transactions", response_model=List[Transaction])
def get_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(DBTransaction).order_by(DBTransaction.date.desc()).offset(skip).limit(limit).all()
    return transactions

@api_router.post("/transactions", response_model=Transaction)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    # Verify category exists
    category = db.query(DBCategory).filter(DBCategory.id == transaction.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category not found"
        )
    
    db_transaction = DBTransaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
def update_transaction(transaction_id: int, transaction: TransactionUpdate, db: Session = Depends(get_db)):
    db_transaction = db.query(DBTransaction).filter(DBTransaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Verify category exists
    category = db.query(DBCategory).filter(DBCategory.id == transaction.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category not found"
        )
    
    for field, value in transaction.dict().items():
        setattr(db_transaction, field, value)
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@api_router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(DBTransaction).filter(DBTransaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}

# Monthly data endpoint
@api_router.get("/transactions/monthly", response_model=List[MonthlyData])
def get_monthly_data(db: Session = Depends(get_db)):
    # Get data for last 6 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    
    # Query monthly aggregated data
    monthly_stats = db.query(
        extract('year', DBTransaction.date).label('year'),
        extract('month', DBTransaction.date).label('month'),
        DBTransaction.type,
        func.sum(DBTransaction.amount).label('total')
    ).filter(
        DBTransaction.date >= start_date
    ).group_by(
        extract('year', DBTransaction.date),
        extract('month', DBTransaction.date),
        DBTransaction.type
    ).all()
    
    # Organize data by month
    monthly_data = {}
    for stat in monthly_stats:
        year, month, transaction_type, total = stat
        month_key = f"{calendar.month_abbr[int(month)]} {int(year)}"
        
        if month_key not in monthly_data:
            monthly_data[month_key] = {"month": month_key, "income": 0.0, "expenses": 0.0}
        
        if transaction_type == TransactionType.income:
            monthly_data[month_key]["income"] = float(total)
        else:
            monthly_data[month_key]["expenses"] = float(total)
    
    # Convert to list and sort by date
    result = list(monthly_data.values())
    return result

# Dashboard summary endpoint
@api_router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    # Calculate totals
    income_total = db.query(func.sum(DBTransaction.amount)).filter(
        DBTransaction.type == TransactionType.income
    ).scalar() or 0.0
    
    expense_total = db.query(func.sum(DBTransaction.amount)).filter(
        DBTransaction.type == TransactionType.expense
    ).scalar() or 0.0
    
    balance = income_total - expense_total
    
    # Get recent transactions
    recent_transactions = db.query(DBTransaction).order_by(
        DBTransaction.date.desc()
    ).limit(5).all()
    
    # Get monthly data
    monthly_data = get_monthly_data(db)
    
    return DashboardSummary(
        total_income=income_total,
        total_expenses=expense_total,
        balance=balance,
        recent_transactions=recent_transactions,
        monthly_data=monthly_data
    )

# Include the API router
app.include_router(api_router)