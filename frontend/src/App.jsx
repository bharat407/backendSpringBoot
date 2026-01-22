import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import EventShows from "./pages/EventShows";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./layouts/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/events/:eventId/shows" element={<EventShows />} />
          <Route path="/book/:showId" element={<BookingPage />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Route>
      </Route>

      <Route path="*" element={<ErrorPage message="Page Not Found" />} />
    </Routes>
  );
}

export default App;
