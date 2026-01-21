import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import EventShows from "./pages/EventShows";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./layouts/Layout";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/events/:eventId/shows" element={<EventShows />} />
          <Route path="/book/:showId" element={<BookingPage />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
