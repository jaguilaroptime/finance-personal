// Mock data for finance app
export const mockTransactions = [
  {
    id: '1',
    type: 'expense',
    amount: 45.50,
    category: 'Groceries',
    description: 'Weekly grocery shopping',
    date: '2025-01-15'
  },
  {
    id: '2',
    type: 'income',
    amount: 3200.00,
    category: 'Salary',
    description: 'Monthly salary',
    date: '2025-01-01'
  },
  {
    id: '3',
    type: 'expense',
    amount: 25.00,
    category: 'Transportation',
    description: 'Gas for car',
    date: '2025-01-14'
  },
  {
    id: '4',
    type: 'expense',
    amount: 120.00,
    category: 'Utilities',
    description: 'Electricity bill',
    date: '2025-01-10'
  },
  {
    id: '5',
    type: 'expense',
    amount: 35.75,
    category: 'Dining',
    description: 'Lunch with friends',
    date: '2025-01-12'
  },
  {
    id: '6',
    type: 'income',
    amount: 500.00,
    category: 'Freelance',
    description: 'Website design project',
    date: '2025-01-08'
  },
  {
    id: '7',
    type: 'expense',
    amount: 80.00,
    category: 'Entertainment',
    description: 'Movie tickets and dinner',
    date: '2025-01-11'
  },
  {
    id: '8',
    type: 'expense',
    amount: 15.99,
    category: 'Subscriptions',
    description: 'Netflix subscription',
    date: '2025-01-05'
  }
];

export const mockCategories = [
  { id: '1', name: 'Groceries', type: 'expense', color: '#FFB8B8' },
  { id: '2', name: 'Salary', type: 'income', color: '#B8FFB8' },
  { id: '3', name: 'Transportation', type: 'expense', color: '#B8E6FF' },
  { id: '4', name: 'Utilities', type: 'expense', color: '#FFD4B8' },
  { id: '5', name: 'Dining', type: 'expense', color: '#E6B8FF' },
  { id: '6', name: 'Freelance', type: 'income', color: '#D4FFB8' },
  { id: '7', name: 'Entertainment', type: 'expense', color: '#FFB8E6' },
  { id: '8', name: 'Subscriptions', type: 'expense', color: '#B8FFFF' }
];

// Mock monthly data for charts
export const mockMonthlyData = [
  { month: 'Dec 2024', income: 3200, expenses: 2100 },
  { month: 'Jan 2025', income: 3700, expenses: 2350 }
];