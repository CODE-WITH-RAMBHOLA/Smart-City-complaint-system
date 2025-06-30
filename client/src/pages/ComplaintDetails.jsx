import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ComplaintDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaint(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch complaint');
      } finally {
        setLoading(false);
      }
    };
    if (token && id) fetchComplaint();
  }, [token, id]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-[60vh] text-red-600">{error}</div>;
  if (!complaint) return null;

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-start py-8 px-2 sm:px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full">
        <button onClick={() => navigate(-1)} className="mb-4 text-primary-600 hover:underline">&larr; Back</button>
        <h1 className="text-3xl font-bold mb-2">{complaint.title}</h1>
        <p className="mb-2 text-gray-700"><span className="font-semibold">Description:</span> {complaint.description}</p>
        <p className="mb-2 text-gray-700"><span className="font-semibold">Category:</span> {complaint.category}</p>
        <p className="mb-2 text-gray-700"><span className="font-semibold">Priority:</span> {complaint.priority}</p>
        <p className="mb-2 text-gray-700"><span className="font-semibold">Status:</span> {complaint.status}</p>
        <p className="mb-2 text-gray-700"><span className="font-semibold">Location:</span> {complaint.location}</p>
        {complaint.coordinates && (
          <p className="mb-2 text-gray-700"><span className="font-semibold">Coordinates:</span> {complaint.coordinates.lat}, {complaint.coordinates.lng}</p>
        )}
        <p className="mb-2 text-gray-700"><span className="font-semibold">Created At:</span> {new Date(complaint.createdAt).toLocaleString()}</p>
        <p className="mb-2 text-gray-700"><span className="font-semibold">Updated At:</span> {new Date(complaint.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
} 