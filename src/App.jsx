import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { useState } from 'react';

import wildfire from './assets/wildfire.avif';
import WeatherAlerts from './components/WeatherAlerts';
import NearestHospital from './components/NearestHospital';
import EscapeRouteMap from './components/EscapeRouteMap';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Modal from './components/Modal'; // 🆕 Import the modal

import FirstAid from './pages/FirstAid';
import Emergency from './pages/Emergency';
import CalamityTypes from './pages/CalamityTypes';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <nav className="topbar">
          <div className="left-section">
            <Link to="/" className="logo-text">RescuePath</Link>
            <div className="nav-links">
              <Link to="/calamity-types" className="nav-link">Calamity Type</Link>
              <Link to="/emergency" className="nav-link">Emergency Contacts</Link>
              <Link to="/first-aid" className="nav-link">First Aid</Link>
              <Link to="/about" className="nav-link">About Us</Link>
            </div>
          </div>
          <div className="auth-buttons">
            <button>Login</button>
            <button>Register</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/calamity-types" element={<CalamityTypes />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

function HomeContent() {
  const navigate = useNavigate();
  const [disaster, setDisaster] = useState('');
  const [location, setLocation] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🆕

  const handleTagClick = (path, section) => {
    if (path === '/first-aid' && section) {
      navigate(path, { state: { scrollTo: section } });
    } else if (section === 'hospitals') {
      const element = document.getElementById('hospital-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const handleSubmit = async () => {
    if (!location || !disaster) {
      alert("Please enter both location and disaster type.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/get-escape-route?location=${location}&calamity=${disaster}`);
      if (!res.ok) throw new Error("Failed to fetch route");

      const data = await res.json();
      setRouteData(data);  // Save route data
      setShowModal(true);  // Show modal 🆕
    } catch (error) {
      console.error("Error fetching route:", error);
      alert("Could not fetch escape route. Try again later.");
    }
  };

  return (
    <>
      <div className="search-container" style={{ backgroundImage: `url(${wildfire})` }}>
        <h1 className="search-heading">Find Emergency Resources</h1>
        <div className="search-wrapper">
          <select
            value={disaster}
            onChange={(e) => setDisaster(e.target.value)}
            className="disaster-dropdown"
          >
            <option value="">Select Disaster Type</option>
            <option value="earthquake">Earthquake</option>
            <option value="floods">Floods</option>
            <option value="tsunami">Tsunami</option>
            <option value="wildfire">Wildfire</option>
          </select>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location..."
            className="location-search"
          />
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>

        <div className="popular-searches">
          <span className="search-tag" onClick={() => handleTagClick('/first-aid')}>First Aid</span>
          <span className="search-tag" onClick={() => handleTagClick('/emergency')}>Emergency Numbers</span>
          <span className="search-tag" onClick={() => handleTagClick('/calamity-types')}>Flood Safety</span>
          <span className="search-tag" onClick={() => handleTagClick('/calamity-types')}>Earthquake Protocol</span>
          <span className="search-tag" onClick={() => handleTagClick(null, 'hospitals')}>Medical Centers</span>
        </div>
      </div>

      {/* 🔲 Modal for Escape Route */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {routeData && <EscapeRouteMap routeData={routeData} />}
      </Modal>

      <WeatherAlerts />
      <div id="hospital-section">
        <NearestHospital />
      </div>
    </>
  );
}

export default App;
