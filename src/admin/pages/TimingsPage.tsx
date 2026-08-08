import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, RefreshCw, X, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface Timing {
  id: number;
  day_type: string;
  open_time: string;
  close_time: string;
  special_note?: string;
  is_visible: boolean;
  display_order: number;
}

const defaultForm = { day_type: '', open_time: '', close_time: '', special_note: '', is_visible: true, display_order: 0 };

export default function TimingsPage() {
  const [items, setItems] = useState<Timing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Timing | null>(null);
  const [form, setForm] = useState({ ...defaultForm });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/timings/');
      setItems(res.data);
    } catch { toast.error('Failed to load timings'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...defaultForm, display_order: items.length }); setIsModalOpen(true); };
  const openEdit = (item: Timing) => {
    setEditing(item);
    setForm({ day_type: item.day_type, open_time: item.open_time, close_time: item.close_time, special_note: item.special_note || '', is_visible: item.is_visible, display_order: item.display_order });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await api.patch(`/admin/timings/${editing.id}`, form); toast.success('Timing updated'); }
      else { await api.post('/admin/timings/', form); toast.success('Timing created'); }
      setIsModalOpen(false); load();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this timing entry?')) return;
    try { await api.delete(`/admin/timings/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const toggleVisibility = async (item: Timing) => {
    try { await api.post(`/admin/timings/${item.id}/toggle-visibility`); load(); }
    catch { toast.error('Failed'); }
  };

  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === items.length - 1) return;
    const target = dir === 'up' ? idx - 1 : idx + 1;
    const orders: Record<number, number> = { [items[idx].id]: items[target].display_order, [items[target].id]: items[idx].display_order };
    try { await api.post('/admin/timings/reorder', orders); load(); } catch { toast.error('Reorder failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Temple Timings</h1>
          <p className="text-xs text-text-muted">Configure daily opening hours, aarti times, and special holiday schedules</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={load} className="p-2 rounded-lg border border-light-gold-border/20 hover:bg-[#FFF9F2]"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /></button>
          <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-deep-maroon text-white text-sm font-bold flex items-center space-x-2 shadow cursor-pointer">
            <Plus size={16} /><span>Add Timing</span>
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
                <th className="py-4 px-5">Day / Period</th>
                <th className="py-4 px-5">Opening Time</th>
                <th className="py-4 px-5">Closing Time</th>
                <th className="py-4 px-5">Special Note</th>
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
                  <td className="py-3 px-5 font-bold text-deep-maroon">{item.day_type}</td>
                  <td className="py-3 px-5">
                    <span className="flex items-center space-x-1 text-emerald-600 font-medium">
                      <Clock size={13} /><span>{item.open_time}</span>
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span className="flex items-center space-x-1 text-rose-600 font-medium">
                      <Clock size={13} /><span>{item.close_time}</span>
                    </span>
                  </td>
                  <td className="py-3 px-5 text-xs text-text-muted max-w-[180px] truncate">{item.special_note || '—'}</td>
                  <td className="py-3 px-5">
                    <button onClick={() => toggleVisibility(item)} className={`inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full ${item.is_visible ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {item.is_visible ? <Eye size={11} /> : <EyeOff size={11} />}
                      <span>{item.is_visible ? 'Shown' : 'Hidden'}</span>
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
              {items.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-text-muted text-sm">No timings configured yet.</td></tr>}
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
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">{editing ? 'Edit Timing' : 'Add Timing'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-amber-100"><X size={18} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Day / Period Name *</label>
                  <input type="text" required placeholder="e.g. Monday – Friday, Navratri, Public Holidays" value={form.day_type} onChange={e => setForm({ ...form, day_type: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">Opening Time *</label>
                    <input type="text" required placeholder="6:00 AM" value={form.open_time} onChange={e => setForm({ ...form, open_time: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">Closing Time *</label>
                    <input type="text" required placeholder="9:00 PM" value={form.close_time} onChange={e => setForm({ ...form, close_time: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Special Note (optional)</label>
                  <input type="text" placeholder="e.g. Open 24 hours during Navratri" value={form.special_note} onChange={e => setForm({ ...form, special_note: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="timing_visible" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} className="rounded accent-primary-gold" />
                  <label htmlFor="timing_visible" className="text-sm font-semibold cursor-pointer">Show on website</label>
                </div>
                <div className="pt-4 border-t border-light-gold-border/10 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-light-gold-border/30 hover:bg-[#FFF9F2] text-sm cursor-pointer">Cancel</button>
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
