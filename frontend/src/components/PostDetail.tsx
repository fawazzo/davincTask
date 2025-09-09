// frontend/src/components/PostDetail.tsx (updated for Phase 2)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Post, User, UpdatePostDto, CreatePostDto } from '../types';
import axios from 'axios';

const API_BASE_URL = 'https://davinctask.onrender.com';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [postAuthor, setPostAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedPost, setEditedPost] = useState<UpdatePostDto | CreatePostDto | null>(null);

  const isNewPost = id === 'new';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      if (isNewPost) {
        setPost(null);
        setEditedPost({ userId: 1, title: '', body: '' }); // Default userId or prompt for it
        setPostAuthor(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch Post
        const postResponse = await axios.get<Post>(`${API_BASE_URL}/posts/${id}`);
        const postData = postResponse.data;
        setPost(postData);
        setEditedPost(postData);

        // Fetch Post Author
        if (postData.userId) {
          try {
            const userResponse = await axios.get<User>(`${API_BASE_URL}/users/${postData.userId}`);
            setPostAuthor(userResponse.data);
          } catch (authorError) {
            console.warn(`Could not fetch author for post ${postData.id}.`, authorError);
            setPostAuthor(null);
          }
        }
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNewPost]);

  const handleDelete = async () => {
    if (!post) return;
    if (window.confirm(`Are you sure you want to delete post "${post.title}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/posts/${post.id}`);
        alert(`Post "${post.title}" deleted successfully.`);
        navigate('/posts');
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : 'An unexpected error occurred');
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedPost) {
      setEditedPost(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedPost) return;

    try {
      if (isNewPost) {
        const response = await axios.post<Post>(`${API_BASE_URL}/posts`, editedPost as CreatePostDto);
        alert(`Post "${response.data.title}" created successfully.`);
        navigate(`/posts/${response.data.id}`);
      } else if (post) {
        const response = await axios.put<Post>(`${API_BASE_URL}/posts/${post.id}`, editedPost as UpdatePostDto);
        alert(`Post "${response.data.title}" updated successfully.`);
        setPost(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.message : 'An unexpected error occurred');
      alert(`Error: ${error || 'Failed to save post.'}`);
    }
  };

  if (loading) return <p>Loading post details...</p>;
  if (!isNewPost && !post) return <p>Post not found.</p>;

  return (
    <div className="detail-container">
      <Link to="/posts" className="back-link">Back to Posts</Link>
      <h2>{isNewPost ? 'Create New Post' : `Post Details: ${post?.title}`}</h2>

      {(isEditing || isNewPost) ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <label>User ID: <input type="number" name="userId" value={editedPost?.userId || ''} onChange={handleEditChange} required /></label>
          <label>Title: <input type="text" name="title" value={editedPost?.title || ''} onChange={handleEditChange} required /></label>
          <label>Body: <textarea name="body" value={editedPost?.body || ''} onChange={handleEditChange} rows={5} required /></label>
          <button type="submit">{isNewPost ? 'Create Post' : 'Save Changes'}</button>
          <button type="button" onClick={() => (isNewPost ? navigate('/posts') : setIsEditing(false))}>Cancel</button>
        </form>
      ) : (
        <div className="post-details">
          <p><strong>ID:</strong> {post?.id}</p>
          <p><strong>Title:</strong> {post?.title}</p>
          <p><strong>Body:</strong> {post?.body}</p>
          {postAuthor && (
            <p>
              <strong>Author:</strong> <Link to={`/users/${postAuthor.id}`}>{postAuthor.name}</Link> (ID: {post?.userId})
            </p>
          )}
          {!postAuthor && <p><strong>User ID:</strong> {post?.userId} (Author not found or not loaded)</p>}
          <button onClick={() => setIsEditing(true)} className="edit-button">Edit Post</button>
          <button onClick={handleDelete} className="delete-button">Delete Post</button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;