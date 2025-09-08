// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import UserList from './components/UserList'; // Will create these
import PostList from './components/PostList'; // Will create these
import UserDetail from './components/UserDetail'; // Will create this for CRUD
import PostDetail from './components/PostDetail'; // Will create this for CRUD

import './App.css'; // Basic styling for the app

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;