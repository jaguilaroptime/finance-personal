import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PieChart } from 'lucide-react';

const CategoryChart = ({ transactions, categories }) => {
  // Calculate category totals for expenses only
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const categoryTotals = {};
  
  expenseTransactions.forEach(transaction => {
    if (categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] += transaction.amount;
    } else {
      categoryTotals[transaction.category] = transaction.amount;
    }
  });

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  const categoryData = Object.entries(categoryTotals)
    .map(([categoryName, amount]) => {
      const category = categories.find(cat => cat.name === categoryName);
      return {
        name: categoryName,
        amount,
        percentage: ((amount / totalExpenses) * 100).toFixed(1),
        color: category ? category.color : '#E5E7EB'
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <PieChart className="h-5 w-5 text-purple-600" />
          Expense Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length > 0 ? (
          <div className="space-y-4">
            {/* Donut Chart Simulation */}
            <div className="relative w-48 h-48 mx-auto">
              <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                {categoryData.map((category, index) => {
                  const angle = (category.amount / totalExpenses) * 360;
                  const rotation = categoryData
                    .slice(0, index)
                    .reduce((sum, cat) => sum + (cat.amount / totalExpenses) * 360, 0);
                  
                  return (
                    <div
                      key={category.name}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(from ${rotation}deg, ${category.color} 0deg, ${category.color} ${angle}deg, transparent ${angle}deg)`,
                        transform: `rotate(${rotation}deg)`
                      }}
                    />
                  );
                })}
                
                {/* Center hole */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">${totalExpenses.toFixed(0)}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {categoryData.map(category => (
                <div key={category.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">
                      ${category.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No expense data available yet.</p>
            <p className="text-sm">Add some expenses to see the breakdown.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;