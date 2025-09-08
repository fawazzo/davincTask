// frontend/src/components/PostList.tsx (updated for Phase 2)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Your NestJS backend URL

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>(`${API_BASE_URL}/posts`);
        setPosts(response.data);
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="post-list-container">
      <h2>Posts</h2>
      <Link to="/" className="back-link">Back to Home</Link>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <Link to={`/posts/${post.id}`}>
              <h3>{post.title}</h3>
              <p>Post ID: {post.id}</p>
              <p>User ID: {post.userId}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/posts/new" className="add-button">Add New Post</Link>
    </div>
  );
};

export default PostList;