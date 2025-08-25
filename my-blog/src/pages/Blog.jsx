import PostList from '../components/PostList';

function Blog() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '2.5rem',
        fontWeight: 'bold'
      }}>
        Blog Posts
      </h1>
      <PostList />
    </div>
  );
}

export default Blog;