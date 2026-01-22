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
                    const roles = decoded.roles ? decoded.roles.split(',') : [];
                    setUser({ ...decoded, email: decoded.sub, roles });
                    setLoading(false); // Done updating state
                    const timeLeft = (decoded.exp - currentTime) * 1000;
                    const timer = setTimeout(() => {
                         logout();
                         window.location.href = '/login'; 
                    }, timeLeft);
                    return () => clearTimeout(timer);
                }
            } catch (e) {
                logout();
                setLoading(false);
            }
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await api.post('/api/auth/login', { email, password });
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            const decoded = jwtDecode(newToken);
            const roles = decoded.roles ? decoded.roles.split(',') : [];
            const userObj = { ...decoded, email: decoded.sub, roles };
            setToken(newToken);
            setUser(userObj);
            // We don't set loading to false here immediately 
            // because the useEffect will handle it when token changes
            return userObj;
        } catch (error) {
            setLoading(false);
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
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
