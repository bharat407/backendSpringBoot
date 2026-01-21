import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    logout();
                } else {
                    setUser({ ...decoded, email: decoded.sub });
                    const timeLeft = (decoded.exp - currentTime) * 1000;
                    const timer = setTimeout(() => {
                         logout();
                         window.location.href = '/login'; 
                    }, timeLeft);
                    return () => clearTimeout(timer);
                }
            } catch (e) {
                logout();
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post('/api/auth/login', { email, password });
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            const decoded = jwtDecode(newToken);
            setUser({ ...decoded, email: decoded.sub });
            setToken(newToken);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const register = async (userData) => {
         await api.post('/api/auth/register', userData);
         return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
