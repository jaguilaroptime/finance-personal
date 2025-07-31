import React from 'react';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TransactionList = ({ transactions, categories }) => {
  const getCategoryColor = (transaction) => {
    // If transaction has category object, use its color
    if (transaction.category && transaction.category.color) {
      return transaction.category.color;
    }
    // Otherwise try to find category by name (fallback)
    const category = categories.find(cat => cat.name === transaction.category);
    return category ? category.color : '#E5E7EB';
  };

  const getCategoryName = (transaction) => {
    // If transaction has category object, use its name
    if (transaction.category && transaction.category.name) {
      return transaction.category.name;
    }
    // Otherwise use the category field directly (fallback)
    return transaction.category || 'Unknown';
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
      {transactions.map(transaction => {
        const categoryName = getCategoryName(transaction);
        const categoryColor = getCategoryColor(transaction);
        
        return (
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
                    {transaction.description || categoryName}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: categoryColor + '40',
                      color: categoryColor,
                      border: `1px solid ${categoryColor}60`
                    }}
                  >
                    {categoryName}
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
        );
      })}
    </div>
  );
};

export default TransactionList;