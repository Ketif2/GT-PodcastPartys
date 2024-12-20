import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './loginPage.css';

const LoginPage = ({ onAuthenticate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://gt-podcastparty-so1e.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Error de autenticación');
      }

      const { accessToken, refreshToken } = await response.json();
      onAuthenticate(accessToken, refreshToken);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className='login__main'>
    <div className='login__component'>
      <form onSubmit={handleSubmit} className='login__form'>
        <label htmlFor="email" className='login__form-label'>Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
          className='login__form-input'
        />
      <label htmlFor="paswword" className='login__form-label'>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          className='login__form-input'
        />
        <button type="submit" className="login__form-button">Iniciar Sesión</button>
        <Link to="/register" className="login__form-register">¿Aún no te registraste?</Link>
      </form>
      {error && <p>{error}</p>}
    </div>
    </main>
  );
};

export default LoginPage;
