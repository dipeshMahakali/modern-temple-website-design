import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, X, Shield, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface AuditLog {
  id: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  entity_label?: string;
  user_id?: number;
  old_value?: any;
  new_value?: any;
  notes?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

const actionColors: Record<string, string> = {
  create: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  update: 'bg-blue-50 text-blue-700 border border-blue-200',
  delete: 'bg-rose-50 text-rose-700 border border-rose-200',
  toggle: 'bg-amber-50 text-amber-700 border border-amber-200',
  reorder: 'bg-purple-50 text-purple-700 border border-purple-200',
};

const getActionColor = (action: string) => {
  const key = Object.keys(actionColors).find(k => action.toLowerCase().includes(k));
  return key ? actionColors[key] : 'bg-stone-50 text-stone-600 border border-stone-200';
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingLog, setViewingLog] = useState<AuditLog | null>(null);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (filterAction) params.append('action', filterAction);
      if (filterEntity) params.append('entity_type', filterEntity);
      const res = await api.get(`/admin/audit-logs?${params}`);
      setLogs(res.data);
    } catch { toast.error('Failed to load audit logs'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, [filterAction, filterEntity]);

  const formatDate = (d: string) => {
    try { return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d)); }
    catch { return d; }
  };

  const entityTypes = [...new Set(logs.map(l => l.entity_type).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
            <Shield size={22} className="text-primary-gold" /><span>Audit Logs</span>
          </h1>
          <p className="text-xs text-text-muted">Immutable record of all admin actions, changes, and security events</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg border border-light-gold-border/20 hover:bg-[#FFF9F2]"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /></button>
      </div>

      {/* Filters */}
      <div className="flex space-x-3">
        <input type="text" placeholder="Filter by action..." value={filterAction} onChange={e => setFilterAction(e.target.value)}
          className="border border-light-gold-border/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-gold w-48" />
        <select value={filterEntity} onChange={e => setFilterEntity(e.target.value)}
          className="border border-light-gold-border/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-gold">
          <option value="">All Entity Types</option>
          {entityTypes.map(t => <option key={t} value={t!}>{t}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-gold" size={32} /></div>
      ) : (
        <div className="bg-white rounded-[24px] border border-light-gold-border/20 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9F2] text-xs font-bold uppercase tracking-wider text-text-dark/70 border-b border-light-gold-border/20">
                  <th className="py-4 px-5">Timestamp</th>
                  <th className="py-4 px-5">Action</th>
                  <th className="py-4 px-5">Entity</th>
                  <th className="py-4 px-5">Label</th>
                  <th className="py-4 px-5">IP Address</th>
                  <th className="py-4 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gold-border/10 text-sm">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-amber-50/10 transition-colors">
                    <td className="py-3 px-5 text-xs text-text-muted font-mono">{formatDate(log.created_at)}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-xs font-mono">
                        {log.entity_type || '—'}
                        {log.entity_id ? `#${log.entity_id}` : ''}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-text-dark font-medium text-xs max-w-[150px] truncate">{log.entity_label || log.notes || '—'}</td>
                    <td className="py-3 px-5 font-mono text-xs text-text-muted">{log.ip_address || '—'}</td>
                    <td className="py-3 px-5 text-right">
                      {(log.old_value || log.new_value || log.notes) && (
                        <button onClick={() => setViewingLog(log)} className="text-xs text-primary-gold hover:text-deep-maroon font-semibold flex items-center space-x-1 ml-auto">
                          <AlertCircle size={13} /><span>View</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-text-muted text-sm">No audit logs found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {viewingLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-light-gold-border/25 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
              <div className="p-6 bg-[#FFF9F2] border-b border-light-gold-border/20 flex justify-between items-center shrink-0">
                <h3 className="font-serif font-extrabold text-xl text-deep-maroon">Audit Event Details</h3>
                <button onClick={() => setViewingLog(null)} className="p-1.5 rounded-full hover:bg-amber-100"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-gold-scrollbar">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-xs text-text-muted uppercase tracking-wider font-bold">Action</span><p className="font-semibold text-deep-maroon mt-0.5">{viewingLog.action}</p></div>
                  <div><span className="text-xs text-text-muted uppercase tracking-wider font-bold">Entity</span><p className="font-semibold text-deep-maroon mt-0.5">{viewingLog.entity_type} #{viewingLog.entity_id}</p></div>
                  <div><span className="text-xs text-text-muted uppercase tracking-wider font-bold">IP Address</span><p className="font-mono text-text-dark mt-0.5">{viewingLog.ip_address || 'N/A'}</p></div>
                  <div><span className="text-xs text-text-muted uppercase tracking-wider font-bold">Timestamp</span><p className="font-mono text-text-dark mt-0.5">{viewingLog.created_at}</p></div>
                </div>
                {viewingLog.notes && (
                  <div>
                    <span className="text-xs text-text-muted uppercase tracking-wider font-bold">Notes</span>
                    <p className="text-sm mt-0.5 text-text-dark">{viewingLog.notes}</p>
                  </div>
                )}
                {viewingLog.old_value && (
                  <div>
                    <span className="text-xs text-text-muted uppercase tracking-wider font-bold">Previous Values</span>
                    <pre className="mt-1 text-xs bg-rose-50 text-rose-800 p-4 rounded-xl overflow-x-auto max-w-full border border-rose-100 font-mono">{JSON.stringify(viewingLog.old_value, null, 2)}</pre>
                  </div>
                )}
                {viewingLog.new_value && (
                  <div>
                    <span className="text-xs text-text-muted uppercase tracking-wider font-bold">New Values</span>
                    <pre className="mt-1 text-xs bg-emerald-50 text-emerald-800 p-4 rounded-xl overflow-x-auto max-w-full border border-emerald-100 font-mono">{JSON.stringify(viewingLog.new_value, null, 2)}</pre>
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
