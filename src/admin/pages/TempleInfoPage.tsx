import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Info, Phone, MapPin, Share2, Globe } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface TempleInfoItem {
  id?: number;
  key: string;
  value: string;
  group: string;
  label?: string;
}

export default function TempleInfoPage() {
  const [items, setItems] = useState<TempleInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'address' | 'social'>('general');

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/temple/info');
      setItems(res.data || []);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Filter items in the current group
    const currentGroupItems = items.filter(item => item.group === activeTab || (activeTab === 'general' && item.group === 'maps'));
    
    try {
      const payload = currentGroupItems.map(item => ({
        key: item.key,
        value: item.value,
        group: item.group,
        label: item.label || item.key.replace('_', ' ')
      }));
      await api.put('/admin/temple/info/bulk', payload);
      toast.success('Settings saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderFields = () => {
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
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {item.label || item.key.split('_').join(' ')}
            </label>
            <input
              type="text"
              value={item.value || ''}
              onChange={e => handleValueChange(item.key, e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
            />
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: <Info size={16} /> },
    { id: 'contact', label: 'Contact Details', icon: <Phone size={16} /> },
    { id: 'address', label: 'Location & Address', icon: <MapPin size={16} /> },
    { id: 'social', label: 'Social Handles', icon: <Share2 size={16} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#6B1F1F]">Temple Information</h1>
          <p className="text-sm text-[#777777]">Manage global details, contact information, social links, and coordinates.</p>
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
                <p className="text-xs text-gray-500">Updates here apply globally to the public website headers, footers, and contact sections.</p>
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
