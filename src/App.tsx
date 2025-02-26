import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Users from './pages/Users';
import Products from './pages/Products';

const App: React.FC = () => {
  return (
    <Router basename="/frontend-assessment">
      <div className="min-h-screen bg-custom-grey">
        <nav className="bg-custom-black p-4">
          <div className="container mx-auto flex gap-5">
            <Link to="/" className="text-white hover:text-custom-yellow">Home</Link>
            <Link to="/users" className="text-white hover:text-custom-yellow">Users</Link>
            <Link to="/products" className="text-white hover:text-custom-yellow">Products</Link>
          </div>
        </nav>
        
        <div className="container mx-auto mt-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <h1 className="text-4xl font-neutra mb-8 text-custom-black">Data Management Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Link 
          to="/users" 
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-neutra mb-4 text-custom-black">Users Management</h2>
          <p className="text-gray-600">View and manage user data, including personal information and profiles</p>
        </Link>
        <Link 
          to="/products" 
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-neutra mb-4 text-custom-black">Products Management</h2>
          <p className="text-gray-600">Browse and manage product inventory, categories, and details</p>
        </Link>
      </div>
    </div>
  );
};

export default App; 