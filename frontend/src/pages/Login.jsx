import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      login({ phone, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>{t('auth.welcome')}</h1>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: 14, marginBottom: 26 }}>{t('auth.loginSubtitle')}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t('auth.phone')}</label>
            <input type="tel" placeholder="+998 90 123-45-67" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t('auth.password')}</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block">{t('auth.login')}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: 'var(--color-ink-soft)' }}>
          {t('auth.noAccount')} <Link to="/signup" style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>{t('auth.createAccount')}</Link>
        </p>
      </div>
    </div>
  );
}
