import React, { Suspense, lazy, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';


// --- Mock API service (replace with real baseURL) ---
const api = axios.create({ baseURL: '/api' });


// Example auth (mock)
const authService = {
login: async (username, password) => {
// Replace with real POST to /auth/login
await new Promise(r => setTimeout(r, 400));
if (username === 'admin' && password === 'admin') return { token: 'fake-jwt', user: { name: 'Admin' } };
throw new Error('Invalid credentials');
}
};


// --- Lazy module pages (simulate modular ERP) ---
const Dashboard = lazy(() => Promise.resolve({ default: () => <div className="p-6">Welcome to ERP Dashboard</div> }));
const Sales = lazy(() => Promise.resolve({ default: () => <div className="p-6">Sales module — orders, invoices, customers</div> }));
const Inventory = lazy(() => Promise.resolve({ default: () => <div className="p-6">Inventory module — stock, products, suppliers</div> }));
const Finance = lazy(() => Promise.resolve({ default: () => <div className="p-6">Finance module — GL, payables, receivables</div> }));
const Users = lazy(() => Promise.resolve({ default: () => <div className="p-6">Users management — roles, permissions</div> }));


// --- Simple layout components ---
function Topbar({ onLogout, user }) {
return (
<header className="flex items-center justify-between px-4 h-14 bg-white border-b">
<div className="flex items-center gap-4">
<button className="md:hidden p-2">☰</button>
<h1 className="text-lg font-semibold">ERP System</h1>
</div>
<div className="flex items-center gap-3">
<div className="text-sm">{user?.name || 'Guest'}</div>
<button onClick={onLogout} className="text-sm px-3 py-1 rounded bg-gray-100">Logout</button>
</div>
</header>
);
}


function Sidebar({ nav }) {
return (
<aside className="w-64 hidden md:block bg-gray-50 border-r">
<nav className="p-4">
{nav.map(item => (
<Link key={item.to} to={item.to} className="block px-3 py-2 rounded hover:bg-gray-100">{item.label}</Link>
))}
</nav>
</aside>
);
}

// --- Auth pages ---
function LoginPage({ onLogin }) {
const [username, setUsername] = useState('admin');
const [password, setPassword] = useState('admin');
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);


const submit = async e => {
e.preventDefault();
setError(null);
setLoading(true);
try {
const res = await authService.login(username, password);
onLogin(res);
} catch (err) {
setError(err.message);
} finally {
setLoading(false);
}
};


return (
<div className="min-h-screen flex items-center justify-center bg-slate-50">
<form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
<h2 className="text-xl font-semibold mb-4">Sign in</h2>
{error && <div className="text-sm text-red-600 mb-2">{error}</div>}
<label className="block mb-2 text-sm">Username</label>
<input value={username} onChange={e => setUsername(e.target.value)} className="w-full mb-3 p-2 border rounded" />
<label className="block mb-2 text-sm">Password</label>
<input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded" />
<button className="w-full py-2 rounded bg-blue-600 text-white" disabled={loading}>{loading ? 'Signing...' : 'Sign in'}</button>
</form>
</div>
);
}


// --- Protected route ---
function RequireAuth({ children, user }) {
if (!user) return <Navigate to="/login" replace />;
return children;
}

// --- Main App ---
export default function Example() {
const [user, setUser] = useState(() => null);
const navigate = useNavigate ? useNavigate() : null; // If mounted inside Router via index, useNavigate will exist


const nav = useMemo(() => [
{ to: '/', label: 'Dashboard' },
{ to: '/sales', label: 'Sales' },
{ to: '/inventory', label: 'Inventory' },
{ to: '/finance', label: 'Finance' },
{ to: '/users', label: 'Users' },
], []);


const handleLogin = auth => {
// Save token to localStorage (example)
localStorage.setItem('erp_token', auth.token);
setUser(auth.user);
// If using navigate:
try { window.history.replaceState({}, '', '/'); } catch (e) {}
};


const handleLogout = () => {
localStorage.removeItem('erp_token');
setUser(null);
// navigate to login
try { window.location.href = '/login'; } catch (e) {}
};


return (
    <div className="min-h-screen bg-gray-100">
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/*" element={(
                <RequireAuth user={user}>
                <div className="flex min-h-screen">
                <Sidebar nav={nav} />
                <div className="flex-1 flex flex-col">
                <Topbar onLogout={handleLogout} user={user} />
                <main className="p-4 flex-1 overflow-auto">
                <Suspense fallback={<div>Loading module...</div>}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="*" element={<div>Not found</div>} />
                </Routes>
                </Suspense>
                </main>
                </div>
                </div>
                </RequireAuth>
                )} />
            </Routes>
        </Router>
    </div>
);
}