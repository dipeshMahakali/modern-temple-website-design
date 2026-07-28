import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Eye, RefreshCw, Phone, User, Calendar, MessageSquare } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [unreadOnly]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/contact/messages', {
        params: { unread_only: unreadOnly, limit: 100 }
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.post(`/admin/contact/messages/${id}/read`);
      setMessages(messages.map(msg => msg.id === id ? { ...msg, is_read: true } : msg));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
      toast.success('Message marked as read');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#6B1F1F]">Devotee Inquiries</h1>
          <p className="text-sm text-[#777777]">Read and manage feedback, questions, and requests submitted via the public contact form.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              unreadOnly
                ? 'bg-[#6B1F1F] text-white border-[#6B1F1F] shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {unreadOnly ? 'Showing Unread Only' : 'Show All Messages'}
          </button>
          <button
            onClick={fetchMessages}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#777777] transition-all"
            title="Reload messages"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#C8A45A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading messages from server...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gold-border/20 shadow-md p-12 text-center text-gray-400">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-55" />
          <p className="text-sm">No messages found matching the selected filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gold-border/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFDF8] border-b border-gold-border/10 text-xs font-bold uppercase tracking-wider text-[#6B1F1F]">
                  <th className="py-4 px-6">Devotee</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-border/5 text-sm text-[#2C2C2C]">
                {messages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-[#FFFDF8]/40 transition-colors ${!msg.is_read ? 'bg-[#FFFDF8]/20 font-medium' : ''}`}>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{msg.name}</div>
                        <div className="text-xs text-gray-500">{msg.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="truncate max-w-xs text-gray-700">{msg.subject || 'No Subject'}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs">{msg.message}</div>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider ${
                        msg.is_read
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200 animate-pulse'
                      }`}>
                        {msg.is_read ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="p-1.5 rounded-lg border border-gold-border/20 text-[#6B1F1F] bg-[#FFFDF8] hover:bg-[#C8A45A]/10 transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      {!msg.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(msg.id)}
                          className="p-1.5 rounded-lg border border-green-200 text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                          title="Mark as Read"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gold-border/20"
          >
            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#6B1F1F]">
                  Inquiry Details
                </h3>
                <p className="text-xs text-gray-500">
                  Received on {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                selectedMessage.is_read ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                {selectedMessage.is_read ? 'Read' : 'New'}
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-1">
                    <User size={12} />
                    <span>Sender Name</span>
                  </div>
                  <span className="font-semibold text-gray-800">{selectedMessage.name}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-1">
                    <Mail size={12} />
                    <span>Email Address</span>
                  </div>
                  <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-[#6B1F1F] hover:underline truncate block">
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              {selectedMessage.phone && (
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-1">
                    <Phone size={12} />
                    <span>Contact Number</span>
                  </div>
                  <span className="font-semibold text-gray-800">{selectedMessage.phone}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Subject</label>
                <div className="p-3 bg-gray-50 rounded-xl font-semibold text-gray-800">
                  {selectedMessage.subject || 'No Subject'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Message Body</label>
                <div className="p-4 bg-[#FFFDF8] border border-gold-border/10 rounded-xl text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
              {!selectedMessage.is_read && (
                <button
                  onClick={() => {
                    handleMarkAsRead(selectedMessage.id);
                  }}
                  className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-all shadow-md"
                >
                  <CheckCircle size={16} />
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
