import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to My Blog</h1>
      <p>Check out the <Link to="/blog">latest posts</Link>.</p>
    </div>
  );
}

export default Home;