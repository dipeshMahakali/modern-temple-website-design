import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Edit2, ArrowUp, ArrowDown, Save, X, Loader2, RefreshCw } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface Section {
  id: number;
  slug: string;
  title: string;
  is_visible: boolean;
  display_order: number;
  background?: string;
  animation?: string;
  spacing?: string;
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    background: '',
    animation: '',
    spacing: '',
  });

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/sections/');
      setSections(res.data.sort((a: Section, b: Section) => a.display_order - b.display_order));
    } catch (err) {
      toast.error('Failed to fetch sections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggleVisibility = async (section: Section) => {
    try {
      await api.post(`/admin/sections/${section.id}/toggle-visibility`);
      toast.success(`${section.title} visibility updated`);
      fetchSections();
    } catch (err) {
      toast.error('Failed to toggle visibility');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentSection = sections[index];
    const targetSection = sections[targetIndex];

    const orders = {
      [currentSection.id]: targetSection.display_order,
      [targetSection.id]: currentSection.display_order,
    };

    try {
      await api.post('/admin/sections/reorder', orders);
      toast.success('Sections reordered');
      fetchSections();
    } catch (err) {
      toast.error('Failed to reorder sections');
    }
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setForm({
      title: section.title,
      background: section.background || '',
      animation: section.animation || '',
      spacing: section.spacing || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      await api.patch(`/admin/sections/${editingSection.id}`, form);
      toast.success('Section styling updated successfully');
      setIsModalOpen(false);
      fetchSections();
    } catch (err) {
      toast.error('Failed to update section');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
            Sections Management
          </h1>
          <p className="text-xs text-text-muted">
            Configure backgrounds, layouts, spacing, animations, and visibility of main landing page sections.
          </p>
        </div>
        <button
          onClick={fetchSections}
          className="p-2 rounded-lg border border-light-gold-border/20 text-[#2D2D2D] hover:bg-[#FFF9F2] transition-colors"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary-gold" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-light-gold-border/20 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9F2] text-xs font-bold uppercase tracking-wider text-text-dark/70 border-b border-light-gold-border/20">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Section Name</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Background</th>
                  <th className="py-4 px-6">Padding/Spacing</th>
                  <th className="py-4 px-6">Animation</th>
                  <th className="py-4 px-6">Visibility</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gold-border/10 text-sm">
                {sections.map((sec, idx) => (
                  <tr key={sec.id} className="hover:bg-amber-50/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          className="p-1 rounded hover:bg-amber-50 disabled:opacity-30 text-text-dark"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          disabled={idx === sections.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="p-1 rounded hover:bg-amber-50 disabled:opacity-30 text-text-dark"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <span className="text-xs text-text-muted font-bold ml-1">{sec.display_order}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-text-dark">{sec.title}</td>
                    <td className="py-4 px-6 font-mono text-xs text-text-muted">{sec.slug}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded text-xs font-mono bg-stone-100 text-stone-700 truncate block max-w-[120px]">
                        {sec.background || 'None'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-text-muted">{sec.spacing || 'Default'}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-600 font-medium">
                        {sec.animation || 'None'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleVisibility(sec)}
                        className={`inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                          sec.is_visible
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {sec.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{sec.is_visible ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleEdit(sec)}
                        className="p-2 text-primary-gold hover:bg-amber-50 rounded-lg transition-colors inline-flex items-center space-x-1"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[28px] border border-light-gold-border/25 shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 bg-[#FFF9F2] border-b border-light-gold-border/20 flex justify-between items-center">
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">
                  Configure Section styling
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-amber-100 text-text-muted transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Section Display Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Background Styling CSS</label>
                  <input
                    type="text"
                    placeholder="e.g. #FFF9F2 or linear-gradient(...)"
                    value={form.background}
                    onChange={(e) => setForm({ ...form, background: e.target.value })}
                    className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Padding / Margin Spacing CSS</label>
                  <input
                    type="text"
                    placeholder="e.g. 5rem 0 or 80px 0"
                    value={form.spacing}
                    onChange={(e) => setForm({ ...form, spacing: e.target.value })}
                    className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Animation CSS Class Name</label>
                  <input
                    type="text"
                    placeholder="e.g. animate-fade-in or duration-500"
                    value={form.animation}
                    onChange={(e) => setForm({ ...form, animation: e.target.value })}
                    className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-light-gold-border/10 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-light-gold-border/30 hover:bg-[#FFF9F2] text-sm text-[#2D2D2D] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-deep-maroon text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
