import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Loader2, RefreshCw, X, User, Shield, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
}

const ROLES = ['admin', 'editor', 'viewer'];
const roleColors: Record<string, string> = {
  admin: 'bg-rose-50 text-rose-700 border border-rose-200',
  editor: 'bg-blue-50 text-blue-700 border border-blue-200',
  viewer: 'bg-stone-50 text-stone-600 border border-stone-200',
};

const defaultForm = { full_name: '', email: '', password: '', role: 'editor', is_active: true };

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ ...defaultForm });

  const load = async () => {
    setIsLoading(true);
    try { const res = await api.get('/admin/users/'); setUsers(res.data); }
    catch { toast.error('Failed to load users'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...defaultForm }); setIsModalOpen(true); };
  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setForm({ full_name: u.full_name, email: u.email, password: '', role: u.role, is_active: u.is_active });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form };
    if (!payload.password) delete payload.password;
    try {
      if (editing) { await api.patch(`/admin/users/${editing.id}`, payload); toast.success('User updated'); }
      else {
        if (!form.password) { toast.error('Password is required for new users'); return; }
        await api.post('/admin/users/', payload);
        toast.success('User created');
      }
      setIsModalOpen(false); load();
    } catch (err: any) { toast.error(err?.response?.data?.detail || 'Failed to save user'); }
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`Delete user "${u.full_name}"? This action is irreversible.`)) return;
    try { await api.delete(`/admin/users/${u.id}`); toast.success('User deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const toggleActive = async (u: AdminUser) => {
    try { await api.patch(`/admin/users/${u.id}`, { is_active: !u.is_active }); load(); }
    catch { toast.error('Failed to toggle status'); }
  };

  const formatDate = (d?: string) => {
    if (!d) return '—';
    try { return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d)); }
    catch { return d; }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
            <Shield size={22} className="text-primary-gold" /><span>User Management</span>
          </h1>
          <p className="text-xs text-text-muted">Create admin accounts, assign roles, and manage access permissions</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={load} className="p-2 rounded-lg border border-light-gold-border/20 hover:bg-[#FFF9F2]"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /></button>
          <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-deep-maroon text-white text-sm font-bold flex items-center space-x-2 shadow cursor-pointer">
            <Plus size={16} /><span>Add User</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-gold" size={32} /></div>
      ) : (
        <div className="bg-white rounded-[24px] border border-light-gold-border/20 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9F2] text-xs font-bold uppercase tracking-wider text-text-dark/70 border-b border-light-gold-border/20">
                <th className="py-4 px-5">User</th>
                <th className="py-4 px-5">Email</th>
                <th className="py-4 px-5">Role</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Joined</th>
                <th className="py-4 px-5">Last Login</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gold-border/10 text-sm">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-amber-50/10 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-deep-maroon/10 flex items-center justify-center text-deep-maroon font-bold text-xs">
                        {u.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-deep-maroon">{u.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-text-muted">{u.email}</td>
                  <td className="py-3 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${roleColors[u.role] || roleColors.viewer}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <button onClick={() => toggleActive(u)} className={`inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full transition-all ${u.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {u.is_active ? <CheckCircle size={11} /> : <XCircle size={11} />}
                      <span>{u.is_active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-5 text-xs text-text-muted">{formatDate(u.created_at)}</td>
                  <td className="py-3 px-5 text-xs text-text-muted">{formatDate(u.last_login_at)}</td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end space-x-1">
                      <button onClick={() => openEdit(u)} className="p-2 text-primary-gold hover:bg-amber-50 rounded-lg"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(u)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-text-muted text-sm">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-light-gold-border/25 shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-6 bg-[#FFF9F2] border-b border-light-gold-border/20 flex justify-between items-center">
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">{editing ? `Edit: ${editing.full_name}` : 'Create Admin User'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-amber-100"><X size={18} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Full Name *</label>
                  <input type="text" required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Email Address *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                  <input type="password" required={!editing} placeholder={editing ? '••••••••' : ''} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                    {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="user_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded accent-primary-gold" />
                  <label htmlFor="user_active" className="text-sm font-semibold cursor-pointer">Account is Active</label>
                </div>
                <div className="pt-4 border-t border-light-gold-border/10 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-light-gold-border/30 hover:bg-[#FFF9F2] text-sm cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-deep-maroon text-white font-bold text-sm shadow-md cursor-pointer">{editing ? 'Update User' : 'Create User'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
