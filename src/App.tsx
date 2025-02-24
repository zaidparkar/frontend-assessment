import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Users from './pages/Users';
import Products from './pages/Products';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-custom-grey">
        <nav className="bg-custom-black p-4">
          <div className="container mx-auto flex gap-4">
            <Link to="/users" className="text-white hover:text-custom-yellow">Users</Link>
            <Link to="/products" className="text-white hover:text-custom-yellow">Products</Link>
          </div>
        </nav>
        
        <div className="container mx-auto mt-8">
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App; 