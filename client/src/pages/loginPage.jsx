import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useSanitizeValidate from '../hooks/useSanitizeValidate';
import './loginPage.css';

const LoginPage = ({ onAuthenticate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const {
    validateEmail,
    validatePassword,
    handleSanitizedChange,
    validateForm,
    errors,
    clearErrors
  } = useSanitizeValidate();

  const handleEmailChange = (e) => {
    const sanitizedEmail = handleSanitizedChange(e.target.value, 'email', validateEmail);
    setEmail(sanitizedEmail);
  };

  const handlePasswordChange = (e) => {
    const sanitizedPassword = handleSanitizedChange(e.target.value, 'password');
    setPassword(sanitizedPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearErrors();

    const validation = validateForm(
      { email, password },
      {
        email: validateEmail,
        password: validatePassword
      }
    );

    if (!validation.isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://gt-podcastparty-so1e.onrender.com/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(validation.sanitizedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error de autenticación');
      }

      const { accessToken, refreshToken } = await response.json();
      
      if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
        throw new Error('Respuesta del servidor inválida');
      }

      onAuthenticate(accessToken, refreshToken);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      
      const errorMessage = err.message.includes('fetch') 
        ? 'Error de conexión. Verifica tu internet.' 
        : err.message;
      
      handleSanitizedChange('', 'general');
      errors.general = errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='login__main'>
      <div className='login__component'>
        <form onSubmit={handleSubmit} className='login__form' noValidate>
          <div className="form-field">
            <label htmlFor="email" className='login__form-label'>
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Correo electrónico"
              required
              maxLength="254"
              autoComplete="email"
              className={`login__form-input ${errors.email ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password" className='login__form-label'>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Contraseña"
              required
              maxLength="128"
              autoComplete="current-password"
              className={`login__form-input ${errors.password ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="login__form-button"
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <Link to="/register" className="login__form-register">
            ¿Aún no te registraste?
          </Link>
        </form>

        {errors.general && (
          <div className="general-error" role="alert">
            <p>{errors.general}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default LoginPage;