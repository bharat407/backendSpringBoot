import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const EventShows = () => {
    const { eventId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(state?.event);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // If we don't have event in state, we might need to find it from list (since getById is missing)
                // For now assuming state is passed or we re-fetch list to find it if really needed, 
                // but let's just focus on shows first.
                
                const showRes = await api.get('/api/shows');
                // Filter shows for this event
                // Need to ensure backend Show object has event info. 
                // Show.java has 'private Event event;' so it should be in JSON.
                const filteredShows = showRes.data.filter(s => s.event?.id === parseInt(eventId));
                setShows(filteredShows);
                
                if(!event) {
                     // Fallback: fetch all events and find
                     const eventRes = await api.get('/api/events');
                     const found = eventRes.data.find(e => e.id === parseInt(eventId));
                     setEvent(found);
                }

            } catch (error) {
                console.error("Failed to fetch shows", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId, event]);

    if(loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;

    if (!event) return <div className="text-center py-12">Event not found</div>;

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {event.city}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {event.durationMinutes} mins</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-medium">{event.rating}</span>
                    <span>{event.genre}</span>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Available Shows</h2>

            {shows.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No shows available for this event yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {shows.map((show) => (
                        <motion.div 
                            key={show.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between"
                        >
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{show.venueName}</h3>
                                        <p className="text-gray-500 text-sm">{show.auditoriumName}</p>
                                    </div>
                                    <div className="text-right">
                                         {/* Format Date */}
                                        <div className="font-medium text-primary-600">
                                            {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(show.startTime).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                    <Users className="w-4 h-4 mr-2" />
                                    <span>{show.totalSeats - (show.bookedSeats || 0)} seats available</span>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={() => navigate(`/book/${show.id}`, { state: { show, event } })}
                                disabled={show.totalSeats - (show.bookedSeats || 0) <= 0}
                                className="w-full"
                            >
                                {show.totalSeats - (show.bookedSeats || 0) <= 0 ? 'Sold Out' : 'Book Seats'}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventShows;
