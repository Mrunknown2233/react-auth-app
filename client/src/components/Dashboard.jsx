import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // useEffect: update the browser tab title whenever the task count changes
  useEffect(() => { document.title = `${tasks.length} task(s) · ${user.name}`; }, [tasks.length, user.name]);

  // useMemo: filter only when tasks or the search text change
  const visible = useMemo(
    () => tasks.filter((t) => t.text.toLowerCase().includes(query.toLowerCase())),
    [tasks, query]
  );

  function addTask(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: text.trim(), done: false }]);
    setText('');
    inputRef.current.focus(); // useRef: return focus to the input
  }

  const toggle = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTasks(tasks.filter((t) => t.id !== id));

  return (
    <main className="card wide">
      <header className="bar">
        <div>
          <h1>Hello, {user.name}</h1>
          <p className="muted small">{user.email}</p>
        </div>
        <button className="secondary" onClick={logout}>Log out</button>
      </header>

      <form onSubmit={addTask} className="row">
        <input ref={inputRef} placeholder="Add a task" value={text} onChange={(e) => setText(e.target.value)} />
        <button>Add task</button>
      </form>

      <input className="search" placeholder="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} />

      {visible.length === 0 ? (
        <p className="muted">{tasks.length ? 'No tasks match your search.' : 'No tasks yet. Add your first one above.'}</p>
      ) : (
        <ul>
          {visible.map((t) => (
            <li key={t.id}>
              <label className="inline">
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                <span className={t.done ? 'done' : ''}>{t.text}</span>
              </label>
              <button className="link" onClick={() => remove(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
