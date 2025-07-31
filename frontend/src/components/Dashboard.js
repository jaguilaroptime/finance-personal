import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TransactionList from './TransactionList';
import MonthlyChart from './MonthlyChart';
import CategoryChart from './CategoryChart';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    balance: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard summary data
      const dashboardResponse = await axios.get(`${API}/dashboard`);
      const dashboardData = dashboardResponse.data;
      
      setSummary({
        total_income: dashboardData.total_income,
        total_expenses: dashboardData.total_expenses,
        balance: dashboardData.balance
      });
      
      setTransactions(dashboardData.recent_transactions);
      setMonthlyData(dashboardData.monthly_data);
      
      // Load categories for chart
      const categoriesResponse = await axios.get(`${API}/categories`);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
              ${summary.total_income.toFixed(2)}
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
              ${summary.total_expenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-r ${summary.balance >= 0 ? 'from-blue-100 to-blue-200 border-blue-300' : 'from-orange-100 to-orange-200 border-orange-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${summary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              Balance
            </CardTitle>
            <DollarSign className={`h-4 w-4 ${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              ${summary.balance.toFixed(2)}
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
          <TransactionList transactions={transactions} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;