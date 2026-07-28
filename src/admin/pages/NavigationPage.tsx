import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface NavigationItem {
  id: number;
  label: string;
  slug: string;
  display_order: number;
  location: 'main' | 'footer' | 'both';
  is_visible: boolean;
}

export default function NavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<NavigationItem> | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/navigation/');
      const sorted = (res.data || []).sort((a: NavigationItem, b: NavigationItem) => a.display_order - b.display_order);
      setItems(sorted);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load navigation items');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (id: number) => {
    try {
      await api.post(`/admin/navigation/${id}/toggle-visibility`);
      setItems(items.map(item => item.id === id ? { ...item, is_visible: !item.is_visible } : item));
      toast.success('Visibility updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle visibility');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;
    try {
      await api.delete(`/admin/navigation/${id}`);
      setItems(items.filter(item => item.id !== id));
      toast.success('Navigation item deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete item');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem?.label || !currentItem?.slug) return;

    try {
      if (currentItem.id) {
        // Update
        const res = await api.patch(`/admin/navigation/${currentItem.id}`, {
          label: currentItem.label,
          slug: currentItem.slug,
          location: currentItem.location,
          display_order: currentItem.display_order,
        });
        setItems(items.map(item => item.id === currentItem.id ? res.data : item));
        toast.success('Navigation item updated');
      } else {
        // Create
        const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 0;
        const res = await api.post('/admin/navigation/', {
          label: currentItem.label,
          slug: currentItem.slug,
          location: currentItem.location || 'main',
          display_order: nextOrder,
        });
        setItems([...items, res.data]);
        toast.success('Navigation item created');
      }
      setIsModalOpen(false);
      setCurrentItem(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save navigation item');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    // Swap display order values
    const tempOrder = newItems[index].display_order;
    newItems[index].display_order = newItems[targetIndex].display_order;
    newItems[targetIndex].display_order = tempOrder;

    // Swap elements in local array
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);

    try {
      // Persist the changes to both swapped items
      await api.patch(`/admin/navigation/${newItems[index].id}`, { display_order: newItems[index].display_order });
      await api.patch(`/admin/navigation/${newItems[targetIndex].id}`, { display_order: newItems[targetIndex].display_order });
      toast.success('Order updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to persist order change');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#6B1F1F]">Navigation Builder</h1>
          <p className="text-sm text-[#777777]">Manage main header and footer navigation links.</p>
        </div>
        <button
          onClick={() => {
            setCurrentItem({ label: '', slug: '', location: 'main', display_order: 0 });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#6B1F1F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#8B2F2F] transition-all shadow-md"
        >
          <Plus size={16} />
          Add Nav Link
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#C8A45A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading navigation hierarchy...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gold-border/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFDF8] border-b border-gold-border/10 text-xs font-bold uppercase tracking-wider text-[#6B1F1F]">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Label</th>
                  <th className="py-4 px-6">Slug / Target</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-border/5 text-sm text-[#2C2C2C]">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#FFFDF8]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-[#777777]"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          disabled={idx === items.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-[#777777]"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold">{item.label}</td>
                    <td className="py-4 px-6 text-xs font-mono text-gray-500">{item.slug}</td>
                    <td className="py-4 px-6">
                      <span className="capitalize px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                        {item.location}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${item.is_visible ? 'text-green-600' : 'text-gray-400'}`}>
                        {item.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleToggleVisibility(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${item.is_visible ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'}`}
                        title="Toggle visibility"
                      >
                        {item.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => {
                          setCurrentItem(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-gold-border/20 text-[#6B1F1F] bg-[#FFFDF8] hover:bg-[#C8A45A]/10 transition-colors"
                        title="Edit link"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gold-border/20"
          >
            <h3 className="text-xl font-bold font-serif text-[#6B1F1F] mb-4">
              {currentItem.id ? 'Edit Navigation Link' : 'Add Navigation Link'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Label</label>
                <input
                  type="text"
                  required
                  value={currentItem.label || ''}
                  onChange={e => setCurrentItem({ ...currentItem, label: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                  placeholder="e.g. History"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Slug / Route Target</label>
                <input
                  type="text"
                  required
                  value={currentItem.slug || ''}
                  onChange={e => setCurrentItem({ ...currentItem, slug: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#C8A45A]"
                  placeholder="e.g. /history"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
                <select
                  value={currentItem.location || 'main'}
                  onChange={e => setCurrentItem({ ...currentItem, location: e.target.value as any })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A45A]"
                >
                  <option value="main">Main Navigation (Header)</option>
                  <option value="footer">Footer Only</option>
                  <option value="both">Both Header and Footer</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#6B1F1F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#8B2F2F] transition-all"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
