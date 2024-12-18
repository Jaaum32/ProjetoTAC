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

  // Função para verificar a validade do token
  const isValidToken = (token) => {
    return token && token !== ''; // Verifica se o token não é nulo ou vazio
  };

  // Verifica o token ao carregar a aplicação e ao alterar o localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (isValidToken(token)) {
      setIsAuthenticated(true); // Atualiza o estado para autenticado
      setShowLoginModal(false);  // Fecha o modal de login se o token for válido
    } else {
      setIsAuthenticated(false);
      setShowLoginModal(true);   // Exibe o modal de login se o token não for válido
    }
  }, []); // O useEffect roda apenas uma vez ao carregar o componente

  // Efeito adicional para garantir que ao realizar login ou logout, a página seja atualizada
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (isValidToken(token)) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
    } else {
      setIsAuthenticated(false);
      setShowLoginModal(true);
    }
  }, [localStorage.getItem('jwtToken')]); // Monitorar mudanças no localStorage

  const handleLoginSuccess = (token) => {
    if (isValidToken(token)) {
      localStorage.setItem('jwtToken', token); // Salva o token no localStorage
      setIsAuthenticated(true);                 // Autentica o usuário
      setShowLoginModal(false);                 // Fecha o modal de login
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Limpa o token do localStorage
    setIsAuthenticated(false);           // Atualiza o estado de autenticação
    setShowLoginModal(true);             // Exibe o modal de login novamente
  };

  return (
    <BrowserRouter>
      {/* Se o usuário estiver autenticado, o Sidebar e as rotas serão exibidos */}
      <Sidebar onLogout={handleLogout}>
        {/* Exibe o modal de login apenas se o usuário não estiver autenticado */}
        {showLoginModal && (
          <LoginModal
            show={showLoginModal}
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setShowLoginModal(false)} // Passa a função onClose
          />
        )}

        {/* Carrega as rotas apenas se o usuário estiver autenticado */}
        {isAuthenticated && (
          <Routes>
            <Route path="/" element={<Geofencing />} />
            <Route path="/geofencing" element={<Geofencing />} />
            <Route path="/animal" element={<Animal />} />
            <Route path="/healthrecord" element={<HealthRecord />} />
            <Route path="/reproduction" element={<Reproduction />} />
          </Routes>
        )}
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
