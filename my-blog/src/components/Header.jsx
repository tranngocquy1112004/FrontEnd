import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/blog">Blog</Link> | 
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}

export default Header;