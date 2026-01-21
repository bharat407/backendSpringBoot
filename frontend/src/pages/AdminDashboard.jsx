import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Save, Trash2, Calendar, Clock, MapPin, Users } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('ADMIN');

    const [activeTab, setActiveTab] = useState('events'); // 'events', 'create-event', 'create-show'
    const [events, setEvents] = useState([]);
    const [allShows, setAllShows] = useState([]);
    
    const [eventData, setEventData] = useState({ 
        title: '', 
        city: '', 
        language: '', 
        genre: '', 
        durationMinutes: '', 
        rating: '' 
    });
   
    const [showData, setShowData] = useState({ 
        eventId: '', 
        venueName: '', 
        auditoriumName: '', 
        startTime: '', 
        totalSeats: '' 
    });
    
    const [showEndTime, setShowEndTime] = useState('');
    const [status, setStatus] = useState({ loading: false, success: '', error: '' });
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (isAdmin) {
            fetchEvents();
            fetchShows();
        }
    }, [isAdmin]);

    // Auto-calculate end time when start time or event changes
    useEffect(() => {
        if (showData.startTime && showData.eventId) {
            const selectedEvent = events.find(e => e.id === parseInt(showData.eventId));
            if (selectedEvent && selectedEvent.durationMinutes) {
                const start = new Date(showData.startTime);
                const end = new Date(start.getTime() + selectedEvent.durationMinutes * 60000);
                const year = end.getFullYear();
                const month = (end.getMonth() + 1).toString().padStart(2, '0');
                const day = end.getDate().toString().padStart(2, '0');
                const hours = end.getHours().toString().padStart(2, '0');
                const minutes = end.getMinutes().toString().padStart(2, '0');
                setShowEndTime(`${year}-${month}-${day}T${hours}:${minutes}`);
            }
        }
    }, [showData.startTime, showData.eventId, events]);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/api/events');
            setEvents(res.data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        }
    };

    const fetchShows = async () => {
        try {
            const res = await api.get('/api/shows');
            setAllShows(res.data);
        } catch (error) {
            console.error("Failed to fetch shows", error);
        }
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        const errors = {};
        const duration = parseInt(eventData.durationMinutes);
        if (isNaN(duration) || duration <= 0) {
            errors.durationMinutes = 'Duration must be a positive number.';
        }
        
        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            setStatus({ loading: false, success: '', error: 'Please fix the errors below.' });
            return;
        }

        setStatus({ loading: true, success: '', error: '' });
        try {
            await api.post('/api/events', {
                ...eventData,
                durationMinutes: parseInt(eventData.durationMinutes)
            });
            setStatus({ loading: false, success: 'Event created successfully!', error: '' });
            setEventData({ title: '', city: '', language: '', genre: '', durationMinutes: '', rating: '' });
            fetchEvents();
            setTimeout(() => setActiveTab('events'), 1500);
        } catch (err) {
            const apiError = err.response?.data?.message || 'Failed to create event.';
            if (err.response?.data?.errors) {
                const backendErrors = err.response.data.errors.reduce((acc, error) => {
                    acc[error.field] = error.defaultMessage;
                    return acc;
                }, {});
                setValidationErrors(backendErrors);
            }
            setStatus({ loading: false, success: '', error: apiError });
        }
    };

    const handleShowSubmit = async (e) => {
        e.preventDefault();
        
        const startTime = new Date(showData.startTime);
        
        if (startTime < new Date()) {
            setStatus({ loading: false, success: '', error: 'Start time cannot be in the past.' });
            return;
        }

        setStatus({ loading: true, success: '', error: '' });
        try {
            await api.post('/api/shows', {
                ...showData,
                eventId: parseInt(showData.eventId),
                startTime: showData.startTime,
                totalSeats: parseInt(showData.totalSeats)
            });
            setStatus({ loading: false, success: 'Show created successfully!', error: '' });
            setShowData({ eventId: '', venueName: '', auditoriumName: '', startTime: '', totalSeats: '' });
            setShowEndTime('');
            fetchShows();
            setTimeout(() => setActiveTab('events'), 1500);
        } catch (err) {
            const apiError = err.response?.data?.message || 'Failed to create show. Ensure Event ID exists.';
            if (err.response?.data?.errors) {
                const backendErrors = err.response.data.errors.reduce((acc, error) => {
                    acc[error.field] = error.defaultMessage;
                    return acc;
                }, {});
                setValidationErrors(backendErrors);
            }
            setStatus({ loading: false, success: '', error: apiError });
        }
    };

    const handleDeleteShow = async (showId) => {
        if (!confirm('Are you sure you want to delete this show?')) return;
        
        try {
            await api.delete(`/api/shows/${showId}`);
            setStatus({ loading: false, success: 'Show deleted successfully!', error: '' });
            fetchShows();
            fetchEvents(); // Refresh to check if event should be auto-deleted
        } catch (err) {
            setStatus({ loading: false, success: '', error: 'Failed to delete show.' });
        }
    };

    const handleDeleteEvent = async (eventId) => {
        const eventShows = allShows.filter(s => s.event?.id === eventId);
        
        if (eventShows.length > 0) {
            setStatus({ loading: false, success: '', error: `Cannot delete event with existing shows. Delete all ${eventShows.length} show(s) first.` });
            return;
        }

        if (!confirm('Are you sure you want to delete this event?')) return;
        
        try {
            await api.delete(`/api/events/${eventId}`);
            setStatus({ loading: false, success: 'Event deleted successfully!', error: '' });
            fetchEvents();
        } catch (err) {
            setStatus({ loading: false, success: '', error: 'Failed to delete event.' });
        }
    };

    // Get current datetime for min attribute
    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    if (!isAdmin) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
                <p className="text-gray-500">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

            <div className="flex flex-wrap gap-4 border-b border-gray-200 pb-4">
                <button 
                    onClick={() => setActiveTab('events')}
                    className={`px-6 py-2.5 font-medium rounded-lg transition-all ${
                        activeTab === 'events' 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    View All Events & Shows
                </button>
                <button 
                    onClick={() => setActiveTab('create-event')}
                    className={`px-6 py-2.5 font-medium rounded-lg transition-all ${
                        activeTab === 'create-event' 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Create Event
                </button>
                <button 
                    onClick={() => setActiveTab('create-show')}
                    className={`px-6 py-2.5 font-medium rounded-lg transition-all ${
                        activeTab === 'create-show' 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Create Show
                </button>
            </div>

            {status.success && <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">{status.success}</div>}
            {status.error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{status.error}</div>}

            <AnimatePresence mode="wait">
                {activeTab === 'events' && (
                    <motion.div
                        key="events"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {events.map((event) => {
                            const eventShows = allShows.filter(s => s.event?.id === event.id);
                            
                            return (
                                <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {event.city}</span>
                                                <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {event.durationMinutes} mins</span>
                                                <span className="bg-gray-100 px-2 py-0.5 rounded">{event.genre}</span>
                                                <span className="bg-gray-100 px-2 py-0.5 rounded">{event.rating}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Event
                                        </button>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                            Available Shows ({eventShows.length})
                                        </h3>
                                        {eventShows.length === 0 ? (
                                            <p className="text-gray-500 text-sm italic">No shows created yet</p>
                                        ) : (
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                {eventShows.map((show) => (
                                                    <div key={show.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{show.venueName}</h4>
                                                                <p className="text-sm text-gray-500">{show.auditoriumName}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteShow(show.id)}
                                                                className="text-red-600 hover:bg-red-100 p-1.5 rounded transition-colors"
                                                                title="Delete Show"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="space-y-1 text-sm text-gray-600">
                                                            <div className="flex items-center">
                                                                <Calendar className="w-3.5 h-3.5 mr-2" />
                                                                {new Date(show.startTime).toLocaleDateString()} {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Users className="w-3.5 h-3.5 mr-2" />
                                                                {show.totalSeats - (show.bookedSeats || 0)} / {show.totalSeats} seats available
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {activeTab === 'create-event' && (
                    <motion.div
                        key="create-event"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <form onSubmit={handleEventSubmit} className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center"><PlusCircle className="w-5 h-5 mr-2"/> Create New Event</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input 
                                    label="Event Title" 
                                    value={eventData.title} 
                                    onChange={e => setEventData({...eventData, title: e.target.value})} 
                                    required 
                                    placeholder="e.g. Rock Concert" 
                                />
                                <Input 
                                    label="City" 
                                    value={eventData.city} 
                                    onChange={e => setEventData({...eventData, city: e.target.value})} 
                                    required 
                                    placeholder="e.g. New York" 
                                />
                                <Input 
                                    label="Language" 
                                    value={eventData.language} 
                                    onChange={e => setEventData({...eventData, language: e.target.value})} 
                                    required 
                                    placeholder="e.g. English" 
                                />
                                <Input 
                                    label="Genre" 
                                    value={eventData.genre} 
                                    onChange={e => setEventData({...eventData, genre: e.target.value})} 
                                    required 
                                    placeholder="e.g. Music" 
                                />
                                <Input 
                                    label="Duration (mins)" 
                                    type="number" 
                                    min="1"
                                    value={eventData.durationMinutes} 
                                    onChange={e => setEventData({...eventData, durationMinutes: e.target.value})} 
                                    required 
                                    placeholder="120"
                                    error={validationErrors.durationMinutes}
                                />
                                <Input 
                                    label="Rating" 
                                    value={eventData.rating} 
                                    onChange={e => setEventData({...eventData, rating: e.target.value})} 
                                    required 
                                    placeholder="e.g. PG-13" 
                                />
                            </div>
                            <Button type="submit" isLoading={status.loading}><Save className="w-4 h-4 mr-2"/> Save Event</Button>
                        </form>
                    </motion.div>
                )}

                {activeTab === 'create-show' && (
                    <motion.div
                        key="create-show"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <form onSubmit={handleShowSubmit} className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center"><PlusCircle className="w-5 h-5 mr-2"/> Create New Show</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
                                    <select 
                                        value={showData.eventId}
                                        onChange={e => setShowData({...showData, eventId: e.target.value})}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">-- Select an Event --</option>
                                        {events.map(event => (
                                            <option key={event.id} value={event.id}>
                                                {event.title} ({event.durationMinutes} mins)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Input 
                                    label="Venue Name" 
                                    value={showData.venueName} 
                                    onChange={e => setShowData({...showData, venueName: e.target.value})} 
                                    required 
                                    placeholder="e.g. Grand Arena" 
                                />
                                <Input 
                                    label="Auditorium" 
                                    value={showData.auditoriumName} 
                                    onChange={e => setShowData({...showData, auditoriumName: e.target.value})} 
                                    required 
                                    placeholder="e.g. Hall 1" 
                                />
                                <Input 
                                    label="Total Seats" 
                                    type="number" 
                                    min="1"
                                    value={showData.totalSeats} 
                                    onChange={e => setShowData({...showData, totalSeats: e.target.value})} 
                                    required 
                                    placeholder="500" 
                                />
                                <Input 
                                    label="Start Time" 
                                    type="datetime-local" 
                                    min={getCurrentDateTime()}
                                    value={showData.startTime} 
                                    onChange={e => setShowData({...showData, startTime: e.target.value})} 
                                    required 
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Time <span className="text-gray-500 text-xs">(Auto-calculated)</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={showEndTime}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                             <Button type="submit" isLoading={status.loading}><Save className="w-4 h-4 mr-2"/> Save Show</Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
