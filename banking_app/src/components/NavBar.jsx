// src/components/NavBar.jsx
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './navbar.css';

export default function NavBar() {

    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    };

    return (
        <nav className={`navbar ${open ? 'open' : ''}`}>
            <div className="burger-container" onClick={() => setOpen(!open)}>
                <div className="burger"></div>
            </div>
            <ul className="menu">
                <li><Link to="/categories">Catégories</Link></li>
                <li><Link to="/payment-methods">Moyens de paiement</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                <li><button onClick={handleLogout}>Déconnexion</button></li>
            </ul>
        </nav>
    );
}
