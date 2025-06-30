import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Done', 'Rejected'];

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/complaints', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch (err) {
        setError('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [token, actionMsg]);

  const handleStatusChange = async (id, newStatus) => {
    setActionMsg('');
    try {
      await axios.patch(
        `http://localhost:5000/api/complaints/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMsg('Status updated!');
    } catch {
      setActionMsg('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    setActionMsg('');
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMsg('Complaint deleted!');
    } catch {
      setActionMsg('Failed to delete complaint');
    }
  };

  // Restrict access to admins only
  if (!user?.role || user.role !== 'admin') {
    return <div className="p-8 text-red-600 text-xl font-bold">Access denied: Admins only</div>;
  }

  if (loading) return <div className="p-8 text-lg">Loading complaints...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  // Filtering
  const filteredComplaints = complaints.filter((c) => {
    const searchLower = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(searchLower) ||
      (c.user?.name && c.user.name.toLowerCase().includes(searchLower)) ||
      (c.user?.email && c.user.email.toLowerCase().includes(searchLower)) ||
      (c.status && c.status.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Manage Complaints</h1>
      {actionMsg && <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">{actionMsg}</div>}
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Search by title, user, or status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">User Name</th>
              <th className="py-2 px-4">User Email</th>
              <th className="py-2 px-4">User ID</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Priority</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="py-2 px-4">{c.title}</td>
                <td className="py-2 px-4">{c.user?.name || '-'}</td>
                <td className="py-2 px-4">{c.user?.email || '-'}</td>
                <td className="py-2 px-4">{c.user?._id || c.user || '-'}</td>
                <td className="py-2 px-4">{c.category}</td>
                <td className="py-2 px-4">{c.location}</td>
                <td className="py-2 px-4">
                  <select
                    value={c.status}
                    onChange={e => handleStatusChange(c._id, e.target.value)}
                    className="px-2 py-1 border rounded"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4">{c.priority}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 