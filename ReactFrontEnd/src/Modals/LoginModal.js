import React, { useState, useEffect } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import LoginService from '../Services/LoginService'; // Importando o serviço de login

function LoginModal({ show, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  // Função para verificar se o token é válido
  const isValidToken = (token) => {
    return token && token !== ''; // Verifica se o token não é nulo ou vazio
  };

  // Verifica o token no localStorage assim que o modal é aberto
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (isValidToken(token)) {
      onClose(); // Fecha o modal se o token for válido
    }
  }, [show, onClose]); // O useEffect depende do show para rodar quando o modal for exibido

  // Função para enviar o login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await LoginService.post(username, password); // Chama o serviço de login passando as credenciais
      const token = response.data["jwt-token"]; // Obtém o token da resposta da API
      localStorage.setItem('jwtToken', token); // Armazena o token no localStorage

      onLoginSuccess(); // Chama a função de sucesso no login
      onClose(); // Fecha o modal após o login
    } catch (error) {
      setErro('Email ou senha incorretos!'); // Exibe erro se as credenciais forem inválidas
    }
  };

  if (!show) return null; // Se o modal não estiver visível, não renderiza nada

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Login</h2>
        {erro && <div style={{ color: 'red' }}>{erro}</div>} {/* Exibe a mensagem de erro */}

        <form className="modal-form" onSubmit={handleLogin}>
          <div>
            <label>Nome de usuário:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className='btn-submit' type="submit">Entrar</button>
        </form>
        
      </div>
    </div>
  );
}

export default LoginModal;
