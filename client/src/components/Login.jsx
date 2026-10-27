import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const emailRef = useRef(null);

  // useRef + useEffect: focus the first field when the page opens
  useEffect(() => { emailRef.current?.focus(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try { await login(form.email, form.password); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="card">
      <h1>Log in</h1>
      <form onSubmit={onSubmit}>
        <label>Email
          <input ref={emailRef} name="email" type="email" value={form.email} onChange={onChange} required />
        </label>
        <label>Password
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="muted">New here? <button className="link" onClick={onSwitch}>Create an account</button></p>
    </main>
  );
}
