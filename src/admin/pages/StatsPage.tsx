import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, RefreshCw, X, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface StatItem {
  id: number;
  icon: string;
  label: string;
  target_value: number;
  suffix?: string;
  subtext?: string;
  is_visible: boolean;
  display_order: number;
}

const defaultForm = { icon: 'Star', label: '', target_value: 0, suffix: '', subtext: '', is_visible: true, display_order: 0 };

export default function StatsPage() {
  const [items, setItems] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<StatItem | null>(null);
  const [form, setForm] = useState({ ...defaultForm });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/stats/');
      setItems(res.data);
    } catch { toast.error('Failed to load stats'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...defaultForm, display_order: items.length });
    setIsModalOpen(true);
  };

  const openEdit = (item: StatItem) => {
    setEditing(item);
    setForm({ icon: item.icon, label: item.label, target_value: item.target_value, suffix: item.suffix || '', subtext: item.subtext || '', is_visible: item.is_visible, display_order: item.display_order });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.patch(`/admin/stats/${editing.id}`, form);
        toast.success('Stat updated');
      } else {
        await api.post('/admin/stats/', form);
        toast.success('Stat created');
      }
      setIsModalOpen(false);
      load();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this stat item?')) return;
    try {
      await api.delete(`/admin/stats/${id}`);
      toast.success('Deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const toggleVisibility = async (item: StatItem) => {
    try {
      await api.post(`/admin/stats/${item.id}/toggle-visibility`);
      load();
    } catch { toast.error('Failed'); }
  };

  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === items.length - 1) return;
    const target = dir === 'up' ? idx - 1 : idx + 1;
    const orders: Record<number, number> = {
      [items[idx].id]: items[target].display_order,
      [items[target].id]: items[idx].display_order,
    };
    try { await api.post('/admin/stats/reorder', orders); load(); } catch { toast.error('Reorder failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Statistics Manager</h1>
          <p className="text-xs text-text-muted">Manage the counters shown on the homepage (pilgrims, poojas, etc.)</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={load} className="p-2 rounded-lg border border-light-gold-border/20 hover:bg-[#FFF9F2] transition-colors"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /></button>
          <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-deep-maroon text-white text-sm font-bold flex items-center space-x-2 shadow hover:shadow-md transition-all cursor-pointer">
            <Plus size={16} /><span>Add Stat</span>
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
                <th className="py-4 px-5">Order</th>
                <th className="py-4 px-5">Icon</th>
                <th className="py-4 px-5">Label</th>
                <th className="py-4 px-5">Value</th>
                <th className="py-4 px-5">Suffix</th>
                <th className="py-4 px-5">Visible</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gold-border/10 text-sm">
              {items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-amber-50/10 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex space-x-1">
                      <button disabled={idx === 0} onClick={() => handleMove(idx, 'up')} className="p-1 rounded hover:bg-amber-50 disabled:opacity-30"><ArrowUp size={13} /></button>
                      <button disabled={idx === items.length - 1} onClick={() => handleMove(idx, 'down')} className="p-1 rounded hover:bg-amber-50 disabled:opacity-30"><ArrowDown size={13} /></button>
                    </div>
                  </td>
                  <td className="py-3 px-5 font-mono text-xs text-text-muted">{item.icon}</td>
                  <td className="py-3 px-5 font-bold text-text-dark">{item.label}</td>
                  <td className="py-3 px-5 text-primary-gold font-extrabold">{item.target_value}</td>
                  <td className="py-3 px-5 text-text-muted">{item.suffix || '—'}</td>
                  <td className="py-3 px-5">
                    <button onClick={() => toggleVisibility(item)} className={`inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full transition-all ${item.is_visible ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {item.is_visible ? <Eye size={11} /> : <EyeOff size={11} />}
                      <span>{item.is_visible ? 'On' : 'Off'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end space-x-1">
                      <button onClick={() => openEdit(item)} className="p-2 text-primary-gold hover:bg-amber-50 rounded-lg"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-text-muted text-sm">No stats found. Click "Add Stat" to create one.</td></tr>
              )}
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
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">{editing ? 'Edit Stat Item' : 'Add New Stat'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-amber-100 text-text-muted"><X size={18} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                {[
                  { field: 'label', label: 'Label *', placeholder: 'e.g. Annual Pilgrims', required: true, type: 'text' },
                  { field: 'target_value', label: 'Numeric Value *', placeholder: 'e.g. 1500000', required: true, type: 'number' },
                  { field: 'icon', label: 'Icon Name (Lucide) *', placeholder: 'e.g. Users, Star, Heart', required: true, type: 'text' },
                  { field: 'suffix', label: 'Suffix (optional)', placeholder: 'e.g. +, /year', required: false, type: 'text' },
                  { field: 'subtext', label: 'Sub-text (optional)', placeholder: 'e.g. Spiritual Legacy since 200 BC', required: false, type: 'text' },
                ].map(({ field, label, placeholder, required, type }) => (
                  <div key={field} className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">{label}</label>
                    <input type={type} required={required} placeholder={placeholder}
                      value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                      className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all" />
                  </div>
                ))}
                <div className="flex items-center space-x-3 pt-1">
                  <input type="checkbox" id="stat_visible" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} className="rounded accent-primary-gold" />
                  <label htmlFor="stat_visible" className="text-sm font-semibold text-text-dark cursor-pointer">Visible on homepage</label>
                </div>
                <div className="pt-4 border-t border-light-gold-border/10 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-light-gold-border/30 hover:bg-[#FFF9F2] text-sm text-[#2D2D2D] transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-deep-maroon text-white font-bold text-sm shadow-md cursor-pointer">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
