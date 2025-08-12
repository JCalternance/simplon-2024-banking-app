import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        try {
            await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            alert('Compte créé avec succès');
            navigate('/login');
        } catch (err) {
            alert('Erreur : ' + err.message);
        }
    }

    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleRegister}>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">S’inscrire</button>
            </form>
        </div>
    );
}
