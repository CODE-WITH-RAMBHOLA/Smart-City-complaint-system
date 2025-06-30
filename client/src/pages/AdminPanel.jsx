import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('complaints');
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    totalUsers: 0,
    resolvedComplaints: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [complaintsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/complaints/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setComplaints(complaintsRes.data);
      setUsers(usersRes.data);
      
      // Calculate stats
      const totalComplaints = complaintsRes.data.length;
      const pendingComplaints = complaintsRes.data.filter(c => c.status === 'Pending').length;
      const resolvedComplaints = complaintsRes.data.filter(c => c.status === 'Done' || c.status === 'completed').length;
      
      setStats({
        totalComplaints,
        pendingComplaints,
        totalUsers: usersRes.data.length,
        resolvedComplaints
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${complaintId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-white drop-shadow-lg tracking-tight">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-6 rounded-xl shadow-lg text-white flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-1">Total Complaints</h3>
            <p className="text-3xl font-extrabold">{stats.totalComplaints}</p>
          </div>
          <div className="bg-gradient-to-tr from-yellow-500 to-yellow-300 p-6 rounded-xl shadow-lg text-gray-900 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-1">Pending Complaints</h3>
            <p className="text-3xl font-extrabold">{stats.pendingComplaints}</p>
          </div>
          <div className="bg-gradient-to-tr from-green-500 to-green-300 p-6 rounded-xl shadow-lg text-gray-900 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-1">Resolved Complaints</h3>
            <p className="text-3xl font-extrabold">{stats.resolvedComplaints}</p>
          </div>
          <div className="bg-gradient-to-tr from-purple-600 to-purple-400 p-6 rounded-xl shadow-lg text-white flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-1">Total Users</h3>
            <p className="text-3xl font-extrabold">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-lg shadow overflow-hidden border border-gray-700 bg-gray-800">
            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-6 py-3 font-bold text-lg transition-all duration-200 focus:outline-none ${
                activeTab === 'complaints'
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Complaints
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-bold text-lg transition-all duration-200 focus:outline-none ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-inner'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        {activeTab === 'complaints' && (
          <div className="bg-gray-900 shadow-2xl rounded-2xl overflow-x-auto mb-10 border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-800 transition-all duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">{complaint.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-200">{complaint.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-md transition-all duration-150 ${
                        complaint.status === 'Pending' ? 'bg-yellow-200 text-yellow-900' :
                        complaint.status === 'Done' ? 'bg-green-300 text-green-900' :
                        'bg-gray-300 text-gray-900'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-purple-200">{complaint.priority}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="bg-gray-900 shadow-2xl rounded-2xl overflow-x-auto border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800 transition-all duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-200">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-md transition-all duration-150 ${
                        user.role === 'admin' ? 'bg-purple-300 text-purple-900' : 'bg-blue-300 text-blue-900'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-200">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 