import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle,
  Calendar,
  TrendingUp,
  Users,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface QuoteStats {
  total: number;
  pending: number;
  contacted: number;
  booked: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  upcomingEvents: number;
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<QuoteStats>({
    total: 0,
    pending: 0,
    contacted: 0,
    booked: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentQuotes();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('status, quote_amount, event_date');

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats: QuoteStats = {
        total: data?.length || 0,
        pending: 0,
        contacted: 0,
        booked: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0,
        upcomingEvents: 0,
      };

      data?.forEach((quote) => {
        switch (quote.status) {
          case 'pending':
            stats.pending++;
            break;
          case 'contacted':
            stats.contacted++;
            break;
          case 'booked':
            stats.booked++;
            stats.totalRevenue += quote.quote_amount / 100;
            break;
          case 'completed':
            stats.completed++;
            stats.totalRevenue += quote.quote_amount / 100;
            break;
          case 'cancelled':
            stats.cancelled++;
            break;
        }

        const eventDate = new Date(quote.event_date);
        if (eventDate >= today && (quote.status === 'booked' || quote.status === 'contacted')) {
          stats.upcomingEvents++;
        }
      });

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentQuotes(data || []);
    } catch (error) {
      console.error('Error fetching recent quotes:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Quotes',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Booked Events',
      value: stats.booked,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      contacted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Contacted' },
      booked: { bg: 'bg-green-100', text: 'text-green-800', label: 'Booked' },
      completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    };

    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's your business summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.bgColor} rounded-lg p-3`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Upcoming Events</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.upcomingEvents}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Total Quotes</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Conversion Rate</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats.total > 0 ? Math.round(((stats.booked + stats.completed) / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700">Needs Attention</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.pending}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Quote Requests</h2>
          <div className="space-y-3">
            {recentQuotes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No quotes yet</p>
            ) : (
              recentQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{quote.name}</p>
                    <p className="text-xs text-gray-500">{quote.event_type}</p>
                  </div>
                  <div className="ml-4 flex items-center space-x-3">
                    <span className="text-sm font-semibold text-gray-900">
                      ${(quote.quote_amount / 100).toFixed(0)}
                    </span>
                    {getStatusBadge(quote.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
