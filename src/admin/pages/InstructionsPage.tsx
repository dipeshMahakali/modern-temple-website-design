import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, RefreshCw, X, ArrowUp, ArrowDown, Sparkles, MapPin, ListPlus } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface InstructionRule {
  id: number;
  title: string;
  desc: string;
  icon?: string;
  is_visible: boolean;
  display_order: number;
}

interface InstructionDetail {
  id: number;
  group_slug: string;
  title: string;
  description: string;
  items: string[];
  display_order: number;
}

const defaultRuleForm = { title: '', desc: '', icon: 'Compass', is_visible: true, display_order: 0 };
const defaultDetailForm = {
  group_slug: 'ropeway',
  title: '',
  description: '',
  items: [''],
  display_order: 0
};

export default function InstructionsPage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'details'>('rules');
  const [rules, setRules] = useState<InstructionRule[]>([]);
  const [details, setDetails] = useState<InstructionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<InstructionRule | null>(null);
  const [ruleForm, setRuleForm] = useState({ ...defaultRuleForm });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<InstructionDetail | null>(null);
  const [detailForm, setDetailForm] = useState({ ...defaultDetailForm });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rulesRes, detailsRes] = await Promise.all([
        api.get('/admin/instructions/rules'),
        api.get('/admin/instructions/details')
      ]);
      setRules(rulesRes.data || []);
      setDetails(detailsRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load instructions data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Rule Handlers ─────────────────────────────────────────────────────────

  const openCreateRule = () => {
    setEditingRule(null);
    setRuleForm({ ...defaultRuleForm, display_order: rules.length });
    setIsRuleModalOpen(true);
  };

  const openEditRule = (rule: InstructionRule) => {
    setEditingRule(rule);
    setRuleForm({
      title: rule.title,
      desc: rule.desc,
      icon: rule.icon || 'Compass',
      is_visible: rule.is_visible,
      display_order: rule.display_order
    });
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRule) {
        await api.patch(`/admin/instructions/rules/${editingRule.id}`, ruleForm);
        toast.success('Rule updated successfully');
      } else {
        await api.post('/admin/instructions/rules', ruleForm);
        toast.success('Rule created successfully');
      }
      setIsRuleModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save rule');
    }
  };

  const handleDeleteRule = async (id: number) => {
    if (!confirm('Delete this rule?')) return;
    try {
      await api.delete(`/admin/instructions/rules/${id}`);
      toast.success('Rule deleted');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  // ─── Detail Handlers (Ropeway & Pathway) ───────────────────────────────────

  const openCreateDetail = () => {
    setEditingDetail(null);
    setDetailForm({ ...defaultDetailForm, display_order: details.length });
    setIsDetailModalOpen(true);
  };

  const openEditDetail = (detail: InstructionDetail) => {
    setEditingDetail(detail);
    setDetailForm({
      group_slug: detail.group_slug || 'ropeway',
      title: detail.title,
      description: detail.description,
      items: Array.isArray(detail.items) ? [...detail.items] : [],
      display_order: detail.display_order
    });
    setIsDetailModalOpen(true);
  };

  const handleSaveDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty bullet point items
    const cleanItems = detailForm.items.filter(i => i.trim() !== '');
    const payload = { ...detailForm, items: cleanItems };

    try {
      if (editingDetail) {
        await api.patch(`/admin/instructions/details/${editingDetail.id}`, payload);
        toast.success('Facility section updated');
      } else {
        await api.post('/admin/instructions/details', payload);
        toast.success('Facility section created');
      }
      setIsDetailModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save detail section');
    }
  };

  const handleDeleteDetail = async (id: number) => {
    if (!confirm('Delete this facility section?')) return;
    try {
      await api.delete(`/admin/instructions/details/${id}`);
      toast.success('Facility section deleted');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  const handleAddItemPoint = () => {
    setDetailForm({ ...detailForm, items: [...detailForm.items, ''] });
  };

  const handleUpdateItemPoint = (idx: number, val: string) => {
    const updated = [...detailForm.items];
    updated[idx] = val;
    setDetailForm({ ...detailForm, items: updated });
  };

  const handleRemoveItemPoint = (idx: number) => {
    const updated = detailForm.items.filter((_, i) => i !== idx);
    setDetailForm({ ...detailForm, items: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D2D2D]">Visitor Instructions & Facilities</h1>
          <p className="text-xs text-text-muted">Manage general rules, ropeway (Udan Khatola) details, and walking pathway guidelines.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={loadData} className="p-2 rounded-xl border border-light-gold-border/20 hover:bg-[#FFF9F2] transition-colors">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          {activeTab === 'rules' ? (
            <button onClick={openCreateRule} className="px-4 py-2 rounded-xl bg-deep-maroon text-white text-sm font-bold flex items-center space-x-2 shadow cursor-pointer">
              <Plus size={16} />
              <span>Add Guideline Rule</span>
            </button>
          ) : (
            <button onClick={openCreateDetail} className="px-4 py-2 rounded-xl bg-deep-maroon text-white text-sm font-bold flex items-center space-x-2 shadow cursor-pointer">
              <Plus size={16} />
              <span>Add Facility Section</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-light-gold-border/20 space-x-4">
        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'rules'
              ? 'border-deep-maroon text-deep-maroon'
              : 'border-transparent text-text-muted hover:text-text-dark'
          }`}
        >
          <Sparkles size={16} />
          <span>General Visitor Rules ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'details'
              ? 'border-deep-maroon text-deep-maroon'
              : 'border-transparent text-text-muted hover:text-text-dark'
          }`}
        >
          <MapPin size={16} />
          <span>Ropeway & Pathway Facilities ({details.length})</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary-gold" size={32} />
        </div>
      ) : activeTab === 'rules' ? (
        /* Rules List */
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-[20px] border border-light-gold-border/20 p-5 shadow-sm flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-deep-maroon text-sm flex items-center space-x-2">
                  <span>{rule.title}</span>
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">{rule.desc}</p>
              </div>
              <div className="flex space-x-1 shrink-0">
                <button onClick={() => openEditRule(rule)} className="p-1.5 text-primary-gold hover:bg-amber-50 rounded-lg transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDeleteRule(rule.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {rules.length === 0 && (
            <div className="py-12 text-center text-text-muted text-sm">No rules defined yet.</div>
          )}
        </div>
      ) : (
        /* Details List (Ropeway & Pathway) */
        <div className="space-y-6">
          {details.map((detail) => (
            <div key={detail.id} className="bg-white rounded-[24px] border border-light-gold-border/25 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-light-gold-border/10 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-deep-maroon/10 text-deep-maroon">
                    {detail.group_slug}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-deep-maroon">{detail.title}</h3>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => openEditDetail(detail)} className="p-1.5 text-primary-gold hover:bg-amber-50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteDetail(detail.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-text-dark/90 leading-relaxed font-sans">{detail.description}</p>

              <div className="space-y-2">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-primary-gold">Bullet Points / Features:</h5>
                <ul className="space-y-1.5 text-xs text-text-muted">
                  {Array.isArray(detail.items) && detail.items.map((pt, ptIdx) => (
                    <li key={ptIdx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-gold mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {details.length === 0 && (
            <div className="py-12 text-center text-text-muted text-sm">No facility details defined yet. Click "Add Facility Section" above.</div>
          )}
        </div>
      )}

      {/* Rule Edit/Create Modal */}
      <AnimatePresence>
        {isRuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-light-gold-border/25 shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-6 bg-[#FFF9F2] border-b border-light-gold-border/20 flex justify-between items-center">
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">{editingRule ? 'Edit Guideline Rule' : 'Add Guideline Rule'}</h3>
                <button onClick={() => setIsRuleModalOpen(false)} className="p-1.5 rounded-full hover:bg-amber-100"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveRule} className="p-6 space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Rule Title *</label>
                  <input type="text" required value={ruleForm.title} onChange={e => setRuleForm({ ...ruleForm, title: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Description *</label>
                  <textarea rows={4} required value={ruleForm.desc} onChange={e => setRuleForm({ ...ruleForm, desc: e.target.value })} className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
                </div>
                <div className="pt-4 border-t border-light-gold-border/10 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsRuleModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-light-gold-border/30 hover:bg-[#FFF9F2] text-sm cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-deep-maroon text-white font-bold text-sm shadow-md cursor-pointer">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Edit/Create Modal (Ropeway & Pathway) */}
      <AnimatePresence>
        {isDetailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-light-gold-border/25 shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 bg-[#FFF9F2] border-b border-light-gold-border/20 flex justify-between items-center sticky top-0 z-10">
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">{editingDetail ? 'Edit Facility Section' : 'Add Facility Section'}</h3>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-1.5 rounded-full hover:bg-amber-100"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveDetail} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">Group Slug (ropeway / pathway) *</label>
                    <input type="text" required value={detailForm.group_slug} onChange={e => setDetailForm({ ...detailForm, group_slug: e.target.value })} placeholder="ropeway or pathway" className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark">Section Title *</label>
                    <input type="text" required value={detailForm.title} onChange={e => setDetailForm({ ...detailForm, title: e.target.value })} placeholder="e.g. Ropeway (Udan Khatola) Service" className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">Description *</label>
                  <textarea rows={3} required value={detailForm.description} onChange={e => setDetailForm({ ...detailForm, description: e.target.value })} placeholder="Main summary of the facility..." className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
                </div>

                {/* Bullet Points Items */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-deep-maroon uppercase tracking-wider">Bullet Points List</label>
                    <button type="button" onClick={handleAddItemPoint} className="text-xs text-primary-gold font-bold flex items-center space-x-1 hover:underline">
                      <ListPlus size={14} />
                      <span>Add Bullet Point</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {detailForm.items.map((pt, ptIdx) => (
                      <div key={ptIdx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={pt}
                          onChange={e => handleUpdateItemPoint(ptIdx, e.target.value)}
                          placeholder={`Bullet point #${ptIdx + 1}`}
                          className="flex-1 border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                        {detailForm.items.length > 1 && (
                          <button type="button" onClick={() => handleRemoveItemPoint(ptIdx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-light-gold-border/10 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsDetailModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-light-gold-border/30 hover:bg-[#FFF9F2] text-sm cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-deep-maroon text-white font-bold text-sm shadow-md cursor-pointer">Save Section</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
