import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, Send, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Quote, EmailTemplate } from '../../types/database.types';
import { replaceTemplateVariables } from '../../utils/quoteHelpers';
import { useAuth } from '../../contexts/AuthContext';

interface CommunicationPanelProps {
  quote: Quote;
  onClose: () => void;
  onSent: () => void;
}

const CommunicationPanel: React.FC<CommunicationPanelProps> = ({ quote, onClose, onSent }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'note'>('email');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('category');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(replaceTemplateVariables(template.subject, quote));
      setMessage(replaceTemplateVariables(template.body, quote));
      setSelectedTemplate(templateId);
    }
  };

  const handleSend = async () => {
    try {
      setSending(true);

      const communication = {
        quote_id: quote.id,
        sent_by: user?.id,
        communication_type: activeTab,
        subject: activeTab === 'email' ? subject : null,
        message: message,
        status: 'sent'
      };

      const { error } = await supabase
        .from('customer_communications')
        .insert(communication);

      if (error) throw error;

      await supabase
        .from('quotes')
        .update({ last_contacted_at: new Date().toISOString() })
        .eq('id', quote.id);

      alert('Communication logged successfully!');
      onSent();
      onClose();
    } catch (error) {
      console.error('Error logging communication:', error);
      alert('Failed to log communication');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Contact Customer</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{quote.name}</p>
                <p className="text-sm text-gray-600">{quote.email} • {quote.phone}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {quote.event_type} on {new Date(quote.event_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'email'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'phone'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Phone Call</span>
            </button>
            <button
              onClick={() => setActiveTab('note')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'note'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Note</span>
            </button>
          </div>

          {activeTab === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template (Optional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This will log the email communication but won't actually send it.
                  You'll need to copy the content and send it through your email client.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'phone' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <a
                    href={`tel:${quote.phone}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {quote.phone}
                  </a>
                </div>
                <p className="text-sm text-blue-800 mt-2">
                  Click the phone number above to call, then log your call notes below.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call Notes *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="What did you discuss? Any follow-up needed?"
                />
              </div>
            </div>
          )}

          {activeTab === 'note' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Note *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Add an internal note about this quote..."
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Internal notes are not visible to the customer.
                  They're for your team's reference only.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !message || (activeTab === 'email' && !subject)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>{sending ? 'Logging...' : 'Log Communication'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPanel;
