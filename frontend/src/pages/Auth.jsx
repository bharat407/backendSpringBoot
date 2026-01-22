import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isLogin) {
                const user = await login(formData.email, formData.password);
                // Small timeout to ensure state is synchronized
                setTimeout(() => {
                    if (user.roles?.includes('ADMIN')) {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                }, 100);
            } else {
                await register(formData);
                setIsLogin(true);
                setError('Registration successful! Please login.');
                setFormData({ ...formData, password: '' });
            }
        } catch (err) {
            setError(isLogin ? 'Invalid email or password' : 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {isLogin ? 'Sign in to book your next experience' : 'Join us to discover amazing events'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-3 border rounded-lg text-sm text-center ${
                                    error.includes('successful') 
                                    ? 'bg-green-100 border-green-200 text-green-700' 
                                    : 'bg-red-100 border-red-200 text-red-700'
                                }`}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Input
                                id="name"
                                label="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                        </motion.div>
                    )}
                    
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                    />
                    
                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <Input
                                id="phone"
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="1234567890"
                            />
                            
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                                <select 
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                >
                                    <option value="USER">Standard User</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>
                        </motion.div>
                    )}
                    
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                    />

                    <Button type="submit" className="w-full h-11 text-base mt-2 shadow-lg shadow-primary-500/30" isLoading={isLoading}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                        >
                            {isLogin ? 'Create account' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Auth;
