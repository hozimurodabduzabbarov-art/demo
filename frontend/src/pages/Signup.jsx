import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('auth.password') + ' ≠ ' + t('auth.confirmPassword'));
      return;
    }
    try {
      signup({ fullName, phone, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>{t('auth.createAccount')}</h1>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: 14, marginBottom: 26 }}>{t('auth.signupSubtitle')}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t('auth.fullName')}</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t('auth.phone')}</label>
            <input type="tel" placeholder="+998 90 123-45-67" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t('auth.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t('auth.confirmPassword')}</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block">{t('auth.signup')}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: 'var(--color-ink-soft)' }}>
          {t('auth.haveAccount')} <Link to="/login" style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  );
}
