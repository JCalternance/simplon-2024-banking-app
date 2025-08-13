import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api.js'

export default function useAuth() {
    const [token, setToken] = useState(localStorage.getItem('accessToken'))
    const [isOffline, setIsOffline] = useState(!navigator.onLine)
    const [isAuthenticated, setIsAuthenticated] = useState(!!token || isOffline)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false)
            setIsAuthenticated(!!localStorage.getItem('accessToken'))
        }

        const handleOffline = () => {
            setIsOffline(true)
            setIsAuthenticated(!!localStorage.getItem('accessToken'))
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const login = async (username, password) => {
        setLoading(true)
        setError(null)

        if (!navigator.onLine) {
            setError('Connexion impossible : vous êtes hors ligne')
            setLoading(false)
            return false
        }

        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            })

            localStorage.setItem('accessToken', data.accessToken)
            setToken(data.accessToken)
            setIsAuthenticated(true)
            setLoading(false)
            return true
        } catch (err) {
            setError(err.message)
            setLoading(false)
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        setToken(null)
        setIsAuthenticated(false)
    }

    return {
        token,
        isAuthenticated,
        isOffline,
        loading,
        error,
        login,
        logout,
    }
}