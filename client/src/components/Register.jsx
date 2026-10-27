import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  // useMemo: recompute the strength score only when the password changes
  const strength = useMemo(() => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return { score, label: ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][score] };
  }, [form.password]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try { await register(form.name, form.email, form.password); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="card">
      <h1>Create account</h1>
      <form onSubmit={onSubmit}>
        <label>Name
          <input ref={nameRef} name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>Email
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </label>
        <label>Password
          <input name="password" type="password" minLength={8} value={form.password} onChange={onChange} required />
        </label>
        <div className="meter" aria-hidden="true"><span style={{ width: `${strength.score * 25}%` }} data-score={strength.score} /></div>
        <p className="muted small">Strength: {strength.label}</p>
        {error && <p className="error" role="alert">{error}</p>}
        <button disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
      </form>
      <p className="muted">Already registered? <button className="link" onClick={onSwitch}>Log in</button></p>
    </main>
  );
}
