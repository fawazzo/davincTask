// frontend/src/components/Homepage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // We'll install react-router-dom later

const Homepage: React.FC = () => {
  return (
    <div className="homepage">
      <h1>Welcome to the Web Dev Assignment!</h1>
      <p>Please select an option:</p>
      <nav>
        <ul>
          <li>
            <Link to="/users">View Users</Link>
          </li>
          <li>
            <Link to="/posts">View Posts</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Homepage;