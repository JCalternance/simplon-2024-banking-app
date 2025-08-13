import React from 'react';
import {BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from "./components/NavBar.jsx";
import './App.css';
import Categories from "./components/Category.jsx";
import PaymentMethods from "./components/PaymentMethod.jsx";
import Transactions from "./components/Transaction.jsx";
import useOfflineSync from "./services/useOfflineSync.js";
import useAuth from "./hooks/useAuth.js";

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? children : <Navigate to="/login" />
}

function Layout({children}) {
    const location = useLocation();
    const noNavPaths = ['/login', '/register'];
    const showNav = !noNavPaths.includes(location.pathname);

    return (
        <div className="app-container">
            <header className="app-header">
                {showNav && <NavBar/>}
            </header>
            <main className="app-main">{children}</main>
            <footer className="app-footer">&copy; 2025 JC1932 - Tous droits réservés</footer>
        </div>
    );
}

export default function App() {
    useOfflineSync()

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/categories" element={<PrivateRoute><Categories/></PrivateRoute>}/>
                    <Route path="/payment-methods" element={<PrivateRoute><PaymentMethods/></PrivateRoute>}/>
                    <Route path="/transactions" element={<PrivateRoute><Transactions/></PrivateRoute>}/>
                    <Route path="*" element={<Navigate to="/login"/>}/>
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
