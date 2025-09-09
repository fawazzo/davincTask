// frontend/src/components/PostDetail.tsx (updated for Phase 2)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Post, User, UpdatePostDto, CreatePostDto } from '../types'; // Ensure UpdatePostDto and CreatePostDto are correct
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

  // Initialize editedPost with correct type for new/existing
  const [editedPost, setEditedPost] = useState<UpdatePostDto | CreatePostDto | null>(null);

  const isNewPost = id === 'new';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      if (isNewPost) {
        setPost(null);
        // Initialize for new post creation. userId should be a valid number.
        // It's crucial that this initial object matches CreatePostDto's requirements.
        setEditedPost({ userId: 1, title: '', body: '' }); // Provide a default userId, e.g., 1
        setPostAuthor(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch Post
        const postResponse = await axios.get<Post>(`${API_BASE_URL}/posts/${id}`);
        const postData = postResponse.data;
        setPost(postData);
        // When setting editedPost for an existing post, ensure it's a full Post object
        // which includes the 'id' field. The frontend's UpdatePostDto type should
        // also include 'id?: number;'.
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
        setError(errorMessage);
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
        setError(errorMessage);
        alert(`Error deleting post: ${errorMessage}`);
        console.error("Error deleting post:", err);
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedPost) {
      // Special handling for number inputs to convert value to number
      // This is important because HTML input values are always strings.
      const parsedValue = name === 'userId' ? parseInt(value, 10) : value;

      setEditedPost(prev => ({
        ...prev!,
        [name]: (name === 'userId' && isNaN(parsedValue)) ? undefined : parsedValue // Set to undefined if NaN for optional number fields
      }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedPost) return;

    // Log the payload being sent for debugging
    console.log('Sending Post Payload:', JSON.stringify(editedPost, null, 2));

    try {
      if (isNewPost) {
        const response = await axios.post<Post>(`${API_BASE_URL}/posts`, editedPost as CreatePostDto);
        alert(`Post "${response.data.title}" created successfully.`);
        navigate(`/posts/${response.data.id}`);
      } else if (post) {
        // Ensure that the 'id' is NOT sent in the body of the PUT request
        // if your backend UpdatePostDto does NOT declare it.
        // It's common practice to only send the ID in the URL for PUT.
        // If your backend's UpdatePostDto *does* declare `id?: number;` (which we recommended),
        // then sending it from editedPost is fine. But let's be explicit here.

        const payload: UpdatePostDto = { ...editedPost as UpdatePostDto }; // Create a copy
        // Optional: Remove ID from payload if backend UpdatePostDto doesn't declare it.
        // If your backend UpdatePostDto *does* declare `id?: number;`, then you can skip this.
        // If (`id` in payload) {
        //   delete payload.id;
        // }

        const response = await axios.put<Post>(`${API_BASE_URL}/posts/${post.id}`, payload);
        alert(`Post "${response.data.title}" updated successfully.`);
        setPost(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
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
  if (!isNewPost && !post) return <p>Post not found.</p>;

  // Determine required status based on whether it's new post creation or update
  // For updates, 'required' might be too strict if backend allows empty strings
  const isRequiredForNew = isNewPost; // If new, make all required
  const isRequiredForUpdate = true; // Still required, but empty string might be allowed by DTO

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
              value={editedPost?.userId ?? ''} // Use nullish coalescing for display
              onChange={handleEditChange}
              required={isRequiredForNew || isRequiredForUpdate} // Still required for post validity
            />
          </label>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={editedPost?.title || ''}
              onChange={handleEditChange}
              required={isRequiredForNew || isRequiredForUpdate} // Still required for post validity
            />
          </label>
          <label>
            Body:
            <textarea
              name="body"
              value={editedPost?.body || ''}
              onChange={handleEditChange}
              rows={5}
              required={isRequiredForNew || isRequiredForUpdate} // Still required for post validity
            />
          </label>
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