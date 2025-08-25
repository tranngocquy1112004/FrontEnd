import { Link } from 'react-router-dom';

function PostItem({ post }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease-in-out',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
    >
      <h2 style={{
        margin: '0 0 10px 0',
        color: '#333',
        fontSize: '1.5rem'
      }}>
        {post.title}
      </h2>
      <p style={{
        color: '#666',
        lineHeight: '1.6',
        marginBottom: '15px'
      }}>
        {post.body.substring(0, 150)}...
      </p>
      <Link 
        to={`/blog/${post.id}`}
        style={{
          color: '#007bff',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '14px'
        }}
        onMouseEnter={(e) => {
          e.target.style.textDecoration = 'underline';
        }}
        onMouseLeave={(e) => {
          e.target.style.textDecoration = 'none';
        }}
      >
        Read More →
      </Link>
    </div>
  );
}

export default PostItem;