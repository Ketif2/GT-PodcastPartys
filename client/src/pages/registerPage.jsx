import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeTokens, storeUser } from '../utils/indexedDB';
import useSanitizeValidate from '../hooks/useSanitizeValidate';
import './registerPage.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
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

  const validateRepeatPassword = (repeatPass) => {
    if (!repeatPass) {
      return { isValid: false, message: 'Confirma tu contraseña' };
    }
    
    if (repeatPass !== password) {
      return { isValid: false, message: 'Las contraseñas no coinciden' };
    }
    
    return { isValid: true, sanitizedValue: repeatPass };
  };

  const handleEmailChange = (e) => {
    const sanitizedEmail = handleSanitizedChange(e.target.value, 'email', validateEmail);
    setEmail(sanitizedEmail);
  };

  const handlePasswordChange = (e) => {
    const sanitizedPassword = handleSanitizedChange(e.target.value, 'password', validatePassword);
    setPassword(sanitizedPassword);
    
    if (repeatPassword) {
      handleSanitizedChange(repeatPassword, 'repeatPassword', validateRepeatPassword);
    }
  };

  const handleRepeatPasswordChange = (e) => {
    const sanitizedRepeatPassword = handleSanitizedChange(e.target.value, 'repeatPassword', validateRepeatPassword);
    setRepeatPassword(sanitizedRepeatPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearErrors();

    const validation = validateForm(
      { email, password, repeatPassword },
      {
        email: validateEmail,
        password: validatePassword,
        repeatPassword: validateRepeatPassword
      }
    );

    if (!validation.isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const { repeatPassword: _, ...registerData } = validation.sanitizedData;
      
      const response = await fetch('https://gt-podcastparty-so1e.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(registerData),
      });

      if (response.status === 201) {
        const data = await response.json();
        
        if (!data.accessToken || !data.refreshToken) {
          throw new Error('Respuesta del servidor incompleta');
        }
        
        await storeTokens(data.accessToken, data.refreshToken);
        await storeUser({ email: validation.sanitizedData.email });

        navigate('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Error al registrarse';
        
        if (response.status === 409) {
          errors.email = 'Este email ya está registrado';
        } else {
          errors.general = errorMessage;
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      const errorMessage = error.message.includes('fetch') 
        ? 'Error de conexión. Verifica tu internet.' 
        : error.message;
      
      errors.general = errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register__main">
      <div className="register__container">
        <form className="register__form" onSubmit={handleRegister} noValidate>
          <div className="form-field">
            <label className="register__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={`register__input ${errors.email ? 'input-error' : ''}`}
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={handleEmailChange}
              required
              maxLength="254"
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-field">
            <label className="register__label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              className={`register__input ${errors.password ? 'input-error' : ''}`}
              type="password"
              placeholder="Contraseña (mín. 6 caracteres)"
              value={password}
              onChange={handlePasswordChange}
              required
              maxLength="128"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <div className="form-field">
            <label className="register__label" htmlFor="repeatPassword">
              Repetir Contraseña
            </label>
            <input
              id="repeatPassword"
              className={`register__input ${errors.repeatPassword ? 'input-error' : ''}`}
              type="password"
              placeholder="Confirma tu contraseña"
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
              required
              maxLength="128"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.repeatPassword && (
              <span className="error-message" role="alert">
                {errors.repeatPassword}
              </span>
            )}
          </div>

          <button 
            className="register__button" 
            type="submit"
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        {errors.general && (
          <div className="general-error" role="alert">
            <p>{errors.general}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;