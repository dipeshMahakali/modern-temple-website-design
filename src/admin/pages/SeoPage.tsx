import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Save, Edit2, Globe, Sparkles } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface SeoEntry {
  page_slug: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  robots?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

export default function SeoPage() {
  const [entries, setEntries] = useState<SeoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Partial<SeoEntry> | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/seo/');
      setEntries(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedSlug(res.data[0].page_slug);
        setCurrentEntry(res.data[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load SEO metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlug = (slug: string) => {
    setSelectedSlug(slug);
    const found = entries.find(e => e.page_slug === slug);
    setCurrentEntry(found || { page_slug: slug, robots: 'index, follow' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlug || !currentEntry) return;

    try {
      const res = await api.put(`/admin/seo/${selectedSlug}`, currentEntry);
      setEntries(entries.map(e => e.page_slug === selectedSlug ? res.data : e));
      toast.success(`SEO updated for /${selectedSlug}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update SEO parameters');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#6B1F1F]">SEO Management</h1>
        <p className="text-sm text-[#777777]">Optimize search engine presence, meta tags, and open graph data for every page.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#C8A45A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading search configurations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Pages List */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gold-border/20 shadow-lg p-4 space-y-2">
            <h3 className="text-sm font-bold text-[#6B1F1F] uppercase tracking-wider px-2 mb-3">Pages</h3>
            <div className="space-y-1">
              {['home', 'about', 'history', 'darshan', 'events', 'gallery', 'trust', 'donate', 'instructions', 'contact'].map(slug => {
                const isSelected = selectedSlug === slug;
                const hasConfig = entries.some(e => e.page_slug === slug);
                return (
                  <button
                    key={slug}
                    onClick={() => handleSelectSlug(slug)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm transition-all ${
                      isSelected
                        ? 'bg-[#6B1F1F] text-white shadow-md font-semibold'
                        : 'hover:bg-[#FFFDF8] text-gray-700'
                    }`}
                  >
                    <span className="capitalize">{slug}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : hasConfig
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-gray-50 text-gray-400 border border-gray-100'
                    }`}>
                      {hasConfig ? 'Configured' : 'Default'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: SEO Configuration Form */}
          <div className="lg:col-span-2">
            {currentEntry ? (
              <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gold-border/20 shadow-xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#6B1F1F] capitalize">
                      /{selectedSlug} Metadata
                    </h3>
                    <p className="text-xs text-gray-500">Configure global metadata tags for the search indexes.</p>
                  </div>
                  <Globe size={18} className="text-[#C8A45A]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={currentEntry.meta_title || ''}
                      onChange={e => setCurrentEntry({ ...currentEntry, meta_title: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                      placeholder="Enter optimized meta title (recommended: < 60 characters)"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Meta Description</label>
                    <textarea
                      value={currentEntry.meta_description || ''}
                      onChange={e => setCurrentEntry({ ...currentEntry, meta_description: e.target.value })}
                      rows={3}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                      placeholder="Enter optimized description (recommended: 150-160 characters)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Keywords</label>
                    <input
                      type="text"
                      value={currentEntry.keywords || ''}
                      onChange={e => setCurrentEntry({ ...currentEntry, keywords: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                      placeholder="comma, separated, tags"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Robots Tags</label>
                    <input
                      type="text"
                      value={currentEntry.robots || 'index, follow'}
                      onChange={e => setCurrentEntry({ ...currentEntry, robots: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                      placeholder="index, follow"
                    />
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                    <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-[#6B1F1F] uppercase tracking-wider">
                      <Sparkles size={14} className="text-[#C8A45A]" />
                      <span>Social Sharing (Open Graph)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">OG Title</label>
                    <input
                      type="text"
                      value={currentEntry.og_title || ''}
                      onChange={e => setCurrentEntry({ ...currentEntry, og_title: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                      placeholder="Title for Facebook/Twitter share"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">OG Image URL</label>
                    <input
                      type="text"
                      value={currentEntry.og_image || ''}
                      onChange={e => setCurrentEntry({ ...currentEntry, og_image: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                      placeholder="https://example.com/social-preview.jpg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">OG Description</label>
                    <textarea
                      value={currentEntry.og_description || ''}
                      onChange={e => setCurrentEntry({ ...currentEntry, og_description: e.target.value })}
                      rows={2}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                      placeholder="Short share summary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-[#6B1F1F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#8B2F2F] transition-all shadow-md"
                  >
                    <Save size={16} />
                    Save SEO Tags
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-2xl border border-gold-border/20 shadow-md p-12 text-center text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a page from the list to manage SEO meta parameters.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
