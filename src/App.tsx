import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { StarterGuide } from './pages/StarterGuide';
import { Services } from './pages/Services';
import { BookHousing } from './pages/BookHousing';
import { BookTranslator } from './pages/BookTranslator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<StarterGuide />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book-housing" element={<BookHousing />} />
            <Route path="/book-translator" element={<BookTranslator />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
