import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Info, Phone, MapPin, Share2, Globe, Tv, Plus, Trash2, Video, Image as ImageIcon } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

interface TempleInfoItem {
  id?: number;
  key: string;
  value: string;
  group: string;
  label?: string;
}

interface AltViewStream {
  id: number | string;
  title: string;
  videoUrl: string;
  url: string;
}

export default function TempleInfoPage() {
  const [items, setItems] = useState<TempleInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'address' | 'social' | 'darshan'>('general');

  // Live Darshan Alternative Views State
  const [altStreams, setAltStreams] = useState<AltViewStream[]>([]);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/temple/info');
      const data: TempleInfoItem[] = res.data || [];
      setItems(data);

      // Parse live_alt_views if available
      const altViewsItem = data.find(i => i.key === 'live_alt_views');
      if (altViewsItem && altViewsItem.value) {
        try {
          const parsed = JSON.parse(altViewsItem.value);
          if (Array.isArray(parsed)) {
            setAltStreams(parsed);
          }
        } catch (e) {
          console.error('Failed to parse live_alt_views:', e);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load temple settings');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setItems(items.map(item => item.key === key ? { ...item, value } : item));
  };

  const handleAddAltStream = () => {
    const newStream: AltViewStream = {
      id: Date.now(),
      title: `Camera View ${altStreams.length + 1}`,
      videoUrl: 'https://www.youtube.com/watch?v=wulPPdw-FUk',
      url: '/assets/hero-bg.png'
    };
    const updated = [...altStreams, newStream];
    setAltStreams(updated);
    handleValueChange('live_alt_views', JSON.stringify(updated));
  };

  const handleUpdateAltStream = (id: number | string, field: keyof AltViewStream, val: string) => {
    const updated = altStreams.map(s => s.id === id ? { ...s, [field]: val } : s);
    setAltStreams(updated);
    handleValueChange('live_alt_views', JSON.stringify(updated));
  };

  const handleDeleteAltStream = (id: number | string) => {
    const updated = altStreams.filter(s => s.id !== id);
    setAltStreams(updated);
    handleValueChange('live_alt_views', JSON.stringify(updated));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Make sure live_alt_views is updated in items before saving
    let updatedItems = [...items];
    if (activeTab === 'darshan') {
      const serialized = JSON.stringify(altStreams);
      const exists = updatedItems.some(i => i.key === 'live_alt_views');
      if (exists) {
        updatedItems = updatedItems.map(i => i.key === 'live_alt_views' ? { ...i, value: serialized } : i);
      } else {
        updatedItems.push({ key: 'live_alt_views', value: serialized, group: 'darshan', label: 'Alternative Camera Views' });
      }
    }

    // Filter items in the current group
    const currentGroupItems = updatedItems.filter(item => item.group === activeTab || (activeTab === 'general' && item.group === 'maps'));

    try {
      const payload = currentGroupItems.map(item => ({
        key: item.key,
        value: item.value,
        group: item.group,
        label: item.label || item.key.replace('_', ' ')
      }));
      await api.put('/admin/temple/info/bulk', payload);
      toast.success('Settings saved successfully');
      setItems(updatedItems);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderDarshanFields = () => {
    const portalSubtitle = items.find(i => i.key === 'live_portal_subtitle')?.value || 'Darshan Portal';
    const portalTitle = items.find(i => i.key === 'live_portal_title')?.value || 'Watch Live Darshan';
    const portalDesc = items.find(i => i.key === 'live_portal_description')?.value || '';
    const morningTime = items.find(i => i.key === 'aarti_morning_time')?.value || '5:30 AM – 6:00 AM';
    const eveningTime = items.find(i => i.key === 'aarti_evening_time')?.value || '7:00 PM – 7:30 PM';
    const mainVideoUrl = items.find(i => i.key === 'live_video_url')?.value || '';

    return (
      <div className="space-y-6">
        {/* Main Section Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Portal Subtitle</label>
            <input
              type="text"
              value={portalSubtitle}
              onChange={e => handleValueChange('live_portal_subtitle', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Portal Main Title</label>
            <input
              type="text"
              value={portalTitle}
              onChange={e => handleValueChange('live_portal_title', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Portal Description</label>
          <textarea
            rows={3}
            value={portalDesc}
            onChange={e => handleValueChange('live_portal_description', e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
          />
        </div>

        {/* Aarti Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-xl border border-amber-200/50">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#6B1F1F] uppercase tracking-wider">Morning Aarti Hours</label>
            <input
              type="text"
              value={morningTime}
              onChange={e => handleValueChange('aarti_morning_time', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#6B1F1F] uppercase tracking-wider">Evening Aarti Hours</label>
            <input
              type="text"
              value={eveningTime}
              onChange={e => handleValueChange('aarti_evening_time', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Video className="w-4 h-4 text-[#6B1F1F]" />
            <span>Default Main Stream YouTube URL</span>
          </label>
          <input
            type="text"
            value={mainVideoUrl}
            onChange={e => handleValueChange('live_video_url', e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=wulPPdw-FUk"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
          />
        </div>

        {/* Alternative Views Section */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-bold font-serif text-[#6B1F1F]">Alternative Stream Camera Views</h4>
              <p className="text-xs text-gray-500">Add title-specific YouTube video links and thumbnails for live camera angles.</p>
            </div>
            <button
              type="button"
              onClick={handleAddAltStream}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6B1F1F] text-white text-xs font-semibold rounded-lg hover:bg-[#8B2F2F] transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Camera View</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {altStreams.map((stream, idx) => (
              <div key={stream.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 relative group">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs font-bold text-[#6B1F1F] uppercase tracking-wider">
                    Camera Stream #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteAltStream(stream.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Stream"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">View Title</label>
                    <input
                      type="text"
                      value={stream.title}
                      onChange={e => handleUpdateAltStream(stream.id, 'title', e.target.value)}
                      placeholder="e.g. Main Sanctum / Temple Shikhar"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#C8A45A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">YouTube Video Link</label>
                    <input
                      type="text"
                      value={stream.videoUrl}
                      onChange={e => handleUpdateAltStream(stream.id, 'videoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#C8A45A]"
                    />
                  </div>
                </div>

                <div>
                  <ImageUploader
                    label="Camera View Thumbnail"
                    folder="temple"
                    value={stream.url}
                    onChange={val => handleUpdateAltStream(stream.id, 'url', val)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFields = () => {
    if (activeTab === 'darshan') {
      return renderDarshanFields();
    }

    const filtered = items.filter(item => {
      if (activeTab === 'general') {
        return item.group === 'general' || item.group === 'maps';
      }
      return item.group === activeTab;
    });

    if (filtered.length === 0) {
      return (
        <p className="text-sm text-gray-400 py-6 text-center">No fields available in this section.</p>
      );
    }

    return (
      <div className="space-y-4">
        {filtered.map(item => (
          <div key={item.key} className="space-y-1">
            {item.key.includes('image') || item.key.includes('photo') || item.key.includes('bg') ? (
              <ImageUploader
                label={item.label || item.key.split('_').join(' ')}
                folder="temple"
                value={item.value || ''}
                onChange={val => handleValueChange(item.key, val)}
              />
            ) : (
              <>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {item.label || item.key.split('_').join(' ')}
                </label>
                <input
                  type="text"
                  value={item.value || ''}
                  onChange={e => handleValueChange(item.key, e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                />
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: <Info size={16} /> },
    { id: 'contact', label: 'Contact Details', icon: <Phone size={16} /> },
    { id: 'address', label: 'Location & Address', icon: <MapPin size={16} /> },
    { id: 'social', label: 'Social Handles', icon: <Share2 size={16} /> },
    { id: 'darshan', label: 'Live Darshan & Streams', icon: <Tv size={16} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#6B1F1F]">Temple Information</h1>
          <p className="text-sm text-[#777777]">Manage global details, live darshan streams, contact information, and coordinates.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#C8A45A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading system settings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1 bg-white rounded-2xl border border-gold-border/20 shadow-md p-4 space-y-1.5 h-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#6B1F1F] text-white shadow-md font-semibold'
                    : 'hover:bg-[#FFFDF8] text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Area */}
          <div className="md:col-span-3">
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gold-border/20 shadow-xl p-6 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold font-serif text-[#6B1F1F] capitalize">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-xs text-gray-500">Updates here apply globally to the public website headers, footers, and live darshan sections.</p>
              </div>

              {renderFields()}

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-[#6B1F1F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#8B2F2F] transition-all shadow-md disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
