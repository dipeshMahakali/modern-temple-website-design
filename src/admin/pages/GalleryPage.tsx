/**
 * Gallery Management Page
 * Grid view with upload, visibility, delete, categories connected to FastAPI backend APIs
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Eye, EyeOff, Trash2, Star, StarOff, Filter, X, Image as ImageIcon, Plus, Loader2, Save } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/image';
import CardImage from '../../components/CardImage';

const CATEGORIES = ['All', 'Temple', 'Festival', 'Nature', 'Pilgrims', 'Architecture'];
const UPLOAD_CATEGORIES = ['Temple', 'Festival', 'Nature', 'Pilgrims', 'Architecture', 'General'];

interface GalleryItem {
  id: number;
  category: string;
  url: string;
  compressed_url?: string;
  alt_text?: string;
  caption?: string;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Upload Form details
  const [form, setForm] = useState({
    category: 'Temple',
    alt_text: '',
    is_featured: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/gallery/');
      if (res.data && Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch {
      toast.error('Failed to load gallery items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const currentItems = Array.isArray(items) ? items : [];
  const filtered = selectedCategory === 'All' ? currentItems : currentItems.filter(i => i.category.toLowerCase() === selectedCategory.toLowerCase());

  const toggleVisibility = async (item: GalleryItem) => {
    try {
      const res = await api.post(`/admin/gallery/${item.id}/toggle-visibility`);
      setItems(i => i.map(it => it.id === item.id ? { ...it, is_visible: res.data.is_visible } : it));
      toast.success('Visibility updated');
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      const res = await api.patch(`/admin/gallery/${item.id}`, { is_featured: !item.is_featured });
      setItems(i => i.map(it => it.id === item.id ? { ...it, is_featured: res.data.is_featured } : it));
      toast.success('Featured status updated');
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const deleteItem = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this photo?')) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      toast.success('Image deleted');
      fetchItems();
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setIsModalOpen(true);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', form.category);
    formData.append('alt_text', form.alt_text);
    formData.append('is_featured', form.is_featured.toString());

    try {
      await api.post('/admin/gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Photo uploaded successfully!');
      setIsModalOpen(false);
      setSelectedFile(null);
      setForm({ category: 'Temple', alt_text: '', is_featured: false });
      fetchItems();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to upload photo';
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) {
      setSelectedFile(files[0]);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Photo Gallery</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(45,45,45,0.5)', fontFamily: 'Inter, sans-serif' }}>
            {currentItems.length} images · {currentItems.filter(i => i.is_visible).length} visible · {currentItems.filter(i => i.is_featured).length} featured
          </p>
        </div>
        <button onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B89020)', color: '#1A0A0A', fontFamily: 'Inter, sans-serif' }}>
          <Upload size={14} />
          Upload Images
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all"
        style={{
          borderColor: 'rgba(212,175,55,0.25)',
          background: 'rgba(248,244,238,0.5)',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.1)' }}>
            <ImageIcon size={20} style={{ color: '#D4AF37' }} />
          </div>
          <p className="font-medium text-sm" style={{ color: '#2D2D2D', fontFamily: 'Inter, sans-serif' }}>
            Drop image here or click to upload
          </p>
          <p className="text-xs" style={{ color: 'rgba(45,45,45,0.4)', fontFamily: 'Inter, sans-serif' }}>
            JPEG, PNG, WebP · Max 10MB per file
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} style={{ color: 'rgba(45,45,45,0.4)' }} />
        {CATEGORIES.map(cat => (
          <button key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: selectedCategory === cat ? 'linear-gradient(135deg, #D4AF37, #B89020)' : 'rgba(212,175,55,0.08)',
              color: selectedCategory === cat ? '#1A0A0A' : 'rgba(45,45,45,0.6)',
              fontFamily: 'Inter, sans-serif',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="min-h-[250px] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#D4AF37' }} />
          <p className="text-sm text-gray-500">Loading gallery items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="relative rounded-xl overflow-hidden group aspect-square border"
              style={{
                borderColor: 'rgba(212,175,55,0.15)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                opacity: item.is_visible ? 1 : 0.5,
              }}
            >
              {/* Image */}
              <div className="absolute inset-0">
                <CardImage
                  src={getImageUrl(item.url)}
                  alt={item.alt_text || ''}
                  className="w-full h-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/assets/hero-bg.png'; }}
                />
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                {item.is_featured && (
                  <div className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: '#D4AF37', color: '#1A0A0A', fontSize: 9 }}>
                    ★
                  </div>
                )}
                {!item.is_visible && (
                  <div className="px-1.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(239,68,68,0.8)', color: '#FFF', fontSize: 9 }}>
                    Hidden
                  </div>
                )}
              </div>

              {/* Category badge */}
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.8)', fontSize: 9, fontFamily: 'Inter, sans-serif' }}>
                  {item.category}
                </span>
              </div>

              {/* Action Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.5)' }}>
                <button onClick={() => toggleFeatured(item)} title={item.is_featured ? 'Unfeature' : 'Feature'}
                  className="p-2 rounded-xl backdrop-blur-sm transition-colors"
                  style={{ background: 'rgba(212,175,55,0.3)', color: item.is_featured ? '#D4AF37' : '#FFF' }}>
                  {item.is_featured ? <Star size={14} fill="#D4AF37" /> : <StarOff size={14} />}
                </button>
                <button onClick={() => toggleVisibility(item)} title={item.is_visible ? 'Hide' : 'Show'}
                  className="p-2 rounded-xl backdrop-blur-sm transition-colors"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#FFF' }}>
                  {item.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => deleteItem(item.id)} title="Delete"
                  className="p-2 rounded-xl backdrop-blur-sm transition-colors"
                  style={{ background: 'rgba(239,68,68,0.3)', color: '#FF9595' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'rgba(45,45,45,0.4)', fontFamily: 'Inter, sans-serif' }}>
          <ImageIcon size={32} className="mx-auto mb-3 opacity-30" />
          <p>No images in this category</p>
        </div>
      )}

      {/* Upload Details Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border"
              style={{ background: '#FFF9F2', borderColor: 'rgba(212,175,55,0.3)' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-amber-800/10">
                <h3 className="font-bold text-lg" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
                  Image Upload details
                </h3>
                <button onClick={() => { setIsModalOpen(false); setSelectedFile(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                {selectedFile && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-800/5">
                    <ImageIcon className="w-8 h-8 text-primary-gold" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-gray-800">{selectedFile.name}</p>
                      <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
                    style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
                  >
                    {UPLOAD_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-gray-500">Alt Text / Description</label>
                  <input
                    value={form.alt_text}
                    onChange={e => setForm(f => ({ ...f, alt_text: e.target.value }))}
                    placeholder="Describe this photo for accessibility..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
                    style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#FFFFFF', color: '#2D2D2D' }}
                  />
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                    className="w-4 h-4 accent-amber-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Feature this photo on the homepage</span>
                </label>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-amber-800/10">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); setSelectedFile(null); }}
                    className="px-4 py-2 rounded-xl text-sm font-medium border text-gray-600 hover:bg-gray-55"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #B89020)', color: '#1A0A0A' }}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Upload
                      </>
                    )}
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
