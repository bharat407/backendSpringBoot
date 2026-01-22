import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import photo1 from '../assets/photo1.png';

const ErrorPage = ({ message = "Error" }) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(2);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            navigate('/login');
        }, 2000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full space-y-8"
            >
                <img 
                    src={photo1} 
                    alt="Error Illustration" 
                    className="w-full h-auto max-h-64 object-contain mx-auto mb-8"
                />
                
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900">{message}</h1>
                    <p className="text-gray-500 text-lg">
                        Redirecting to login in {countdown} seconds...
                    </p>
                </div>

                <Button 
                    onClick={() => navigate('/login')}
                    className="w-full py-3 text-lg font-semibold"
                >
                    Try Again / Login Now
                </Button>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
