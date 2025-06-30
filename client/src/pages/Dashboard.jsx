import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/complaints/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComplaints(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchComplaints();
  }, [token]);

  function getStatusColor(status) {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-0">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-2 sm:px-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/complaints/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">New Complaint</Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh] w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-700">{error}</div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600 mb-4">No complaints found. Create your first complaint!</p>
          <Link to="/complaints/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">New Complaint</Link>
        </div>
      ) : (
        <div className="w-full px-2 sm:px-4 pb-8">
          <div className="grid w-full gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 truncate" title={complaint.title}>{complaint.title}</h2>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(complaint.status)}`}>{complaint.status}</span>
                </div>
                <p className="text-gray-600 mb-2 line-clamp-3">{complaint.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                  <span>Category: {complaint.category}</span>
                  <span>Priority: {complaint.priority}</span>
                  <span>Location: {complaint.location}</span>
                </div>
                <div className="mt-auto flex justify-between items-end">
                  <span className="text-xs text-gray-400">{new Date(complaint.createdAt).toLocaleString()}</span>
                  <Link to={`/complaints/${complaint._id}`} className="text-primary-600 hover:underline text-sm font-medium">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 