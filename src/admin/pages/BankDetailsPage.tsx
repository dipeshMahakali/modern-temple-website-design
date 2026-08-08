import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, RefreshCw, Plus, Trash2, CreditCard } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface BankAccount {
  id?: number;
  account_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  branch?: string;
  upi_id?: string;
  is_primary?: boolean;
  is_visible?: boolean;
}

const emptyAccount = (): BankAccount => ({
  account_name: '',
  bank_name: '',
  account_number: '',
  ifsc_code: '',
  branch: '',
  upi_id: '',
  is_primary: false,
  is_visible: true,
});

export default function BankDetailsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<number | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/bank-details/');
      setAccounts(res.data.length > 0 ? res.data : [emptyAccount()]);
    } catch { toast.error('Failed to load bank details'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (idx: number, field: keyof BankAccount, value: any) => {
    setAccounts(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };

  const handleSave = async (idx: number) => {
    const acc = accounts[idx];
    if (!acc.account_name || !acc.bank_name || !acc.account_number || !acc.ifsc_code) {
      toast.error('Account Name, Bank Name, Account Number, and IFSC Code are required.');
      return;
    }
    setIsSaving(idx);
    try {
      if (acc.id) {
        await api.patch(`/admin/bank-details/${acc.id}`, acc);
        toast.success('Account updated');
      } else {
        const res = await api.post('/admin/bank-details/', acc);
        setAccounts(prev => prev.map((a, i) => i === idx ? res.data : a));
        toast.success('Account saved');
      }
    } catch { toast.error('Failed to save'); }
    finally { setIsSaving(null); }
  };

  const handleDelete = async (idx: number) => {
    const acc = accounts[idx];
    if (!confirm('Remove this bank account?')) return;
    if (acc.id) {
      try { await api.delete(`/admin/bank-details/${acc.id}`); toast.success('Deleted'); }
      catch { toast.error('Delete failed'); return; }
    }
    setAccounts(prev => prev.filter((_, i) => i !== idx));
  };

  const addNew = () => setAccounts(prev => [...prev, emptyAccount()]);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-gold" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
            <CreditCard size={22} className="text-primary-gold" /><span>Bank & Donation Details</span>
          </h1>
          <p className="text-xs text-text-muted">Manage bank accounts and UPI IDs shown on the donation page</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={load} className="p-2 rounded-lg border border-light-gold-border/20 hover:bg-[#FFF9F2]"><RefreshCw size={16} /></button>
          <button onClick={addNew} className="px-4 py-2 rounded-xl bg-deep-maroon text-white text-sm font-bold flex items-center space-x-2 shadow cursor-pointer">
            <Plus size={16} /><span>Add Account</span>
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {accounts.map((acc, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] border border-light-gold-border/20 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 border border-primary-gold/30 flex items-center justify-center">
                  <CreditCard size={16} className="text-primary-gold" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Account {idx + 1}</span>
                  {acc.id && <p className="text-xs text-text-muted font-mono">ID: #{acc.id}</p>}
                </div>
                {acc.is_primary && <span className="px-2 py-0.5 rounded-full bg-primary-gold/10 text-primary-gold text-xs font-bold border border-primary-gold/20">PRIMARY</span>}
              </div>
              <button onClick={() => handleDelete(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={15} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { field: 'account_name', label: 'Account Holder Name *' },
                { field: 'bank_name', label: 'Bank Name *' },
                { field: 'account_number', label: 'Account Number *' },
                { field: 'ifsc_code', label: 'IFSC Code *' },
                { field: 'branch', label: 'Branch / City' },
                { field: 'upi_id', label: 'UPI ID (optional)' },
              ].map(({ field, label }) => (
                <div key={field} className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark">{label}</label>
                  <input type="text" value={(acc as any)[field] || ''} onChange={e => handleChange(idx, field as keyof BankAccount, e.target.value)}
                    className="border border-light-gold-border/40 focus:border-primary-gold rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-mono" />
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-6 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={!!acc.is_primary} onChange={e => handleChange(idx, 'is_primary', e.target.checked)} className="rounded accent-primary-gold" />
                <span className="text-sm font-semibold text-text-dark">Mark as Primary Account</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={!!acc.is_visible} onChange={e => handleChange(idx, 'is_visible', e.target.checked)} className="rounded accent-primary-gold" />
                <span className="text-sm font-semibold text-text-dark">Visible on Donation Page</span>
              </label>
            </div>

            <div className="flex justify-end pt-2 border-t border-light-gold-border/10">
              <button onClick={() => handleSave(idx)} disabled={isSaving === idx}
                className="px-6 py-2.5 rounded-xl bg-deep-maroon text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer">
                {isSaving === idx ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{isSaving === idx ? 'Saving…' : 'Save Account'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
