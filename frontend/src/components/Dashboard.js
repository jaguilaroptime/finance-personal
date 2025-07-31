import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockTransactions, mockCategories, mockMonthlyData } from '../mock';
import TransactionList from './TransactionList';
import MonthlyChart from './MonthlyChart';
import CategoryChart from './CategoryChart';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Load mock data (will be replaced with API calls later)
    setTransactions(mockTransactions);
    setCategories(mockCategories);
    setMonthlyData(mockMonthlyData);
  }, []);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  // Recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-100 to-green-200 border-green-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              ${totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-100 to-red-200 border-red-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-r ${balance >= 0 ? 'from-blue-100 to-blue-200 border-blue-300' : 'from-orange-100 to-orange-200 border-orange-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              Balance
            </CardTitle>
            <DollarSign className={`h-4 w-4 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              ${balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Link to="/add">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </Link>
        <Link to="/categories">
          <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
            Manage Categories
          </Button>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart data={monthlyData} />
        <CategoryChart transactions={transactions} categories={categories} />
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={recentTransactions} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;