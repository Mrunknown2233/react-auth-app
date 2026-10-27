import { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState('login');

  if (loading) return <p className="center muted">Checking your session…</p>;
  if (user) return <Dashboard />;

  return mode === 'login'
    ? <Login onSwitch={() => setMode('register')} />
    : <Register onSwitch={() => setMode('login')} />;
}
