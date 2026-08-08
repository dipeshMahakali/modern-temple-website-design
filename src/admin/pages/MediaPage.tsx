import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FolderOpen, Trash2, Copy, Check, Search, Filter, Loader2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface MediaItem {
  id: number;
  url: string;
  filename: string;
  original_filename: string;
  mimetype: string;
  size_bytes: number;
  folder: string;
  created_at: string;
}

const FOLDERS = ['All', 'general', 'hero', 'gallery', 'events', 'timeline', 'trustees', 'temple'];

export default function MediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [uploadFolder, setUploadFolder] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/media/');
      setMediaList(res.data);
    } catch {
      toast.error('Failed to load media library');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const resolveUrl = (urlStr: string) => {
    if (!urlStr) return '';
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) return urlStr;
    if (urlStr.startsWith('/uploads/')) {
      const apiBase = import.meta.env.VITE_API_URL;
      if (apiBase) {
        const rootUrl = apiBase.replace(/\/api\/v1\/?$/, '');
        return `${rootUrl}${urlStr}`;
      }
    }
    return urlStr;
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (const file of fileList) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/') && file.type !== 'application/pdf') {
        toast.error(`Skipped ${file.name}: unsupported type.`);
        continue;
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', uploadFolder);

      try {
        await api.post('/admin/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        successCount++;
      } catch (err: any) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)!`);
      fetchMedia();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const copyUrl = (item: MediaItem) => {
    const fullUrl = resolveUrl(item.url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    toast.success('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteMedia = async (id: number) => {
    if (!window.confirm('Delete this file permanently from server storage?')) return;
    try {
      await api.delete(`/admin/media/${id}`);
      toast.success('Media file deleted.');
      fetchMedia();
    } catch {
      toast.error('Failed to delete media file.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredMedia = mediaList.filter((item) => {
    const matchesFolder = selectedFolder === 'All' || item.folder.toLowerCase() === selectedFolder.toLowerCase();
    const matchesSearch = !searchQuery || item.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) || item.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
            <FolderOpen size={24} className="text-primary-gold" />
            <span>Media Library</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Browse, upload, and manage images and media assets for all website sections.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchMedia}
            className="p-2.5 rounded-xl border border-light-gold-border/30 hover:bg-[#FFF9F2] transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <div className="flex items-center space-x-2">
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className="border border-light-gold-border/40 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="general">Folder: general</option>
              <option value="hero">Folder: hero</option>
              <option value="gallery">Folder: gallery</option>
              <option value="events">Folder: events</option>
              <option value="timeline">Folder: timeline</option>
              <option value="trustees">Folder: trustees</option>
              <option value="temple">Folder: temple</option>
            </select>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-xl bg-deep-maroon text-white font-bold text-xs shadow-md hover:bg-deep-maroon/90 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/mp4,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="bg-white rounded-[24px] border-2 border-dashed border-light-gold-border/40 p-8 text-center cursor-pointer hover:border-primary-gold hover:bg-[#FFF9F2]/50 transition-all shadow-sm"
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-primary-gold">
            <Upload size={22} />
          </div>
          <p className="text-sm font-bold text-deep-maroon">
            Drag & drop files here to upload into target folder: <span className="underline font-mono">{uploadFolder}</span>
          </p>
          <p className="text-xs text-text-muted">
            PNG, JPG, WEBP, GIF, MP4, PDF · Maximum 10MB per file
          </p>
        </div>
      </div>

      {/* Search & Folder Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-light-gold-border/20 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter size={14} className="text-text-muted shrink-0" />
          {FOLDERS.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedFolder === folder
                  ? 'bg-deep-maroon text-white shadow'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-light-gold-border/40 focus:border-primary-gold rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary-gold" size={36} />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-light-gold-border/20 p-16 text-center text-text-muted space-y-3">
          <ImageIcon size={48} className="mx-auto text-amber-200" />
          <p className="font-serif text-base text-deep-maroon font-bold">No media files found</p>
          <p className="text-xs">Upload images using the button or drop zone above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredMedia.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="group bg-white rounded-2xl border border-light-gold-border/20 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-square bg-stone-100 relative overflow-hidden">
                <img
                  src={resolveUrl(item.url)}
                  alt={item.original_filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/hero-bg.png';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono uppercase font-bold backdrop-blur-sm">
                    {item.folder}
                  </span>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <p className="text-xs font-bold text-text-dark truncate" title={item.original_filename}>
                    {item.original_filename}
                  </p>
                  <p className="text-[10px] text-text-muted font-mono">{formatSize(item.size_bytes)}</p>
                </div>

                <div className="pt-2 border-t border-light-gold-border/10 flex items-center justify-between">
                  <button
                    onClick={() => copyUrl(item)}
                    className="p-1.5 rounded-lg text-xs bg-amber-50 text-primary-gold hover:bg-amber-100 transition-colors flex items-center space-x-1 font-semibold"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                    <span className="text-[10px]">{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => deleteMedia(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
