import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, RefreshCw, X, Star, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface Testimonial {
  id: number;
  name: string;
  location?: string;
  text: string;
  rating: number;
  photo_url?: string;
  is_visible: boolean;
  display_order: number;
}

const defaultForm = { name: '', location: '', text: '', rating: 5, photo_url: '', is_visible: true, display_order: 0 };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<typeof defaultForm>({ ...defaultForm });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/testimonials/');
      setItems(res.data);
    } catch { toast.error('Failed to load testimonials'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...defaultForm, display_order: items.length }); setIsModalOpen(true); };
  const openEdit = (item: Testimonial) => {
    setEditing(item);
    setForm({ name: item.name, location: item.location || '', text: item.text, rating: item.rating, photo_url: item.photo_url || '', is_visible: item.is_visible, display_order: item.display_order });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await api.patch(`/admin/testimonials/${editing.id}`, form); toast.success('Testimonial updated'); }
      else { await api.post('/admin/testimonials/', form); toast.success('Testimonial created'); }
      setIsModalOpen(false); load();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await api.delete(`/admin/testimonials/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const toggleVisibility = async (item: Testimonial) => {
    try { await api.post(`/admin/testimonials/${item.id}/toggle-visibility`); load(); }
    catch { toast.error('Failed'); }
  };

  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === items.length - 1) return;
    const target = dir === 'up' ? idx - 1 : idx + 1;
    const orders: Record<number, number> = { [items[idx].id]: items[target].display_order, [items[target].id]: items[idx].display_order };
    try { await api.post('/admin/testimonials/reorder', orders); load(); } catch { toast.error('Reorder failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Devotee Testimonials</h1>
          <p className="text-xs text-text-muted">Manage devotee reviews and spiritual experiences shown on the homepage</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={load} className="p-2 rounded-lg border border-light-gold-border/20 hover:bg-[#FFF9F2]"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /></button>
          <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-deep-maroon text-white text-sm font-bold flex items-center space-x-2 shadow cursor-pointer">
            <Plus size={16} /><span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-gold" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-[20px] border border-light-gold-border/20 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-primary-gold/30 flex items-center justify-center font-bold text-primary-gold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-deep-maroon text-sm">{item.name}</p>
                    {item.location && <p className="text-xs text-text-muted">{item.location}</p>}
                  </div>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < item.rating ? 'text-primary-gold fill-primary-gold' : 'text-gray-200'} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-text-muted leading-relaxed line-clamp-3 italic">"{item.text}"</p>
              <div className="pt-2 border-t border-light-gold-border/10 flex items-center justify-between">
                <div className="flex space-x-1">
                  <button disabled={idx === 0} onClick={() => handleMove(idx, 'up')} className="p-1 rounded hover:bg-amber-50 disabled:opacity-30"><ArrowUp size={13} /></button>
                  <button disabled={idx === items.length - 1} onClick={() => handleMove(idx, 'down')} className="p-1 rounded hover:bg-amber-50 disabled:opacity-30"><ArrowDown size={13} /></button>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => toggleVisibility(item)} className={`p-1.5 rounded-lg text-xs ${item.is_visible ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{item.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  <button onClick={() => openEdit(item)} className="p-1.5 text-primary-gold hover:bg-amber-50 rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-2 py-12 text-center text-text-muted text-sm">No testimonials yet.</div>}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-light-gold-border/25 shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 bg-[#FFF9F2] border-b border-light-gold-border/20 flex justify-between items-center sticky top-0">
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-amber-100"><X size={18} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">Devotee Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">Location</label>
                    <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Testimonial Text *</label>
                  <textarea rows={4} required value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Rating (1–5)</label>
                  <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none w-24" />
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="testi_visible" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} className="rounded accent-primary-gold" />
                  <label htmlFor="testi_visible" className="text-sm font-semibold cursor-pointer">Visible on website</label>
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
