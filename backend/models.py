from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

# Category Models
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: TransactionType
    color: str = Field(..., pattern=r'^#[0-9A-Fa-f]{6}$')

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Transaction Models
class TransactionBase(BaseModel):
    type: TransactionType
    amount: float = Field(..., gt=0)
    category_id: int
    description: Optional[str] = Field(None, max_length=500)
    date: datetime

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Category
    
    class Config:
        from_attributes = True

# Response Models
class MonthlyData(BaseModel):
    month: str
    income: float
    expenses: float

class DashboardSummary(BaseModel):
    total_income: float
    total_expenses: float
    balance: float
    recent_transactions: List[Transaction]
    monthly_data: List[MonthlyData]