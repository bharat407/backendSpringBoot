import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, Film, Ticket, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const Layout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Events', path: '/', icon: Calendar },
    ];

    if (user?.roles?.includes('ADMIN')) {
        navItems.push({ name: 'Admin Dashboard', path: '/admin', icon: Film });
    } else {
        navItems.push({ name: 'My Bookings', path: '/bookings', icon: Ticket });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    B
                                </div>
                                <span className="font-bold text-xl tracking-tight text-gray-900">BookingApp</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={clsx(
                                            "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 border-b-2 h-full",
                                            isActive
                                                ? "border-primary-500 text-gray-900"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        )}
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            
                            <div className="ml-4 flex items-center border-l border-gray-200 pl-4">
                                <span className="text-sm text-gray-500 mr-4">Hi, {user?.name || user?.sub}</span>
                                <button
                                    onClick={logout}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                            >
                                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100">
                        <div className="pt-2 pb-3 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={clsx(
                                            "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                                            isActive
                                                ? "bg-primary-50 border-primary-500 text-primary-700"
                                                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <Icon className="w-5 h-5 mr-3" />
                                            {item.name}
                                        </div>
                                    </Link>
                                );
                            })}
                            <div className="pl-3 pr-4 py-3 border-t border-gray-100">
                                <div className="text-base font-medium text-gray-800 mb-2">Hi, {user?.sub}</div>
                                <button
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
