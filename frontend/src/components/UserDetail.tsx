// frontend/src/components/UserDetail.tsx (updated for Phase 2)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { User, Post, UpdateUserDto, CreateUserDto } from '../types';
import axios from 'axios';

const API_BASE_URL = 'https://davinctask.onrender.com/';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedUser, setEditedUser] = useState<UpdateUserDto | CreateUserDto | null>(null);

  const isNewUser = id === 'new';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      if (isNewUser) {
        // Initialize for new user creation
        setUser(null);
        setEditedUser({
          name: '', username: '', email: '', phone: '', website: '',
          address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
          company: { name: '', catchPhrase: '', bs: '' }
        });
        setUserPosts([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch User
        const userResponse = await axios.get<User>(`${API_BASE_URL}/users/${id}`);
        const userData = userResponse.data;
        setUser(userData);
        setEditedUser(userData);

        // Fetch Posts by this User
        const postsResponse = await axios.get<Post[]>(`${API_BASE_URL}/posts?userId=${id}`);
        setUserPosts(postsResponse.data);

      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNewUser]);

  const handleDelete = async () => {
    if (!user) return;
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${user.id}`);
        alert(`User ${user.name} deleted successfully.`);
        navigate('/users');
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : 'An unexpected error occurred');
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedUser) {
      if (name.includes('.')) { // Handle nested properties like address.street
        const [parent, child] = name.split('.');
        setEditedUser(prev => ({
          ...prev!,
          [parent]: {
            ...(prev! as any)[parent],
            [child]: value
          }
        }));
      } else {
        setEditedUser(prev => ({ ...prev!, [name]: value }));
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedUser) return;

    try {
      if (isNewUser) {
        const response = await axios.post<User>(`${API_BASE_URL}/users`, editedUser as CreateUserDto);
        alert(`User ${response.data.name} created successfully.`);
        navigate(`/users/${response.data.id}`);
      } else if (user) {
        const response = await axios.put<User>(`${API_BASE_URL}/users/${user.id}`, editedUser as UpdateUserDto);
        alert(`User ${response.data.name} updated successfully.`);
        setUser(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.message : 'An unexpected error occurred');
      alert(`Error: ${error || 'Failed to save user.'}`);
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (!isNewUser && !user) return <p>User not found.</p>;

  return (
    <div className="detail-container">
      <Link to="/users" className="back-link">Back to Users</Link>
      <h2>{isNewUser ? 'Create New User' : `User Details: ${user?.name}`}</h2>

      {(isEditing || isNewUser) ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <label>Name: <input type="text" name="name" value={editedUser?.name || ''} onChange={handleEditChange} required /></label>
          <label>Username: <input type="text" name="username" value={editedUser?.username || ''} onChange={handleEditChange} required /></label>
          <label>Email: <input type="email" name="email" value={editedUser?.email || ''} onChange={handleEditChange} required /></label>
          <label>Phone: <input type="text" name="phone" value={editedUser?.phone || ''} onChange={handleEditChange} /></label>
          <label>Website: <input type="text" name="website" value={editedUser?.website || ''} onChange={handleEditChange} /></label>
          
          <h3>Address</h3>
          <label>Street: <input type="text" name="address.street" value={editedUser?.address?.street || ''} onChange={handleEditChange} /></label>
          <label>Suite: <input type="text" name="address.suite" value={editedUser?.address?.suite || ''} onChange={handleEditChange} /></label>
          <label>City: <input type="text" name="address.city" value={editedUser?.address?.city || ''} onChange={handleEditChange} /></label>
          <label>Zipcode: <input type="text" name="address.zipcode" value={editedUser?.address?.zipcode || ''} onChange={handleEditChange} /></label>
          {/* Geo can be added similarly */}

          <h3>Company</h3>
          <label>Company Name: <input type="text" name="company.name" value={editedUser?.company?.name || ''} onChange={handleEditChange} /></label>
          <label>Catch Phrase: <input type="text" name="company.catchPhrase" value={editedUser?.company?.catchPhrase || ''} onChange={handleEditChange} /></label>
          <label>BS: <input type="text" name="company.bs" value={editedUser?.company?.bs || ''} onChange={handleEditChange} /></label>

          <button type="submit">{isNewUser ? 'Create User' : 'Save Changes'}</button>
          <button type="button" onClick={() => (isNewUser ? navigate('/users') : setIsEditing(false))}>Cancel</button>
        </form>
      ) : (
        <div className="user-details">
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Website:</strong> {user?.website}</p>
          {user?.address && (
            <>
              <h3>Address</h3>
              <p>{user.address.street}, {user.address.suite}</p>
              <p>{user.address.city}, {user.address.zipcode}</p>
            </>
          )}
          {user?.company && (
            <>
              <h3>Company</h3>
              <p><strong>Name:</strong> {user.company.name}</p>
              <p><strong>Catch Phrase:</strong> {user.company.catchPhrase}</p>
              <p><strong>BS:</strong> {user.company.bs}</p>
            </>
          )}
          <button onClick={() => setIsEditing(true)} className="edit-button">Edit User</button>
          <button onClick={handleDelete} className="delete-button">Delete User</button>
        </div>
      )}

      {!isNewUser && userPosts.length > 0 && (
        <>
          <h3>Posts by {user?.name}</h3>
          <ul className="post-list">
            {userPosts.map((post) => (
              <li key={post.id} className="post-item">
                <Link to={`/posts/${post.id}`}>
                  <h4>{post.title}</h4>
                  <p>Post ID: {post.id}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {!isNewUser && userPosts.length === 0 && <p>No posts found for this user.</p>}
    </div>
  );
};

export default UserDetail;