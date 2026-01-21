import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/api/bookings');
                setBookings(res.data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                    <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                    <p className="text-gray-500 mt-1">Start exploring events to book your first show!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking, index) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                        >
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        {booking.show?.event?.title || "Unknown Event"}
                                        <span className="ml-3 text-xs font-normal px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                            Confirmed
                                        </span>
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Booking ID: #{booking.id} • Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                                        {booking.show?.startTime ? new Date(booking.show.startTime).toLocaleDateString() : 'Date N/A'}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-primary-500" />
                                        {booking.show?.startTime ? new Date(booking.show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time N/A'}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                                        {booking.show?.venueName || 'Venue N/A'}, {booking.show?.auditoriumName}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end min-w-[120px] bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Seats</span>
                                <span className="text-2xl font-bold text-gray-900">{booking.seatNumbers ? booking.seatNumbers.replace('AUTO_', '') : '0'}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
