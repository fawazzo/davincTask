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
  const [error, setError] = useState<string | null>(null); // This 'error' state is now used
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Initialize editedPost with correct type for new/existing
  // We'll keep it as CreatePostDto | UpdatePostDto | null.
  // Note: Your UpdatePostDto should likely have `id?: number;` to allow editing an existing post
  // without TypeScript complaining about missing 'id' when you initialize with a full 'Post' object.
  const [editedPost, setEditedPost] = useState<UpdatePostDto | CreatePostDto | null>(null);

  const isNewPost = id === 'new';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      if (isNewPost) {
        setPost(null);
        // Initialize for new post creation. userId should be a valid number.
        // It's crucial that this initial object matches CreatePostDto's requirements.
        setEditedPost({ userId: 1, title: '', body: '' }); // Provide a default userId, e.g., 1
        setPostAuthor(null);
        setLoading(false);
        setIsEditing(true); // Automatically go into edit mode for new posts
        return;
      }

      try {
        // Fetch Post
        const postResponse = await axios.get<Post>(`${API_BASE_URL}/posts/${id}`);
        const postData = postResponse.data;
        setPost(postData);
        // When setting editedPost for an existing post, ensure it's a full Post object.
        // If your UpdatePostDto doesn't explicitly allow 'id', you might need to
        // omit it here: `{ title: postData.title, body: postData.body, userId: postData.userId }`
        // However, for frontend convenience, including 'id' is often fine if DTO allows it.
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
        const errorMessage = axios.isAxiosError(err) ? err.message : 'An unexpected error occurred';
        setError(errorMessage); // Set error state
        console.error("Error fetching post or author:", err);
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
        const errorMessage = axios.isAxiosError(err) ? err.message : 'An unexpected error occurred';
        setError(errorMessage); // Set error state
        alert(`Error deleting post: ${errorMessage}`);
        console.error("Error deleting post:", err);
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedPost) {
      setEditedPost(prev => {
        // Create a new object to avoid direct mutation
        // Cast to a flexible type to allow dynamic property assignment
        const newEditedPost = { ...prev! } as { [key: string]: any };

        if (name === 'userId') {
          const parsedValue = parseInt(value, 10);
          // Assign only if it's a valid number. Otherwise, assign undefined for optional fields.
          // This ensures `userId` property remains a number or undefined/null for the DTO.
          newEditedPost.userId = isNaN(parsedValue) ? undefined : parsedValue;
        } else if (name === 'title' || name === 'body') {
          // These are string properties, directly assign value
          newEditedPost[name] = value;
        }
        // If you have other specific typed fields, add `else if` conditions here.

        // Cast back to the expected DTO type. This is safe because we've handled types explicitly.
        return newEditedPost as UpdatePostDto | CreatePostDto;
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedPost) return;

    // Log the payload being sent for debugging
    console.log('Sending Post Payload:', JSON.stringify(editedPost, null, 2));

    try {
      if (isNewPost) {
        // Ensure userId is present for CreatePostDto
        if (!editedPost.userId || !editedPost.title || !editedPost.body) {
          setError('User ID, Title, and Body are required to create a new post.');
          return;
        }
        const response = await axios.post<Post>(`${API_BASE_URL}/posts`, editedPost as CreatePostDto);
        alert(`Post "${response.data.title}" created successfully.`);
        navigate(`/posts/${response.data.id}`);
      } else if (post) {
        // For existing posts, ensure the payload matches UpdatePostDto.
        // It's good practice to explicitly define what goes into the payload.
        const payload: UpdatePostDto = {
          title: editedPost.title,
          body: editedPost.body,
          userId: editedPost.userId // Ensure userId is a number
          // If UpdatePostDto can have 'id', include it: id: post.id,
        };

        const response = await axios.put<Post>(`${API_BASE_URL}/posts/${post.id}`, payload);
        alert(`Post "${response.data.title}" updated successfully.`);
        setPost(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.message : 'An unexpected error occurred';
      setError(errorMessage); // Set error state
      // More robust error display for validation errors from backend
      if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
        console.error('Backend validation errors:', err.response.data.message);
        alert(`Error: ${JSON.stringify(err.response.data.message, null, 2)}`);
      } else {
        alert(`Error: ${errorMessage || 'Failed to save post.'}`);
      }
      console.error('Error saving post:', err);
    }
  };

  if (loading) return <p>Loading post details...</p>;
  if (error) return <p className="error-message">Error: {error}</p>; // Display the error here
  if (!isNewPost && !post) return <p>Post not found.</p>;


  return (
    <div className="detail-container">
      <Link to="/posts" className="back-link">Back to Posts</Link>
      <h2>{isNewPost ? 'Create New Post' : `Post Details: ${post?.title}`}</h2>

      {(isEditing || isNewPost) ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <label>
            User ID:
            <input
              type="number"
              name="userId"
              // Use nullish coalescing to display empty string for null/undefined
              value={editedPost?.userId ?? ''}
              onChange={handleEditChange}
              required // User ID is generally required for a valid post
            />
          </label>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={editedPost?.title || ''}
              onChange={handleEditChange}
              required // Title is required
            />
          </label>
          <label>
            Body:
            <textarea
              name="body"
              value={editedPost?.body || ''}
              onChange={handleEditChange}
              rows={5}
              required // Body is required
            />
          </label>
          <button type="submit">{isNewPost ? 'Create Post' : 'Save Changes'}</button>
          <button
            type="button"
            onClick={() => (isNewPost ? navigate('/posts') : setIsEditing(false))}
            className="cancel-button" // Added class for consistency
          >
            Cancel
          </button>
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