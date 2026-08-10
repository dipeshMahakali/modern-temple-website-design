import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, RefreshCw, X, Calendar, MapPin, Tag } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

import ImageUploader from '../components/ImageUploader';
import CardImage from '../../components/CardImage';

interface Event {
  id: number;
  title: string;
  description?: string;
  event_date?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  banner_url?: string;
  image_url?: string;
  category?: string;
  is_featured?: boolean;
  is_visible: boolean;
  display_order?: number;
}

const defaultForm = {
  title: '', description: '', start_date: '', event_date: '', end_date: '', location: '', image_url: '', banner_url: '', category: 'festival', is_featured: false, is_visible: true, display_order: 0
};

const getDateStr = (val?: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val.substring(0, 10);
  if (val instanceof Date) return val.toISOString().substring(0, 10);
  return String(val).substring(0, 10);
};

export default function EventsPage() {
  const [items, setItems] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ ...defaultForm });

  const load = async () => {
    setIsLoading(true);
    try { const res = await api.get('/admin/events/'); setItems(res.data); }
    catch { toast.error('Failed to load events'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...defaultForm, display_order: items.length }); setIsModalOpen(true); };
  const openEdit = (item: Event) => {
    setEditing(item);
    const dateVal = getDateStr(item.event_date || item.start_date);
    const endVal = getDateStr(item.end_date);
    const imgUrl = item.banner_url || item.image_url || '';
    setForm({
      title: item.title || '',
      description: item.description || '',
      start_date: dateVal,
      event_date: dateVal,
      end_date: endVal,
      location: item.location || '',
      image_url: imgUrl,
      banner_url: imgUrl,
      category: item.category || 'festival',
      is_featured: item.is_featured || false,
      is_visible: item.is_visible,
      display_order: item.display_order || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description || undefined,
      event_date: form.event_date || form.start_date || new Date().toISOString().substring(0, 10),
      end_date: form.end_date || undefined,
      location: form.location || undefined,
      banner_url: form.image_url || form.banner_url || undefined,
      category: form.category || 'festival',
      is_featured: form.is_featured,
      is_visible: form.is_visible,
    };
    try {
      if (editing) { await api.patch(`/admin/events/${editing.id}`, payload); toast.success('Event updated'); }
      else { await api.post('/admin/events/', payload); toast.success('Event created'); }
      setIsModalOpen(false); load();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    try { await api.delete(`/admin/events/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const toggleVisibility = async (item: Event) => {
    try { await api.patch(`/admin/events/${item.id}`, { is_visible: !item.is_visible }); load(); }
    catch { toast.error('Failed'); }
  };

  const formatDate = (d?: string) => {
    if (!d) return '';
    try { return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d)); }
    catch { return d; }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Temple Events</h1>
          <p className="text-xs text-text-muted">Manage festivals, pujas, ceremonies and special events</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={load} className="p-2 rounded-lg border border-light-gold-border/20 hover:bg-[#FFF9F2]"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /></button>
          <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-deep-maroon text-white text-sm font-bold flex items-center space-x-2 shadow cursor-pointer">
            <Plus size={16} /><span>Add Event</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-gold" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map(item => {
            const displayImage = item.banner_url || item.image_url;
            const displayDate = item.event_date || item.start_date;
            return (
              <div key={item.id} className={`bg-white rounded-[20px] border ${item.is_visible ? 'border-light-gold-border/20' : 'border-rose-100 opacity-70'} shadow-sm overflow-hidden hover:shadow-md transition-all`}>
                {displayImage && (
                  <div className="h-36 overflow-hidden">
                    <CardImage src={displayImage} alt={item.title} className="w-full h-full" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif font-bold text-deep-maroon text-sm leading-snug">{item.title}</h3>
                    {item.is_featured && <span className="px-2 py-0.5 rounded-full bg-primary-gold text-white text-xs font-bold shrink-0 ml-2">Featured</span>}
                  </div>
                  {item.category && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 text-primary-gold text-xs font-medium">
                      <Tag size={10} /><span>{item.category}</span>
                    </span>
                  )}
                  <div className="space-y-1 text-xs text-text-muted">
                    <div className="flex items-center space-x-1"><Calendar size={11} /><span>{formatDate(displayDate)}{item.end_date ? ` – ${formatDate(item.end_date)}` : ''}</span></div>
                    {item.location && <div className="flex items-center space-x-1"><MapPin size={11} /><span>{item.location}</span></div>}
                  </div>
                  <div className="pt-2 border-t border-light-gold-border/10 flex justify-between items-center">
                    <button onClick={() => toggleVisibility(item)} className={`p-1.5 rounded-lg text-xs ${item.is_visible ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{item.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                    <div className="flex space-x-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-primary-gold hover:bg-amber-50 rounded-lg"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <div className="col-span-3 py-12 text-center text-text-muted text-sm">No events yet. Click "Add Event" to create one.</div>}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-light-gold-border/25 shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 bg-[#FFF9F2] border-b border-light-gold-border/20 flex justify-between items-center sticky top-0">
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">{editing ? 'Edit Event' : 'Add Event'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-amber-100"><X size={18} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Event Title *</label>
                  <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">Start Date *</label>
                    <input type="date" required value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">End Date</label>
                    <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">Category</label>
                    <input type="text" placeholder="e.g. Festival, Puja" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">Location</label>
                    <input type="text" placeholder="e.g. Main Mandap" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                </div>
                <ImageUploader
                  label="Event Banner Image"
                  folder="events"
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  placeholder="/assets/gallery-festival.png or upload image"
                />
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
                </div>
                <div className="flex space-x-6 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="rounded accent-primary-gold" />
                    <span className="text-sm font-semibold">Featured Event</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} className="rounded accent-primary-gold" />
                    <span className="text-sm font-semibold">Visible on Website</span>
                  </label>
                </div>
                <div className="pt-4 border-t border-light-gold-border/10 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-light-gold-border/30 hover:bg-[#FFF9F2] text-sm cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-deep-maroon text-white font-bold text-sm shadow-md cursor-pointer">Save Event</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
