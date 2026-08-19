import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, RefreshCw, X, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import CardImage from '../../components/CardImage';

interface Trustee {
  id: number;
  name: string;
  title: string;
  role?: string;
  photo_url?: string;
  bio?: string;
  is_visible: boolean;
  display_order: number;
}

const defaultForm = { name: '', title: '', role: '', photo_url: '', bio: '', is_visible: true, display_order: 0 };

export default function TrusteesPage() {
  const [items, setItems] = useState<Trustee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Trustee | null>(null);
  const [form, setForm] = useState({ ...defaultForm });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/trustees/');
      setItems(res.data);
    } catch { toast.error('Failed to load trustees'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...defaultForm, display_order: items.length });
    setIsModalOpen(true);
  };

  const openEdit = (item: Trustee) => {
    setEditing(item);
    setForm({ name: item.name, title: item.title, role: item.role || '', photo_url: item.photo_url || '', bio: item.bio || '', is_visible: item.is_visible, display_order: item.display_order });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await api.patch(`/admin/trustees/${editing.id}`, form); toast.success('Trustee updated'); }
      else { await api.post('/admin/trustees/', form); toast.success('Trustee created'); }
      setIsModalOpen(false); load();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this trustee?')) return;
    try { await api.delete(`/admin/trustees/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const toggleVisibility = async (item: Trustee) => {
    try { await api.post(`/admin/trustees/${item.id}/toggle-visibility`); load(); }
    catch { toast.error('Failed'); }
  };

  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === items.length - 1) return;
    const target = dir === 'up' ? idx - 1 : idx + 1;
    const orders: Record<number, number> = {
      [items[idx].id]: items[target].display_order,
      [items[target].id]: items[idx].display_order,
    };
    try { await api.post('/admin/trustees/reorder', orders); load(); } catch { toast.error('Reorder failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Trust Board Members</h1>
          <p className="text-xs text-text-muted">Manage trustee profiles shown in the "Our Trustees" section</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={load} className="p-2 rounded-lg border border-light-gold-border/20 hover:bg-[#FFF9F2] transition-colors"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /></button>
          <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-deep-maroon text-white text-sm font-bold flex items-center space-x-2 shadow hover:shadow-md transition-all cursor-pointer">
            <Plus size={16} /><span>Add Trustee</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-gold" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-[20px] border border-light-gold-border/20 p-5 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-amber-50 border-2 border-primary-gold/30 shrink-0 relative">
                  {item.photo_url ? (
                    <CardImage src={item.photo_url} alt={item.name} className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-gold font-bold text-xl">{item.name.charAt(0)}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-deep-maroon text-base">{item.name}</h3>
                  <p className="text-xs text-primary-gold font-semibold">{item.title}</p>
                  {item.role && <p className="text-xs text-text-muted">{item.role}</p>}
                </div>
              </div>
              {item.bio && <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{item.bio}</p>}
              <div className="pt-2 border-t border-light-gold-border/10 flex items-center justify-between">
                <div className="flex space-x-1">
                  <button disabled={idx === 0} onClick={() => handleMove(idx, 'up')} className="p-1 rounded hover:bg-amber-50 disabled:opacity-30 text-text-muted"><ArrowUp size={13} /></button>
                  <button disabled={idx === items.length - 1} onClick={() => handleMove(idx, 'down')} className="p-1 rounded hover:bg-amber-50 disabled:opacity-30 text-text-muted"><ArrowDown size={13} /></button>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => toggleVisibility(item)} className={`p-1.5 rounded-lg text-xs transition-all ${item.is_visible ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{item.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  <button onClick={() => openEdit(item)} className="p-1.5 text-primary-gold hover:bg-amber-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-3 py-12 text-center text-text-muted text-sm">No trustees found. Click "Add Trustee" to create one.</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-light-gold-border/25 shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 bg-[#FFF9F2] border-b border-light-gold-border/20 flex justify-between items-center sticky top-0">
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">{editing ? 'Edit Trustee' : 'Add Trustee'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-amber-100 text-text-muted"><X size={18} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                {[
                  { field: 'name', label: 'Full Name *', required: true },
                  { field: 'title', label: 'Title / Designation *', required: true },
                  { field: 'role', label: 'Role Description', required: false },
                ].map(({ field, label, required }) => (
                  <div key={field} className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">{label}</label>
                    <input type="text" required={required} value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                      className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all" />
                  </div>
                ))}
                <ImageUploader
                  label="Trustee Photo"
                  folder="trustees"
                  value={form.photo_url}
                  onChange={(url) => setForm({ ...form, photo_url: url })}
                  placeholder="Upload trustee photo"
                />
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Biography</label>
                  <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                    className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all resize-none" />
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="trustee_visible" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} className="rounded accent-primary-gold" />
                  <label htmlFor="trustee_visible" className="text-sm font-semibold text-text-dark cursor-pointer">Visible on website</label>
                </div>
                <div className="pt-4 border-t border-light-gold-border/10 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-light-gold-border/30 hover:bg-[#FFF9F2] text-sm text-[#2D2D2D] cursor-pointer">Cancel</button>
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
