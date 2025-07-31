import React from 'react';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TransactionList = ({ transactions, categories }) => {
  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#E5E7EB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No transactions yet. Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
              {transaction.type === 'income' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-800">
                  {transaction.description || transaction.category}
                </h4>
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: getCategoryColor(transaction.category) + '40',
                    color: getCategoryColor(transaction.category),
                    border: `1px solid ${getCategoryColor(transaction.category)}60`
                  }}
                >
                  {transaction.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>
          
          <div className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;