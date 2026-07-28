/**
 * Page Management
 * Table with publish/draft/archive/toggle actions + Add/Edit modals linked to FastAPI backend
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Archive, FileText, Plus, RefreshCw, ToggleLeft, ToggleRight, Trash2, Edit2, CheckCircle, Clock, XCircle, Loader2, Save, X } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface Page {
  id: number;
  slug: string;
  title: string;
  description?: string;
  status: string;
  is_enabled: boolean;
  display_order: number;
  show_in_navbar: boolean;
  show_in_footer: boolean;
  show_in_sitemap: boolean;
}

const statusConfig = {
  published: { label: 'Published', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', icon: <CheckCircle size={12} /> },
  draft: { label: 'Draft', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: <Clock size={12} /> },
  archived: { label: 'Archived', color: '#6B7280', bg: 'rgba(107,114,128,0.1)', icon: <Archive size={12} /> },
};

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'published',
    is_enabled: true,
    show_in_navbar: true,
    show_in_footer: true,
    show_in_sitemap: true,
    display_order: 0
  });

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/pages/');
      setPages(res.data);
    } catch (err: any) {
      toast.error('Failed to fetch pages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenModal = (page: Page | null = null) => {
    if (page) {
      setEditingPage(page);
      setForm({
        title: page.title,
        slug: page.slug,
        description: page.description || '',
        status: page.status,
        is_enabled: page.is_enabled,
        show_in_navbar: page.show_in_navbar,
        show_in_footer: page.show_in_footer,
        show_in_sitemap: page.show_in_sitemap,
        display_order: page.display_order
      });
    } else {
      setEditingPage(null);
      setForm({
        title: '',
        slug: '',
        description: '',
        status: 'published',
        is_enabled: true,
        show_in_navbar: true,
        show_in_footer: true,
        show_in_sitemap: true,
        display_order: pages.length
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPage) {
        const res = await api.patch(`/admin/pages/${editingPage.id}`, form);
        toast.success('Page updated successfully!');
      } else {
        const res = await api.post('/admin/pages/', form);
        toast.success('Page created successfully!');
      }
      setIsModalOpen(false);
      fetchPages();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to save page';
      toast.error(msg);
    }
  };

  const toggleEnabled = async (page: Page) => {
    try {
      const res = await api.post(`/admin/pages/${page.id}/toggle-enabled`);
      setPages(p => p.map(pg => pg.id === page.id ? { ...pg, is_enabled: res.data.is_enabled } : pg));
      toast.success('Page visibility updated');
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const setStatus = async (page: Page, status: string) => {
    try {
      let res;
      if (status === 'published') {
        res = await api.post(`/admin/pages/${page.id}/publish`);
      } else if (status === 'draft') {
        res = await api.post(`/admin/pages/${page.id}/draft`);
      } else {
        res = await api.post(`/admin/pages/${page.id}/archive`);
      }
      setPages(p => p.map(pg => pg.id === page.id ? { ...pg, status: res.data.status, is_enabled: res.data.is_enabled } : pg));
      toast.success(`Page set to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this page? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/pages/${id}`);
      toast.success('Page deleted successfully');
      fetchPages();
    } catch (err) {
      toast.error('Failed to delete page');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Page Management</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(45,45,45,0.5)', fontFamily: 'Inter, sans-serif' }}>
            Control visibility and status of all website pages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchPages} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', fontFamily: 'Inter, sans-serif' }}>
            <RefreshCw size={14} />
            Refresh
          </button>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B89020)', color: '#1A0A0A', fontFamily: 'Inter, sans-serif' }}>
            <Plus size={14} />
            Add Page
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(212,175,55,0.2)' }}>
          <span style={{ color: '#D4AF37', fontSize: 12 }}>ℹ</span>
        </div>
        <p className="text-sm" style={{ color: 'rgba(45,45,45,0.7)', fontFamily: 'Inter, sans-serif' }}>
          Toggling a page OFF instantly hides it from navigation, footer, sitemap, and returns 404. No code changes needed.
        </p>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#D4AF37' }} />
          <p className="text-sm text-gray-500">Loading pages...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                  {['Page Title', 'Slug', 'Status', 'Enabled', 'Navbar', 'Footer', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'rgba(45,45,45,0.4)', fontFamily: 'Inter, sans-serif', background: 'rgba(248,244,238,0.5)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pages.map((page, i) => {
                  const cfg = statusConfig[page.status as keyof typeof statusConfig] || statusConfig.draft;
                  return (
                    <tr key={page.id}
                      style={{ borderBottom: i < pages.length - 1 ? '1px solid rgba(212,175,55,0.07)' : 'none' }}
                      className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(212,175,55,0.1)' }}>
                            <FileText size={14} style={{ color: '#D4AF37' }} />
                          </div>
                          <span className="font-medium text-sm" style={{ color: '#2D2D2D', fontFamily: 'Inter, sans-serif' }}>
                            {page.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <code className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(45,45,45,0.06)', color: '#6B1E1E', fontFamily: 'monospace' }}>
                          /{page.slug}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.icon}
                          <span className="text-xs font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{cfg.label}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => toggleEnabled(page)} className="transition-transform hover:scale-110">
                          {page.is_enabled
                            ? <ToggleRight size={24} style={{ color: '#22C55E' }} />
                            : <ToggleLeft size={24} style={{ color: '#6B7280' }} />}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium ${page.show_in_navbar ? 'text-green-600' : 'text-gray-400'}`}>
                          {page.show_in_navbar ? '✓' : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium ${page.show_in_footer ? 'text-green-600' : 'text-gray-400'}`}>
                          {page.show_in_footer ? '✓' : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {page.status !== 'published' && (
                            <button onClick={() => setStatus(page, 'published')} title="Publish"
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: '#22C55E' }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34,197,94,0.1)')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                              <CheckCircle size={14} />
                            </button>
                          )}
                          {page.status !== 'draft' && (
                            <button onClick={() => setStatus(page, 'draft')} title="Set to Draft"
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: '#F59E0B' }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,158,11,0.1)')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                              <Clock size={14} />
                            </button>
                          )}
                          <button onClick={() => handleOpenModal(page)} title="Edit" className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#D4AF37' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                            <Edit2 size={14} />
                          </button>
                          <button title="Archive" onClick={() => setStatus(page, 'archived')}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#6B7280' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(107,114,128,0.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                            <Archive size={14} />
                          </button>
                          <button title="Delete" onClick={() => handleDelete(page.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#EF4444' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border"
              style={{ background: '#FFF9F2', borderColor: 'rgba(212,175,55,0.3)' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-amber-800/10">
                <h3 className="font-bold text-lg" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
                  {editingPage ? 'Edit Page details' : 'Create New Page'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Page Title *</label>
                    <input
                      required
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Donations"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
                      style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Slug *</label>
                    <input
                      required
                      value={form.slug}
                      onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') }))}
                      placeholder="e.g. donate"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
                      style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Short summary of page content..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border resize-none transition-all"
                    style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
                      style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Display Order</label>
                    <input
                      type="number"
                      value={form.display_order}
                      onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
                      style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-amber-800/10">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_enabled}
                      onChange={e => setForm(f => ({ ...f, is_enabled: e.target.checked }))}
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Page Enabled (Visible to public)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.show_in_navbar}
                      onChange={e => setForm(f => ({ ...f, show_in_navbar: e.target.checked }))}
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span className="text-sm text-gray-600">Show in main navigation menu</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.show_in_footer}
                      onChange={e => setForm(f => ({ ...f, show_in_footer: e.target.checked }))}
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span className="text-sm text-gray-600">Show in page footer</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.show_in_sitemap}
                      onChange={e => setForm(f => ({ ...f, show_in_sitemap: e.target.checked }))}
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span className="text-sm text-gray-600">Include in dynamic sitemap</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-amber-800/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium border text-gray-600 transition-colors hover:bg-gray-55"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #B89020)', color: '#1A0A0A' }}
                  >
                    <Save size={14} />
                    Save Page
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
