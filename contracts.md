# API Contracts for Personal Finance Tracker

## Database Switch
- **Change**: Replace MongoDB with MySQL database
- **Reason**: User specifically requested MySQL for persistent storage

## Mock Data to Replace
The following mock data in `/app/frontend/src/mock.js` will be replaced with database data:
- `mockTransactions` - 8 sample transactions
- `mockCategories` - 8 sample categories  
- `mockMonthlyData` - 2 months of aggregated data

## API Endpoints to Implement

### Categories API
```
GET /api/categories - Get all categories
POST /api/categories - Create new category
PUT /api/categories/{id} - Update category
DELETE /api/categories/{id} - Delete category
```

### Transactions API  
```
GET /api/transactions - Get all transactions (with optional filters)
POST /api/transactions - Create new transaction
PUT /api/transactions/{id} - Update transaction
DELETE /api/transactions/{id} - Delete transaction
GET /api/transactions/monthly - Get monthly aggregated data
```

## Database Schema

### Categories Table
```sql
- id (Primary Key, Auto Increment)
- name (VARCHAR, Unique)
- type (ENUM: 'income', 'expense') 
- color (VARCHAR - hex color code)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Transactions Table
```sql
- id (Primary Key, Auto Increment)
- type (ENUM: 'income', 'expense')
- amount (DECIMAL(10,2))
- category_id (Foreign Key -> categories.id)
- description (TEXT, Optional)
- date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Frontend Integration Changes

### Files to Update:
1. **Dashboard.js** - Replace mock data loading with API calls
2. **AddTransaction.js** - Replace form submission with API call, load categories from API
3. **Categories.js** - Replace CRUD operations with API calls
4. **Remove mock.js** - Delete mock data file after integration

### API Integration Points:
- Load transactions: `GET /api/transactions`
- Load categories: `GET /api/categories` 
- Load monthly data: `GET /api/transactions/monthly`
- Create transaction: `POST /api/transactions`
- Create category: `POST /api/categories`
- Update category: `PUT /api/categories/{id}`
- Delete category: `DELETE /api/categories/{id}`

## Implementation Steps:
1. Install MySQL connector and dependencies
2. Create database models with SQLAlchemy
3. Implement CRUD API endpoints
4. Replace frontend mock calls with axios API calls
5. Test full integration
6. Handle error cases and loading states