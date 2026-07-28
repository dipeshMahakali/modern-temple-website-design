/**
 * Timeline Management Page
 * CRUD for Royal Chronicle entries connected to FastAPI backend APIs
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, Save, X, Clock, Loader2 } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface Entry {
  id: number;
  year: string;
  period: string;
  title: string;
  description: string;
  is_visible: boolean;
  display_order: number;
  image_url?: string;
  quote?: string;
}

interface EntryFormProps {
  entry?: Entry;
  onSave: (data: Partial<Entry>) => Promise<void>;
  onCancel: () => void;
}

function EntryForm({ entry, onSave, onCancel }: EntryFormProps) {
  const [form, setForm] = useState({
    year: entry?.year || '',
    period: entry?.period || '',
    title: entry?.title || '',
    description: entry?.description || '',
    image_url: entry?.image_url || '',
    quote: entry?.quote || '',
    is_visible: entry?.is_visible ?? true,
    display_order: entry?.display_order ?? 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.year || !form.title || !form.description) {
      toast.error('Year, Title, and Description are required fields.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(form);
    } catch {
      // toast shown in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 space-y-4 border"
      style={{ background: '#FFF9F2', borderColor: 'rgba(212,175,55,0.25)' }}
    >
      <h3 className="font-semibold text-base" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
        {entry ? 'Edit Timeline Entry' : 'New Timeline Entry'}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Year / Era *</label>
          <input
            required
            value={form.year}
            onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
            placeholder="e.g. 1484 CE"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
            style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Period Label</label>
          <input
            value={form.period}
            onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
            placeholder="e.g. Mughal Era"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
            style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Title *</label>
        <input
          required
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Entry title"
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
          style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Description *</label>
        <textarea
          required
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={4}
          placeholder="Historical description..."
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border resize-none transition-all"
          style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Image URL</label>
          <input
            value={form.image_url}
            onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
            placeholder="/uploads/timeline/..."
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
            style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Pull Quote</label>
          <input
            value={form.quote}
            onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
            placeholder="Historic quote..."
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
            style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-amber-800/10">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_visible}
            onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))}
            className="w-4 h-4 accent-amber-500"
          />
          <span className="text-sm font-medium text-gray-700">Visible on website</span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors border text-gray-600 hover:bg-gray-55"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B89020)', color: '#1A0A0A' }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Entry
              </>
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
}

export default function TimelinePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/timeline/');
      // Sort by display order
      const sorted = res.data.sort((a: Entry, b: Entry) => a.display_order - b.display_order);
      setEntries(sorted);
    } catch {
      toast.error('Failed to load timeline entries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const toggleVisibility = async (id: number) => {
    try {
      const res = await api.post(`/admin/timeline/${id}/toggle-visibility`);
      setEntries(e => e.map(en => en.id === id ? { ...en, is_visible: res.data.is_visible } : en));
      toast.success('Visibility updated');
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleSave = async (data: Partial<Entry>) => {
    try {
      if (editingId) {
        await api.patch(`/admin/timeline/${editingId}`, data);
        toast.success('Entry updated!');
        setEditingId(null);
      } else {
        await api.post('/admin/timeline/', { ...data, display_order: entries.length });
        toast.success('Entry created!');
        setShowForm(false);
      }
      fetchEntries();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to save entry';
      toast.error(msg);
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this chronicle entry?')) return;
    try {
      await api.delete(`/admin/timeline/${id}`);
      toast.success('Entry deleted');
      fetchEntries();
    } catch {
      toast.error('Failed to delete entry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Royal Chronicle Timeline</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(45,45,45,0.5)', fontFamily: 'Inter, sans-serif' }}>
            Manage historical timeline entries for the temple chronicle
          </p>
        </div>
        <button onClick={() => { setShowForm(s => !s); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B89020)', color: '#1A0A0A', fontFamily: 'Inter, sans-serif' }}>
          <Plus size={14} />
          Add Entry
        </button>
      </div>

      <AnimatePresence>
        {showForm && <EntryForm onSave={handleSave} onCancel={() => setShowForm(false)} />}
      </AnimatePresence>

      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#D4AF37' }} />
          <p className="text-sm text-gray-500">Loading chronicle entries...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <AnimatePresence key={entry.id}>
              {editingId === entry.id ? (
                <EntryForm entry={entry} onSave={handleSave} onCancel={() => setEditingId(null)} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-4 p-5 rounded-2xl group transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(212,175,55,0.12)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    opacity: entry.is_visible ? 1 : 0.6,
                  }}
                >
                  <div className="cursor-move mt-1" style={{ color: 'rgba(45,45,45,0.2)' }}>
                    <GripVertical size={16} />
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <Clock size={16} style={{ color: '#D4AF37' }} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(107,30,30,0.1)', color: '#6B1E1E', fontFamily: 'Inter, sans-serif' }}>
                        {entry.year}
                      </span>
                      {entry.period && (
                        <span className="text-xs" style={{ color: 'rgba(45,45,45,0.4)', fontFamily: 'Inter, sans-serif' }}>
                          {entry.period}
                        </span>
                      )}
                      {!entry.is_visible && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                          Hidden
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
                      {entry.title}
                    </h4>
                    <p className="text-sm line-clamp-2 mb-2" style={{ color: 'rgba(45,45,45,0.6)', fontFamily: 'Inter, sans-serif' }}>
                      {entry.description}
                    </p>
                    {entry.image_url && (
                      <div className="mt-2 relative rounded-lg overflow-hidden w-24 h-16 border bg-amber-50">
                        <img src={entry.image_url} alt={entry.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleVisibility(entry.id)} title={entry.is_visible ? 'Hide' : 'Show'}
                      className="p-2 rounded-xl transition-colors"
                      style={{ color: entry.is_visible ? '#22C55E' : '#6B7280' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      {entry.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button onClick={() => { setEditingId(entry.id); setShowForm(false); }} title="Edit"
                      className="p-2 rounded-xl transition-colors"
                      style={{ color: '#D4AF37' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <Edit2 size={15} />
                    </button>
                    <button title="Delete" onClick={() => handleDelete(entry.id)}
                      className="p-2 rounded-xl transition-colors"
                      style={{ color: '#EF4444' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
          {entries.length === 0 && (
            <p className="text-center py-16 text-sm text-gray-500">No chronicle entries found. Create the first one!</p>
          )}
        </div>
      )}
    </div>
  );
}
