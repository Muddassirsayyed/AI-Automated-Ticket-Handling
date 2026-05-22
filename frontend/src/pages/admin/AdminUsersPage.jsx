import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ROLES = ['user', 'agent', 'admin'];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, []);

  const updateRole = async (userId, role) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}`, { role });
      setUsers(p => p.map(u => u._id === userId ? data : u));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const toggleActive = async (userId, isActive) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}`, { isActive: !isActive });
      setUsers(p => p.map(u => u._id === userId ? data : u));
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(p => p.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <DashboardLayout title="Manage Users"><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></DashboardLayout>;

  return (
    <DashboardLayout title="Manage Users">
      <div className="glass-card mb-6 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field max-w-xs"
        />
        <span className="text-slate-400 text-sm">{filtered.length} users</span>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Joined</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center font-bold text-xs">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">{u.name}</p>
                      <p className="text-slate-500 text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={u.role}
                    onChange={e => updateRole(u._id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                  >
                    {ROLES.map(r => <option key={r} value={r} className="bg-slate-900 capitalize">{r}</option>)}
                  </select>
                </td>
                <td className="py-3 px-4">
                  <span className={`badge ${u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(u._id, u.isActive)} className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => deleteUser(u._id)} className="text-xs px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
