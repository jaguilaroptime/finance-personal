import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3 } from 'lucide-react';

const MonthlyChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expenses)));

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Monthly Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((month, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{month.month}</span>
                <span>Income: ${month.income} | Expenses: ${month.expenses}</span>
              </div>
              
              {/* Income Bar */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 w-16">Income</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(month.income / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-green-600 font-medium w-16">
                    ${month.income}
                  </span>
                </div>
                
                {/* Expenses Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 w-16">Expenses</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(month.expenses / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-red-600 font-medium w-16">
                    ${month.expenses}
                  </span>
                </div>
              </div>
              
              {/* Net Balance */}
              <div className="text-right">
                <span className={`text-xs font-medium ${month.income - month.expenses >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  Net: {month.income - month.expenses >= 0 ? '+' : ''}${(month.income - month.expenses).toFixed(2)}
                </span>
              </div>
              
              {index < data.length - 1 && <hr className="border-gray-200" />}
            </div>
          ))}
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No monthly data available yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyChart;