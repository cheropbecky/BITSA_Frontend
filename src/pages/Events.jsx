import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; 
import { ArrowRight, Calendar, Tag, FileText } from "lucide-react"; 
import heroPicture from "../assets/hero_bitsa.jpg";
import api from "../api/api";

const Events = () => {
  const navigate = useNavigate(); 
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [registering, setRegistering] = useState({});
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (token) {
      api.get("/events/user/registrations")
        .then((res) => {
          setUserRegistrations(res.data.registrations || []);
        })
        .catch((err) => console.error("Error fetching registrations:", err));
    }
  }, [token]);

  const API_BASE_URL = "https://bitsa-backend-vrx7.onrender.com"; 
  const getImageSrc = (url) =>
    url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  const getEventStatus = (date) => {
    const now = new Date();
    const eventDate = new Date(date);
    if (Math.abs(eventDate - now) / 36e5 < 24 && eventDate <= now) return "Ongoing";
    if (eventDate > now) return "Upcoming";
    return "Past";
  };

  const isRegisteredForEvent = (eventId) => {
    const registration = userRegistrations.find((r) => r.event?._id === eventId);
    return {
      isRegistered: !!registration,
      status: registration?.status || '',
    };
  };

  const handleRegister = async (eventId) => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      setRegistering((prev) => ({ ...prev, [eventId]: true }));
      await api.post(`/events/${eventId}/register`);

      toast.success("✅ Success! Your registration was successful.");

      const [regRes, eventsRes] = await Promise.all([
          api.get("/events/user/registrations"),
          api.get("/events")
      ]);
      setUserRegistrations(regRes.data.registrations || []);
      setEvents(eventsRes.data);
      
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409 || err.response?.data?.message?.includes("already registered")) {
        toast.error("You are already registered for this event.");
      } else {
        toast.error("❌ An error occurred. Please try again later.");
      }
    } finally {
      setRegistering((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const filteredEvents = events.filter((event) => {
    const status = getEventStatus(event.date);
    return filter === "All" || status === filter;
  }).sort((a, b) => new Date(a.date) - new Date(b.date)); 


  const EventDisplayLayout = ({ events }) => {
    const HalfWidthImageCard = ({ event, index }) => {
      if (!event) return <div className="hidden"></div>; 

      const { isRegistered, status } = isRegisteredForEvent(event._id);

      return (
        <motion.div
          key={event._id}
          className="relative overflow-hidden group rounded-2xl shadow-lg cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          onClick={() => navigate(`/events/${event._id}`)} 
        >
          <img
            src={getImageSrc(event.imageUrl)}
            alt={event.title}
            className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Default Visible Overlay (Title/Description) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 transition-all duration-500">
             <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white mb-2">
                {getEventStatus(event.date)}
             </span>
             <h3 className="text-2xl font-bold text-white mb-1 line-clamp-1">{event.title}</h3>
             <p className="text-sm text-gray-300 flex items-center gap-2 line-clamp-2">
                <FileText className="w-4 h-4" /> {event.description || "No description available."}
             </p>
          </div>
          
          {/* Hover Overlay (Minimal, shows Register Button/Status) */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button
                className={`w-4/5 font-semibold py-3 px-4 rounded-full transition-colors shadow-xl ${
                  isRegistered
                    ? status === 'Approved'
                      ? "bg-green-500 cursor-not-allowed text-white"
                      : status === 'Rejected'
                      ? "bg-red-400 cursor-not-allowed text-white"
                      : "bg-yellow-500 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card navigation when clicking the button
                  if (!token) {
                    setShowLoginModal(true);
                  } else if (!isRegistered) {
                    handleRegister(event._id);
                  }
                }}
                disabled={isRegistered || registering[event._id]}
                title={isRegistered ? `You have already registered. Status: ${status}` : "Click to register for this event"}
              >
                {registering[event._id] 
                  ? "Registering..." 
                  : isRegistered 
                    ? status === 'Approved'
                      ? "✓ Approved - Registered"
                      : status === 'Rejected'
                      ? "✗ Registration Rejected"
                      : "⏳ Pending Approval"
                    : "📝 Register Now"}
              </button>
          </div>
        </motion.div>
      );
    };

    const LargeCardButtons = ({ event }) => {
      const { isRegistered, status } = isRegisteredForEvent(event._id);

      // --- Registration Button for Large Cards ---
      const RegisterButton = (
        <button
          className={`font-semibold py-3 px-6 rounded-full transition-colors shadow-lg w-auto text-lg ${
            isRegistered
              ? status === 'Approved'
                ? "bg-green-500 cursor-not-allowed text-white"
                : status === 'Rejected'
                ? "bg-red-400 cursor-not-allowed text-white"
                : "bg-yellow-500 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          }`}
          onClick={(e) => {
            e.stopPropagation(); 
            if (!token) {
              setShowLoginModal(true);
            } else if (!isRegistered) {
              handleRegister(event._id);
            }
          }}
          disabled={isRegistered || registering[event._id]}
          title={isRegistered ? `You have already registered. Status: ${status}` : "Click to register for this event"}
        >
          {registering[event._id] 
            ? "Registering..." 
            : isRegistered 
              ? status === 'Approved'
                ? "✓ Registered"
                : status === 'Rejected'
                ? "✗ Rejected"
                : "⏳ Pending"
              : "📝 Register Now"}
        </button>
      );

      // --- Explore Button ---
      const ExploreButton = (
        <button 
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/events/${event._id}`);
            }} 
            className="w-auto px-6 py-3 bg-white text-blue-700 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg text-lg"
        >
            Explore Event
        </button>
      );

      return (
        <div className="mt-6 flex flex-wrap gap-4">
          {ExploreButton}
          {RegisterButton}
        </div>
      );
    };

    return (
      <motion.div
        className="space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* 1. TOP SECTION: Featured Image (3/4) & Primary CTA (1/4) */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Large Image - 3/4 Width */}
          <div className="lg:w-3/4 relative h-[480px] rounded-2xl overflow-hidden shadow-2xl">
            {events[0]?.imageUrl ? (
              <>
                <img
                  src={getImageSrc(events[0].imageUrl)}
                  alt={events[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* 💡 Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600 text-white mb-2">
                      {getEventStatus(events[0].date)}
                  </span>
                  <h3 className="text-4xl font-extrabold mb-2">{events[0].title}</h3>
                  <p className="text-lg font-medium text-gray-300 line-clamp-2">{events[0].description || "No description available for this featured event."}</p>
                  
                  {/* 💡 Buttons for Large Card 1 */}
                  <LargeCardButtons event={events[0]} />
                </div>
              </>
            ) : (
                <div className="w-full h-full bg-blue-900/50 flex items-center justify-center text-white text-xl">No Featured Event Image</div>
            )}
          </div>

          {/* Primary CTA - 1/4 Width */}
          <div className="lg:w-1/4 bg-blue-700 p-8 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Engage?</h2>
              <p className="text-blue-100 mb-6">
                Don't miss out on our specialized workshops and meetups.
              </p>
            </div>
            <div className="space-y-3">
              <button
                className="w-full bg-white text-blue-700 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300 flex items-center justify-center"
                onClick={() => navigate("/register")}
              >
                <ArrowRight className="w-5 h-5 mr-2" /> Register Now
              </button>
              <button onClick={() => setFilter("Upcoming")} className="text-white font-semibold block w-full text-center hover:text-blue-200 transition">
                View Upcoming ({events.filter(e => getEventStatus(e.date) === 'Upcoming').length})
              </button>
              <button onClick={() => setFilter("Ongoing")} className="text-white font-semibold block w-full text-center hover:text-blue-200 transition">
                View Ongoing
              </button>
              <button onClick={() => setFilter("Past")} className="text-white font-semibold block w-full text-center hover:text-blue-200 transition">
                View Past
              </button>
            </div>
          </div>
        </div>

        {/* 2. MID SECTION: Two Half-Width Interactive Images */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <HalfWidthImageCard event={events[1]} index={1} />
          </div>
          <div className="md:w-1/2">
            <HalfWidthImageCard event={events[2]} index={2} />
          </div>
        </div>

        {/* 3. LOWER MID SECTION: Secondary CTA (1/4) & Large Image (3/4) */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Secondary CTA - 1/4 Width (Left) */}
          <div className="lg:w-1/4 bg-blue-600 p-8 rounded-2xl shadow-xl flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">Contribute</h2>
            <p className="text-blue-100 mb-6">
              Have an idea for a great event? Let us know and help us grow!
            </p>
            <button
              className="w-full bg-white text-blue-700 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300 flex items-center justify-center"
              onClick={() => navigate("/contact")}
            >
              Contact Us <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
          
          {/* Large Image - 3/4 Width (Right) */}
          <div className="lg:w-3/4 relative h-[480px] rounded-2xl overflow-hidden shadow-2xl">
            {events[3]?.imageUrl ? (
              <>
                <img
                  src={getImageSrc(events[3].imageUrl)}
                  alt={events[3].title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* 💡 Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600 text-white mb-2">
                        {getEventStatus(events[3].date)}
                    </span>
                    <h3 className="text-4xl font-extrabold mb-2">{events[3].title}</h3>
                    <p className="text-lg font-medium text-gray-300 line-clamp-2">{events[3].description || "No description available for this featured event."}</p>
                    
                    {/* 💡 Buttons for Large Card 2 */}
                    <LargeCardButtons event={events[3]} />
                </div>
              </>
            ) : (
                <div className="w-full h-full bg-indigo-900/50 flex items-center justify-center text-white text-xl">No Secondary Event Image</div>
            )}
          </div>
        </div>

        {/* 4. BOTTOM SECTION: Two Half-Width Interactive Images */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <HalfWidthImageCard event={events[4]} index={4} />
          </div>
          <div className="md:w-1/2">
            <HalfWidthImageCard event={events[5]} index={5} />
          </div>
        </div>
        
        {/* Standard Grid for remaining events */}
        {filteredEvents.length > 6 && (
          <div className="mt-16 pt-8 border-t border-gray-300">
             <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">More Events</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.slice(6).map((event) => {
                    const { isRegistered, status } = isRegisteredForEvent(event._id);
                    return (
                        <motion.div
                            key={event._id}
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <div className="group overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                {event.imageUrl && (
                                    <div className="relative h-56 overflow-hidden rounded-t-2xl">
                                        <img
                                            src={getImageSrc(event.imageUrl)}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-lg font-bold text-blue-700 line-clamp-2">{event.title}</h2>
                                        <span
                                            // 💡 Tag Size Reduced
                                            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                                              getEventStatus(event.date) === "Ongoing" ? "bg-green-200 text-green-800" :
                                              getEventStatus(event.date) === "Upcoming" ? "bg-blue-200 text-blue-800" :
                                              "bg-gray-200 text-gray-800"
                                            }`}
                                        >
                                            {getEventStatus(event.date)}
                                        </span>
                                    </div>
                                    {/* Description for standard grid cards */}
                                    {event.description && (
                                        <p className="text-gray-700 text-sm mb-2 line-clamp-3">{event.description}</p>
                                    )}
                                    <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">📅 {formatDate(event.date)}</p>
                                    
                                    {/* Registration Button */}
                                    <button
                                      className={`mt-2 w-full font-semibold py-2 px-4 rounded transition-colors ${
                                        isRegistered
                                          ? status === 'Approved'
                                            ? "bg-green-500 cursor-not-allowed text-white"
                                            : status === 'Rejected'
                                            ? "bg-red-400 cursor-not-allowed text-white"
                                            : "bg-yellow-500 cursor-not-allowed text-white"
                                          : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                      }`}
                                      onClick={() => {
                                        if (!token) {
                                          setShowLoginModal(true);
                                        } else if (!isRegistered) {
                                          handleRegister(event._id);
                                        }
                                      }}
                                      disabled={isRegistered || registering[event._id]}
                                      title={isRegistered ? `You have already registered. Status: ${status}` : "Click to register for this event"}
                                    >
                                      {registering[event._id] 
                                        ? "Registering..." 
                                        : isRegistered 
                                          ? status === 'Approved'
                                            ? "✓ Approved - Registered"
                                            : status === 'Rejected'
                                            ? "✗ Registration Rejected"
                                            : "⏳ Pending Approval"
                                          : "📝 Register for Event"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
             </div>
          </div>
        )}
      </motion.div>
    );
  };
  
  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${heroPicture})` }}
    >
      <div className="bg-black/20 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            BITSA Events Calendar
          </motion.h1>
          <motion.p
            className="text-xl font-bold text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Join us for the latest tech workshops, seminars, and meetups.
          </motion.p>
        </div>

        {/* FILTERING / SORTING AREA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
          <select
            className="px-4 py-2 rounded-lg border-2 border-blue-600 bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter Events"
          >
            <option value="All">All Events</option>
            <option value="Upcoming">Upcoming Events</option>
            <option value="Ongoing">Ongoing Events</option>
            <option value="Past">Past Events</option>
          </select>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-200">Loading events...</p>
            </div>
          ) : error ? (
            <p className="text-red-400 text-center mb-4">{error}</p>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <p className="text-xl text-gray-700">No events found matching the filter.</p>
              <p className="text-gray-600 mt-2">Try selecting 'All' or check back soon!</p>
            </div>
          ) : (
             <EventDisplayLayout events={filteredEvents} />
          )}
        </div>
      </div>

      {/* LOGIN REQUIRED POPUP MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">Login Required</h2>
            <p className="text-gray-600 mb-6">
              You need to log in to register for events.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/login", { state: { from: "/events" } })}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Events;