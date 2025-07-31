import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCategories } from '../mock';
import { useToast } from '../hooks/use-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense',
    color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  });
  const [editingId, setEditingId] = useState(null);
  const [editingCategory, setEditingCategory] = useState({});
  
  const { toast } = useToast();

  useEffect(() => {
    // Load mock categories (will be replaced with API call later)
    setCategories(mockCategories);
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name.",
        variant: "destructive"
      });
      return;
    }

    // Check if category name already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      toast({
        title: "Error",
        description: "A category with this name already exists.",
        variant: "destructive"
      });
      return;
    }

    const category = {
      id: Date.now().toString(),
      ...newCategory,
      name: newCategory.name.trim()
    };

    setCategories(prev => [...prev, category]);
    setNewCategory({
      name: '',
      type: 'expense',
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    });

    toast({
      title: "Category Added",
      description: `"${category.name}" has been added successfully.`,
    });
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    
    toast({
      title: "Category Deleted",
      description: `"${category.name}" has been removed.`,
    });
  };

  const handleEditCategory = (category) => {
    setEditingId(category.id);
    setEditingCategory({ ...category });
  };

  const handleSaveEdit = () => {
    if (!editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name.",
        variant: "destructive"
      });
      return;
    }

    setCategories(prev => prev.map(cat => 
      cat.id === editingId ? { ...editingCategory, name: editingCategory.name.trim() } : cat
    ));
    
    setEditingId(null);
    setEditingCategory({});
    
    toast({
      title: "Category Updated",
      description: "Category has been updated successfully.",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingCategory({});
  };

  const generateRandomColor = () => {
    const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setNewCategory(prev => ({ ...prev, color }));
  };

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Category */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  placeholder="e.g., Coffee, Rent, Salary"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <Label>Type</Label>
                <RadioGroup
                  value={newCategory.type}
                  onValueChange={(value) => setNewCategory(prev => ({ ...prev, type: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="new-expense" />
                    <Label htmlFor="new-expense" className="text-red-600">Expense</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="new-income" />
                    <Label htmlFor="new-income" className="text-green-600">Income</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: newCategory.color }}
                  />
                  <Input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    className="w-16 h-8 p-1 border rounded"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateRandomColor}
                    className="text-xs"
                  >
                    Random
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Income Categories */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-green-700">Income Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {incomeCategories.length > 0 ? (
                incomeCategories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                    {editingId === category.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: editingCategory.color }}
                        />
                        <Input
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
                          className="flex-1 h-8"
                        />
                        <div className="flex gap-1">
                          <Button size="sm" onClick={handleSaveEdit} className="h-8 px-2 bg-green-500">
                            ✓
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 px-2">
                            ✕
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium text-gray-800">{category.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCategory(category)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No income categories yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-red-700">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {expenseCategories.length > 0 ? (
                expenseCategories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                    {editingId === category.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: editingCategory.color }}
                        />
                        <Input
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
                          className="flex-1 h-8"
                        />
                        <div className="flex gap-1">
                          <Button size="sm" onClick={handleSaveEdit} className="h-8 px-2 bg-green-500">
                            ✓
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 px-2">
                            ✕
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium text-gray-800">{category.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCategory(category)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No expense categories yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Categories;