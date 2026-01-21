import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
                    <p className="text-gray-600 mt-2">Join us to discover amazing events</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    
                    <Input
                        id="name"
                        label="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                    />
                    
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                    />
                    
                    <Input
                        id="phone"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="1234567890"
                    />
                    
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
                        Sign Up
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
