import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            localStorage.setItem('accessToken', data.accessToken);
            navigate('/transactions');
        } catch (err) {
            alert('Connexion échouée : ' + err.message);
        }
    }

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleLogin}>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <div className="button-group">
                    <button type="submit">Se connecter</button>
                    <button type="button" onClick={() => navigate('/register')}>S'inscrire</button>
                </div>
            </form>
        </div>
    );
}
