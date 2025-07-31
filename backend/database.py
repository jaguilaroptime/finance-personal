from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
import os
from pathlib import Path
from dotenv import load_dotenv
import enum

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL')
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class TransactionType(str, enum.Enum):
    income = "income"
    expense = "expense"

# Database Models
class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    color = Column(String(7), nullable=False)  # Hex color code
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationship
    transactions = relationship("Transaction", back_populates="category")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    description = Column(String(500), nullable=True)
    date = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationship
    category = relationship("Category", back_populates="transactions")

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)