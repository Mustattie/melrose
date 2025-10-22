import React, { useState, useEffect } from 'react';
import { Clock, User, Mail, Phone, FileText, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { QuoteHistory, CustomerCommunication } from '../../types/database.types';
import { formatDateTime } from '../../utils/quoteHelpers';

interface QuoteTimelineProps {
  quoteId: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'history' | 'communication';
  data: QuoteHistory | CustomerCommunication;
}

const QuoteTimeline: React.FC<QuoteTimelineProps> = ({ quoteId }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, [quoteId]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);

      const [historyResult, communicationsResult] = await Promise.all([
        supabase
          .from('quote_history')
          .select('*')
          .eq('quote_id', quoteId)
          .order('changed_at', { ascending: false }),
        supabase
          .from('customer_communications')
          .select('*')
          .eq('quote_id', quoteId)
          .order('sent_at', { ascending: false })
      ]);

      const allEvents: TimelineEvent[] = [];

      if (historyResult.data) {
        historyResult.data.forEach(h => {
          allEvents.push({
            id: h.id,
            timestamp: h.changed_at,
            type: 'history',
            data: h as QuoteHistory
          });
        });
      }

      if (communicationsResult.data) {
        communicationsResult.data.forEach(c => {
          allEvents.push({
            id: c.id,
            timestamp: c.sent_at,
            type: 'communication',
            data: c as CustomerCommunication
          });
        });
      }

      allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryEvent = (history: QuoteHistory) => {
    let icon = <Clock className="w-4 h-4" />;
    let color = 'text-gray-500';
    let bgColor = 'bg-gray-100';
    let description = '';

    switch (history.change_type) {
      case 'create':
        icon = <CheckCircle className="w-4 h-4" />;
        color = 'text-green-600';
        bgColor = 'bg-green-100';
        description = 'Quote created';
        break;
      case 'status_change':
        icon = <CheckCircle className="w-4 h-4" />;
        color = 'text-blue-600';
        bgColor = 'bg-blue-100';
        description = `Status changed from "${history.old_value}" to "${history.new_value}"`;
        break;
      case 'update':
        icon = <FileText className="w-4 h-4" />;
        color = 'text-purple-600';
        bgColor = 'bg-purple-100';
        description = `${history.field_name} updated`;
        break;
      case 'note_added':
        icon = <FileText className="w-4 h-4" />;
        color = 'text-yellow-600';
        bgColor = 'bg-yellow-100';
        description = 'Admin notes updated';
        break;
    }

    return (
      <div className="flex items-start space-x-3">
        <div className={`${bgColor} rounded-full p-2 ${color}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{description}</p>
          <p className="text-xs text-gray-500">{formatDateTime(history.changed_at)}</p>
        </div>
      </div>
    );
  };

  const renderCommunicationEvent = (comm: CustomerCommunication) => {
    let icon = <Mail className="w-4 h-4" />;
    let color = 'text-blue-600';
    let bgColor = 'bg-blue-100';

    switch (comm.communication_type) {
      case 'phone':
        icon = <Phone className="w-4 h-4" />;
        color = 'text-green-600';
        bgColor = 'bg-green-100';
        break;
      case 'sms':
        icon = <Mail className="w-4 h-4" />;
        color = 'text-purple-600';
        bgColor = 'bg-purple-100';
        break;
      case 'note':
        icon = <FileText className="w-4 h-4" />;
        color = 'text-yellow-600';
        bgColor = 'bg-yellow-100';
        break;
    }

    return (
      <div className="flex items-start space-x-3">
        <div className={`${bgColor} rounded-full p-2 ${color}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {comm.communication_type.charAt(0).toUpperCase() + comm.communication_type.slice(1)}: {comm.subject || 'No subject'}
          </p>
          <p className="text-xs text-gray-600 mt-1">{comm.message}</p>
          <div className="flex items-center mt-1 space-x-2">
            <p className="text-xs text-gray-500">{formatDateTime(comm.sent_at)}</p>
            {comm.status && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                comm.status === 'sent' || comm.status === 'delivered' ? 'bg-green-100 text-green-800' :
                comm.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {comm.status}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative pl-12">
              <div className="absolute left-0 -ml-0.5">
                {event.type === 'history'
                  ? renderHistoryEvent(event.data as QuoteHistory)
                  : renderCommunicationEvent(event.data as CustomerCommunication)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteTimeline;
