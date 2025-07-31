import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddTransaction from "./components/AddTransaction";
import Categories from "./components/Categories";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <BrowserRouter>
        <div className="container mx-auto px-4 py-6">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
              Personal Finance Tracker
            </h1>
            <p className="text-gray-600 text-center">
              Track your income and expenses with ease
            </p>
          </header>
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;