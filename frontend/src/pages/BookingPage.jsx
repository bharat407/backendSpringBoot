import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingPage = () => {
    const { showId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [seatCount, setSeatCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const show = state?.show;
    const event = state?.event;

    if (!show || !event) {
        // Handle direct access or missing state logic if needed
        return <div className="p-8">Missing booking details. Please select a show first.</div>;
    }

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await api.post('/api/bookings', {
                showId: show.id,
                seatCount: parseInt(seatCount)
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/bookings');
            }, 2000);
        } catch (err) {
            setError('Booking failed. Not enough seats or server error.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
             <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
                <p className="text-gray-500">Redirecting to your bookings...</p>
             </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-primary-600 to-indigo-700 p-8 text-white">
                    <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
                    <div className="text-primary-100 space-y-1">
                        <p>{show.venueName}, {show.auditoriumName}</p>
                        <p>{new Date(show.startTime).toLocaleString()}</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500">Logged in as</p>
                            <p className="font-medium text-gray-900">{user?.email || user?.sub}</p>
                        </div>
                    </div>

                    <form onSubmit={handleBook} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Number of Seats</label>
                             <div className="flex items-center space-x-4">
                                <button type="button" onClick={() => setSeatCount(Math.max(1, seatCount - 1))} className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">-</button>
                                <span className="text-xl font-bold w-12 text-center">{seatCount}</span>
                                <button type="button" onClick={() => setSeatCount(Math.min(show.totalSeats - (show.bookedSeats || 0), seatCount + 1))} disabled={seatCount >= (show.totalSeats - (show.bookedSeats || 0))} className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">+</button>
                             </div>
                             <p className="text-xs text-gray-500">Max {show.totalSeats - (show.bookedSeats || 0)} seats available</p>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <Button type="submit" isLoading={loading} className="w-full text-lg h-12">
                                Confirm Booking
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingPage;
