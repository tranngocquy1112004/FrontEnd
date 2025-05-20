import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
function App() {
  return (
    <Router>
      <div className="App">
        {/* Header chứa điều hướng */}
        <header>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              {/* <li><Link to="/portfolio">Portfolio</Link></li> */}
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
        </header>

        {/* Main - Render nội dung dựa trên route */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />  
            <Route path="/about" element={<About />} />
            {/* <Route path="/portfolio" element={<Portfolio />} /> */}
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer>
          <p>© 2025 - Portfolio của bạn.</p>
        </footer>
      </div>
    </Router>

  );
}

export default App;
