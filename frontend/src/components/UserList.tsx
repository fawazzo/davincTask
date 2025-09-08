// frontend/src/components/UserList.tsx (updated for Phase 2)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';
import axios from 'axios'; // npm install axios in frontend

const API_BASE_URL = 'http://localhost:3000'; // Your NestJS backend URL

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
        setUsers(response.data);
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="user-list-container">
      <h2>Users</h2>
      <Link to="/" className="back-link">Back to Home</Link>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <Link to={`/users/${user.id}`}>
              <h3>{user.name}</h3>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>ID: {user.id}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/users/new" className="add-button">Add New User</Link>
    </div>
  );
};

export default UserList;