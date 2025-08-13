import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import  useAuth from '../hooks/useAuth.js'
import './Login.css';

export default function Login() {
    const { login, loading, error, isOffline } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        const success = await login(username, password)
        if (success) navigate('/transactions')

    }

    return (
        <div>
            <h2>Connexion</h2>
            {isOffline && <p style={{ color: 'orange' }}>⚠️ Vous êtes hors ligne</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <div className="button-group">
                    <button type="submit" disabled={!navigator.onLine}>Se connecter</button>
                    <button type="button" onClick={() => navigate('/register')} disabled={!navigator.onLine}>S'inscrire</button>
                </div>
            </form>
        </div>
    );
}
