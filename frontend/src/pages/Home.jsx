import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import { MapPin, Clock, Star, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/api/events');
                setEvents(res.data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            <section className="text-center space-y-4 py-12">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
                    Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Amazing Events</span>
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-500">
                    Book tickets for the hottest concerts, movies, and shows in your city.
                </p>
            </section>

            {loading ? (
                <div className="flex justify-center p-12">
                     <span className="loading loading-dots loading-lg text-primary-500"></span>
                     {/* Using a simple text loader if daisyUI/etc not present, but using animate-spin icon in Button so... */}
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {events.map((event) => (
                        <motion.div 
                            key={event.id}
                            variants={item}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group"
                        >
                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                {/* Placeholder for Event Image - using gradients or conditional logic based on genre */}
                                <div className="absolute inset-0 bg-[url('/src/assets/party.png')] bg-cover bg-center flex items-end p-6">
                                    <h3 className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300 origin-left">{event.title}</h3>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 flex items-center shadow-lg">
                                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                                    {event.rating}
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col space-y-4">
                                <div className="space-y-2 text-gray-600">
                                    <div className="flex items-center text-sm">
                                        <Music className="w-4 h-4 mr-2 text-primary-500" />
                                        {event.genre} • {event.language}
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                                        {event.city}
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Clock className="w-4 h-4 mr-2 text-primary-500" />
                                        {event.durationMinutes} mins
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto">
                                    <Button 
                                        className="w-full" 
                                        onClick={() => navigate(`/events/${event.id}/shows`, { state: { event } })}
                                    >
                                        View Shows
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Home;
