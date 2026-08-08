import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, RefreshCw, Image, Type, AlignLeft, ExternalLink } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

import ImageUploader from '../components/ImageUploader';

interface HeroConfig {
  id?: number;
  heading: string;
  heading_devanagari?: string;
  subtitle: string;
  description?: string;
  bg_image_url?: string;
  overlay_opacity?: number;
  buttons?: any[];
  is_active?: boolean;
}

export default function HeroPage() {
  const [config, setConfig] = useState<HeroConfig>({
    heading: '',
    heading_devanagari: '',
    subtitle: '',
    description: '',
    bg_image_url: '',
    overlay_opacity: 0.5,
    buttons: [],
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [buttonsJson, setButtonsJson] = useState('[]');
  const [jsonError, setJsonError] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/hero/');
      setConfig(res.data);
      setButtonsJson(JSON.stringify(res.data.buttons || [], null, 2));
    } catch { toast.error('Failed to load hero config'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      JSON.parse(buttonsJson);
      setJsonError('');
    } catch {
      setJsonError('Invalid JSON in Buttons configuration. Please fix it before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = { ...config, buttons: JSON.parse(buttonsJson) };
      await api.patch('/admin/hero/', payload);
      toast.success('Hero section updated successfully!');
      load();
    } catch { toast.error('Failed to save hero config'); }
    finally { setIsSaving(false); }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-gold" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Hero Banner Configuration</h1>
          <p className="text-xs text-text-muted">Control the main hero section heading, subtitle, background image, and CTA buttons</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg border border-light-gold-border/20 hover:bg-[#FFF9F2]"><RefreshCw size={16} /></button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text Content */}
          <div className="bg-white rounded-[24px] border border-light-gold-border/20 shadow-sm p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Type size={16} className="text-primary-gold" />
              <h2 className="font-serif font-bold text-deep-maroon text-base">Text Content</h2>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-text-dark">English Heading *</label>
              <input type="text" required value={config.heading} onChange={e => setConfig({ ...config, heading: e.target.value })}
                className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-text-dark">Devanagari / Hindi Heading</label>
              <input type="text" value={config.heading_devanagari || ''} onChange={e => setConfig({ ...config, heading_devanagari: e.target.value })}
                className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none font-serif" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-text-dark">Subtitle *</label>
              <input type="text" required value={config.subtitle} onChange={e => setConfig({ ...config, subtitle: e.target.value })}
                className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-text-dark">Description / Sub-text</label>
              <textarea rows={3} value={config.description || ''} onChange={e => setConfig({ ...config, description: e.target.value })}
                className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
            </div>
          </div>

          {/* Background & Overlay */}
          <div className="bg-white rounded-[24px] border border-light-gold-border/20 shadow-sm p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Image size={16} className="text-primary-gold" />
              <h2 className="font-serif font-bold text-deep-maroon text-base">Background & Overlay</h2>
            </div>
            <ImageUploader
              label="Background Image"
              folder="hero"
              value={config.bg_image_url || ''}
              onChange={(url) => setConfig({ ...config, bg_image_url: url })}
              placeholder="/assets/hero-bg.png or upload image"
            />
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-semibold text-text-dark">Dark Overlay Opacity: <strong>{Math.round((config.overlay_opacity || 0.5) * 100)}%</strong></label>
              <input type="range" min={0} max={1} step={0.05} value={config.overlay_opacity || 0.5} onChange={e => setConfig({ ...config, overlay_opacity: parseFloat(e.target.value) })}
                className="w-full accent-primary-gold" />
              <div className="flex justify-between text-xs text-text-muted"><span>0% (Transparent)</span><span>100% (Full Black)</span></div>
            </div>
          </div>
        </div>

        {/* CTA Buttons Config */}
        <div className="bg-white rounded-[24px] border border-light-gold-border/20 shadow-sm p-6 space-y-3">
          <div className="flex items-center space-x-2 mb-1">
            <ExternalLink size={16} className="text-primary-gold" />
            <h2 className="font-serif font-bold text-deep-maroon text-base">CTA Buttons (JSON)</h2>
          </div>
          <p className="text-xs text-text-muted">Configure call-to-action buttons as a JSON array: <code className="bg-stone-100 px-1 rounded">{"[{\"label\": \"Darshan\", \"href\": \"#darshan\", \"variant\": \"primary\"}]"}</code></p>
          <textarea rows={6} value={buttonsJson} onChange={e => { setButtonsJson(e.target.value); setJsonError(''); }}
            className={`w-full border ${jsonError ? 'border-rose-400' : 'border-light-gold-border/40'} focus:border-primary-gold rounded-xl px-4 py-3 text-xs font-mono focus:outline-none resize-none`} />
          {jsonError && <p className="text-xs text-rose-500 font-semibold">{jsonError}</p>}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving}
            className="px-8 py-3 rounded-xl bg-deep-maroon text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{isSaving ? 'Saving...' : 'Save Hero Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
