import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-0 flex items-center justify-center">
      <form className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mx-2 sm:mx-0" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Sign In</h1>
        {error && <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50 mb-4"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline font-medium">Register</Link>
        </p>
      </form>
    </div>
  );
} 