import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  User,
  BookOpen,
  Calendar as CalendarIcon,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Bell,
  Check,
  Reply,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/api';
import heroPicture from '../assets/hero_bitsa.jpg';

function UserDashboard({ accessToken }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    photo: null,
    preview: null,
  });
  const [highlightedMessageIds, setHighlightedMessageIds] = useState([]);

  const token = accessToken || localStorage.getItem('token');
  const unreadReplyCount = messages.filter(msg => msg.replied && msg.status === 'unread').length;

  useEffect(() => {
    if (!token) {
      toast.error('Please log in to view your dashboard');
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchRegistrations();
    fetchMessages();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.user;
      setProfile(user);
      setFormData({
        email: user.email || '',
        photo: null,
        preview: user.photo || '/default-avatar.png',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const payload = new FormData();
    if (formData.email) payload.append('email', formData.email);
    if (formData.photo) payload.append('photo', formData.photo);

    try {
      const res = await api.put('/users/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = res.data.user;
      setProfile(updatedUser);
      setFormData(prev => ({
        ...prev,
        preview: updatedUser.photo || '/default-avatar.png',
        photo: null,
      }));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({
      ...prev,
      photo: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/events/user/registrations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await api.put(`/contact/${messageId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Reply marked as read.');
      setMessages(prev => prev.map(msg =>
        msg._id === messageId ? { ...msg, status: 'read' } : msg
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
      toast.error('Failed to mark as read.');
    }
  };

  const handleNotificationClick = () => {
    const unreadIds = messages
      .filter(msg => msg.replied && msg.status === 'unread')
      .map(msg => msg._id);

    // Scroll with offset for sticky header
    const el = document.getElementById('messages-section');
    if (el) {
      const offset = 80; // adjust if you have a header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elRect = el.getBoundingClientRect().top;
      const scrollPos = elRect - bodyRect - offset;
      window.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }

    // Highlight messages
    setHighlightedMessageIds(unreadIds);
    setTimeout(() => setHighlightedMessageIds([]), 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'Approved': return `${baseClasses} bg-green-100 text-green-800`;
      case 'Rejected': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  if (loading) return <p className="text-center py-12">Loading dashboard...</p>;
  if (!profile) return <p className="text-center py-12">Profile not found</p>;

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: `url(${heroPicture})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl text-white font-bold mb-2">My Dashboard</h1>
              <p className="text-xl font-semibold text-gray-200">
                Manage your BITSA profile and stay connected
              </p>
            </div>

            {/* Notification Bell */}
            {unreadReplyCount > 0 && (
              <motion.div
                className="bg-red-600 text-white p-4 rounded-xl shadow-xl flex items-center space-x-3 cursor-pointer hover:bg-red-700 transition"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={handleNotificationClick}
              >
                <Bell className="w-6 h-6 animate-pulse" />
                <span className="font-bold">
                  {unreadReplyCount} Unread {unreadReplyCount === 1 ? 'Reply' : 'Replies'}!
                </span>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile & Editing */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2">
              <Card className="bg-gray-100/90 opacity-88 backdrop-blur-md border border-blue-400 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
                      <CardDescription>View and update your personal details</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            email: profile.email || '',
                            photo: null,
                            preview: profile.photo || '/default-avatar.png',
                          });
                        }}>Cancel</Button>
                        <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={formData.preview || '/default-avatar.png'} alt="Profile" className="w-20 h-20 rounded-full border border-blue-400 object-cover" />
                    {isEditing && (
                      <div>
                        <Label htmlFor="photo">Upload New Photo</Label>
                        <Input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 p-2 border border-blue-400 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    ) : (
                      <p className="font-semibold">{profile.email}</p>
                    )}
                  </div>

                  {['name', 'studentId', 'course', 'year'].map((field, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-blue-400 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">
                      {field === 'year' ? <CalendarIcon className="w-5 h-5 text-blue-600" /> : <BookOpen className="w-5 h-5 text-blue-600" />}
                      <div>
                        <p className="text-sm text-gray-600">
                          {field === 'name' ? 'Full Name' : field === 'studentId' ? 'Student ID' : field === 'course' ? 'Course' : 'Year of Study'}
                        </p>
                        <p className="font-semibold">{profile[field] ? (field === 'year' ? `Year ${profile[field]}` : profile[field]) : 'Not set'}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links / Messages */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-6">
              {/* Messages Quick Link */}
              <Card className="bg-blue-300/90 border border-blue-400 shadow-md rounded-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="font-bold text-blue-600 flex items-center justify-between">
                    Messages
                    {unreadReplyCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">{unreadReplyCount}</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="default" className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    onClick={handleNotificationClick}>
                    <Mail className="w-4 h-4 mr-2" /> View My Communication
                  </Button>
                </CardContent>
              </Card>

              {/* Other Quick Links */}
              <Card className="bg-blue-300/90 border border-blue-400 shadow-md rounded-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="font-bold text-blue-600">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/blogs')}>
                    <BookOpen className="w-4 h-4 text-red-500 mr-2" /> Read Blog Posts
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/events')}>
                    <CalendarIcon className="w-4 text-blue-600 h-4 mr-2" /> View Events
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/gallery')}>
                    <User className="w-4 text-amber-600 h-4 mr-2" /> Photo Gallery
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-200/90 backdrop-blur-md border border-blue-400 shadow-md rounded-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="font-bold text-blue-600">Member Since</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not available'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Messages Section */}
          <motion.div
            id="messages-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-gray-100/90 opacity-88 backdrop-blur-md border border-blue-400 rounded-lg shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-indigo-600" /> My Messages & Admin Replies
                </CardTitle>
                <CardDescription>
                  View the status of your contact messages and admin responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <p className="text-gray-600 italic py-4">You have not sent any messages yet.</p>
                  ) : (
                    messages.map(msg => (
                      <div
                        key={msg._id}
                        className={`p-4 rounded-lg shadow-sm border transition-all duration-300
                          ${highlightedMessageIds.includes(msg._id)
                            ? 'ring-2 ring-yellow-400 bg-yellow-50'
                            : msg.replied && msg.status === 'unread'
                              ? 'border-yellow-500 bg-yellow-50 shadow-md'
                              : 'border-gray-300 bg-white'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-3 border-b pb-2">
                          <div>
                            <p className="font-semibold text-lg text-gray-800">Subject: {msg.subject}</p>
                            <p className="text-xs text-gray-500">Sent on: {new Date(msg.createdAt).toLocaleString()}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full 
                            ${msg.replied ? (msg.status === 'unread' ? 'bg-red-500 text-white flex items-center' : 'bg-green-100 text-green-800') : 'bg-gray-200 text-gray-600'}`}
                          >
                            {msg.replied ? (msg.status === 'unread' ? <><Bell className="w-3 h-3 mr-1" /> NEW REPLY</> : 'REPLIED') : 'PENDING'}
                          </span>
                        </div>

                        <p className="text-gray-700 italic mb-3">
                          <span className="font-bold text-indigo-600">Your Query:</span> {msg.message}
                        </p>

                        {/* ✅ This section correctly checks for and renders the adminReply! */}
                        {msg.replied && msg.adminReply && (
                          <div className={`mt-3 p-3 rounded-lg border-l-4 transition-colors duration-300
                            ${msg.status === 'unread' ? 'bg-yellow-100 border-yellow-500' : 'bg-blue-50 border-blue-400'}`}
                            onClick={() => msg.status === 'unread' && handleMarkAsRead(msg._id)} // auto mark on click
                          >
                            <p className="font-bold text-indigo-700 flex items-center mb-1">
                              <Reply className="w-4 h-4 mr-1"/> Admin Response:
                            </p>
                            <p className="text-indigo-800 text-sm">{msg.adminReply}</p>

                            {msg.status === 'unread' && (
                              <Button variant="ghost" size="sm" className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 p-0 h-auto">
                                <Check className="w-4 h-4 mr-1" /> Mark Reply as Read
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Event Registrations */}
          {registrations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="mt-8">
              <Card className="bg-gray-100/90 opacity-88 backdrop-blur-md border border-blue-400 rounded-lg shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">My Event Registrations</CardTitle>
                  <CardDescription>Track your event registration status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registrations.map(reg => (
                      <div key={reg._id} className="flex items-center justify-between p-4 border border-blue-300 rounded-lg bg-white hover:bg-blue-50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          {getStatusIcon(reg.status)}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{reg.event?.title}</h3>
                            {reg.event?.date && <p className="text-sm text-gray-600">📅 {new Date(reg.event.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>}
                            {reg.event?.location && <p className="text-sm text-gray-600">📍 {reg.event.location}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={getStatusBadge(reg.status)}>{reg.status}</span>
                          {reg.notes && <p className="text-xs text-gray-500 italic">Note: {reg.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default UserDashboard;