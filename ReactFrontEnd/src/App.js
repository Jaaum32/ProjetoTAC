import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HealthRecord from './Pages/HealthRecord';
import Geofencing from './Pages/Geofencing';
import Animal from './Pages/Animal';
import Reproduction from './Pages/Reproduction';
import Sidebar from './Components/Sidebar';
import { useState, useEffect } from 'react';
import LoginModal from './Modals/LoginModal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const checkAuthentication = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('jwtToken', token); // Salva o token
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  return (
    <BrowserRouter>
      <Sidebar
        onLogout={() => {
          localStorage.clear(); // Limpa o localStorage
          setIsAuthenticated(false); // Define isAuthenticated como false
          setShowLoginModal(true); // Reabre o modal de login
        }}
      >
        <LoginModal
          show={showLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
        <Routes>
          <Route path="/" element={isAuthenticated ? <Geofencing /> : null} />
          <Route path="/geofencing" element={isAuthenticated ? <Geofencing /> : null} />
          <Route path="/animal" element={isAuthenticated ? <Animal /> : null} />
          <Route path="/healthrecord" element={isAuthenticated ? <HealthRecord /> : null} />
          <Route path="/reproduction" element={isAuthenticated ? <Reproduction /> : null} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;