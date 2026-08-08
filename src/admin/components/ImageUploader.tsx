import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Loader2, Check, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  placeholder?: string;
  helpText?: string;
}

interface MediaItem {
  id: number;
  url: string;
  original_filename: string;
  mimetype: string;
  folder: string;
  created_at: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
  folder = 'general',
  placeholder = '/assets/hero-bg.png or https://...',
  helpText = 'Upload an image file (PNG, JPG, WEBP) or enter a URL.',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  const resolvePreviewUrl = (urlStr: string) => {
    if (!urlStr) return '';
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://') || urlStr.startsWith('data:')) {
      return urlStr;
    }
    if (urlStr.startsWith('/uploads/')) {
      const apiBase = import.meta.env.VITE_API_URL;
      if (apiBase) {
        const rootUrl = apiBase.replace(/\/api\/v1\/?$/, '');
        return `${rootUrl}${urlStr}`;
      }
      return urlStr;
    }
    return urlStr;
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPEG, PNG, WEBP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 10MB.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = res.data.url;
      onChange(uploadedUrl);
      setUrlInput(uploadedUrl);
      toast.success('Image uploaded successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUrlApply = () => {
    onChange(urlInput.trim());
    toast.success('Image URL applied.');
  };

  const openLibrary = async () => {
    setIsLibraryOpen(true);
    setLoadingLibrary(true);
    try {
      const res = await api.get('/admin/media/');
      setMediaList(res.data);
    } catch {
      toast.error('Failed to load media library.');
    } finally {
      setLoadingLibrary(false);
    }
  };

  const selectFromLibrary = (item: MediaItem) => {
    onChange(item.url);
    setUrlInput(item.url);
    setIsLibraryOpen(false);
    toast.success('Selected image from library.');
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text-dark flex items-center space-x-1">
          <ImageIcon size={14} className="text-primary-gold" />
          <span>{label}</span>
        </label>

        <div className="flex items-center space-x-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-deep-maroon text-white font-bold'
                : 'text-text-muted hover:text-text-dark hover:bg-stone-100'
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'url'
                ? 'bg-deep-maroon text-white font-bold'
                : 'text-text-muted hover:text-text-dark hover:bg-stone-100'
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={openLibrary}
            className="px-2.5 py-1 rounded-lg border border-primary-gold/40 text-primary-gold font-semibold hover:bg-amber-50 transition-all flex items-center space-x-1"
          >
            <FolderOpen size={12} />
            <span>Library</span>
          </button>
        </div>
      </div>

      {/* Main Upload / URL Box */}
      <div className="space-y-3">
        {activeTab === 'upload' ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
              isUploading
                ? 'border-primary-gold bg-amber-50/40'
                : value
                ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400'
                : 'border-light-gold-border/60 hover:border-primary-gold hover:bg-[#FFF9F2]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-3 space-y-2">
                <Loader2 className="animate-spin text-primary-gold" size={24} />
                <p className="text-xs font-semibold text-primary-gold">Uploading image...</p>
              </div>
            ) : value ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-light-gold-border/30 bg-stone-100 shrink-0">
                    <img
                      src={resolvePreviewUrl(value)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/hero-bg.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-emerald-700 truncate max-w-[220px]">
                      {value}
                    </p>
                    <p className="text-[11px] text-text-muted">Click or drag to replace image</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                    setUrlInput('');
                  }}
                  className="p-1.5 rounded-full hover:bg-rose-100 text-rose-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-3 space-y-1">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-primary-gold mb-1">
                  <Upload size={18} />
                </div>
                <p className="text-xs font-bold text-deep-maroon">
                  Click to upload image or drag & drop
                </p>
                <p className="text-[11px] text-text-muted">PNG, JPG, WEBP, GIF up to 10MB</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <LinkIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder={placeholder}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full border border-light-gold-border/40 focus:border-primary-gold rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleUrlApply}
              className="px-4 py-2.5 rounded-xl bg-deep-maroon text-white font-bold text-xs shadow hover:bg-deep-maroon/90 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Check size={14} />
              <span>Apply</span>
            </button>
          </div>
        )}

        {/* Current Image Preview Bar if value exists */}
        {value && activeTab === 'url' && (
          <div className="flex items-center space-x-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-300 shrink-0">
              <img
                src={resolvePreviewUrl(value)}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/hero-bg.png';
                }}
              />
            </div>
            <span className="text-xs text-text-dark font-mono truncate flex-1">{value}</span>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setUrlInput('');
              }}
              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {helpText && <p className="text-[11px] text-text-muted italic">{helpText}</p>}
      </div>

      {/* Media Library Modal */}
      <AnimatePresence>
        {isLibraryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-light-gold-border/25 shadow-2xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-5 bg-[#FFF9F2] border-b border-light-gold-border/20 flex justify-between items-center shrink-0">
                <h3 className="font-serif font-extrabold text-lg text-deep-maroon flex items-center space-x-2">
                  <FolderOpen size={18} className="text-primary-gold" />
                  <span>Select from Media Library</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsLibraryOpen(false)}
                  className="p-1.5 rounded-full hover:bg-amber-100 text-text-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
                {loadingLibrary ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="animate-spin text-primary-gold" size={32} />
                  </div>
                ) : mediaList.length === 0 ? (
                  <div className="text-center py-16 text-text-muted text-sm space-y-2">
                    <ImageIcon size={36} className="mx-auto text-amber-200" />
                    <p>No media files found in the library.</p>
                    <p className="text-xs">Upload images using the "Upload" tab above first.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => selectFromLibrary(item)}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          value === item.url
                            ? 'border-primary-gold ring-2 ring-primary-gold/40'
                            : 'border-stone-200 hover:border-primary-gold/60 hover:shadow-md'
                        }`}
                      >
                        <div className="aspect-square bg-stone-100 overflow-hidden">
                          <img
                            src={resolvePreviewUrl(item.url)}
                            alt={item.original_filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-2 bg-white text-[11px] border-t border-stone-100">
                          <p className="font-semibold text-text-dark truncate">
                            {item.original_filename}
                          </p>
                          <p className="text-text-muted text-[10px] uppercase font-mono">
                            {item.folder}
                          </p>
                        </div>
                        {value === item.url && (
                          <div className="absolute top-2 right-2 bg-primary-gold text-white p-1 rounded-full shadow">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
