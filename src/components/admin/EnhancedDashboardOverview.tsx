import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle,
  Calendar,
  TrendingUp,
  Users,
  AlertCircle,
  Phone,
  Mail,
  Eye,
  ArrowUp,
  ArrowDown,
  Download,
  Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Quote, QuoteStats } from '../../types/database.types';
import { formatCurrency, formatDate, getStatusColor, isQuoteOverdue, isEventUpcoming, exportToCSV } from '../../utils/quoteHelpers';

interface EnhancedDashboardOverviewProps {
  onViewDetails: (quote: Quote) => void;
}

const EnhancedDashboardOverview: React.FC<EnhancedDashboardOverviewProps> = ({ onViewDetails }) => {
  const [stats, setStats] = useState<QuoteStats>({
    total: 0,
    pending: 0,
    contacted: 0,
    booked: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    upcomingEvents: 0,
    avgResponseTime: 0,
    conversionRate: 0,
    pendingFollowUps: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [urgentQuotes, setUrgentQuotes] = useState<Quote[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Quote[]>([]);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      let query = supabase.from('quotes').select('*');

      if (dateRange !== 'all') {
        const now = new Date();
        let startDate = new Date();

        if (dateRange === 'today') {
          startDate.setHours(0, 0, 0, 0);
        } else if (dateRange === 'week') {
          startDate.setDate(now.getDate() - 7);
        } else if (dateRange === 'month') {
          startDate.setMonth(now.getMonth() - 1);
        }

        query = query.gte('created_at', startDate.toISOString());
      }

      const { data: quotes, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      if (quotes) {
        calculateStats(quotes);
        setRecentQuotes(quotes.slice(0, 5));

        const urgent = quotes.filter(q =>
          isQuoteOverdue(q.created_at, q.status) ||
          q.priority === 'urgent' ||
          q.priority === 'high'
        ).slice(0, 5);
        setUrgentQuotes(urgent);

        const upcoming = quotes
          .filter(q =>
            (q.status === 'booked' || q.status === 'contacted') &&
            isEventUpcoming(q.event_date)
          )
          .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
          .slice(0, 5);
        setUpcomingEvents(upcoming);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (quotes: Quote[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newStats: QuoteStats = {
      total: quotes.length,
      pending: 0,
      contacted: 0,
      booked: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
      upcomingEvents: 0,
      avgResponseTime: 0,
      conversionRate: 0,
      pendingFollowUps: 0
    };

    let totalResponseTime = 0;
    let responseCounted = 0;

    quotes.forEach((quote) => {
      switch (quote.status) {
        case 'pending':
          newStats.pending++;
          if (isQuoteOverdue(quote.created_at, quote.status)) {
            newStats.pendingFollowUps++;
          }
          break;
        case 'contacted':
          newStats.contacted++;
          break;
        case 'booked':
          newStats.booked++;
          newStats.totalRevenue += quote.quote_amount / 100;
          break;
        case 'completed':
          newStats.completed++;
          newStats.totalRevenue += quote.quote_amount / 100;
          break;
        case 'cancelled':
          newStats.cancelled++;
          break;
      }

      const eventDate = new Date(quote.event_date);
      if (eventDate >= today && (quote.status === 'booked' || quote.status === 'contacted')) {
        newStats.upcomingEvents++;
      }

      if (quote.last_contacted_at && quote.status !== 'pending') {
        const created = new Date(quote.created_at);
        const contacted = new Date(quote.last_contacted_at);
        const responseTime = (contacted.getTime() - created.getTime()) / (1000 * 60 * 60);
        totalResponseTime += responseTime;
        responseCounted++;
      }
    });

    if (responseCounted > 0) {
      newStats.avgResponseTime = totalResponseTime / responseCounted;
    }

    if (newStats.total > 0) {
      newStats.conversionRate = ((newStats.booked + newStats.completed) / newStats.total) * 100;
    }

    setStats(newStats);
  };

  const handleExport = async () => {
    try {
      const { data: quotes, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (quotes) {
        exportToCSV(quotes as Quote[], `quotes-export-${new Date().toISOString().split('T')[0]}.csv`);
      }
    } catch (error) {
      console.error('Error exporting quotes:', error);
      alert('Failed to export quotes');
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
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Pending Quotes',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      subtitle: stats.pendingFollowUps > 0 ? `${stats.pendingFollowUps} need attention` : undefined,
      alert: stats.pendingFollowUps > 0
    },
    {
      title: 'Booked Events',
      value: stats.booked,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subtitle: `${stats.upcomingEvents} upcoming`,
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+8%',
      trendUp: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's your business summary.</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm p-6 border ${card.alert ? 'border-yellow-300 ring-2 ring-yellow-100' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  )}
                  {card.trend && (
                    <div className={`flex items-center mt-2 text-sm ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {card.trendUp ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                      <span className="font-medium">{card.trend}</span>
                      <span className="text-gray-500 ml-1">vs last period</span>
                    </div>
                  )}
                </div>
                <div className={`${card.bgColor} rounded-lg p-3`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Conversion Rate</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats.conversionRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Avg Response Time</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats.avgResponseTime > 0 ? `${stats.avgResponseTime.toFixed(1)}h` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700">Needs Follow-up</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.pendingFollowUps}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Upcoming Events</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.upcomingEvents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Urgent Attention Required</h2>
          <div className="space-y-3">
            {urgentQuotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mb-2 text-green-500" />
                <p className="font-medium">All caught up!</p>
                <p className="text-sm">No urgent items require attention</p>
              </div>
            ) : (
              urgentQuotes.map((quote) => {
                const statusBadge = getStatusColor(quote.status);
                const isOverdue = isQuoteOverdue(quote.created_at, quote.status);

                return (
                  <div
                    key={quote.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${isOverdue ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'} hover:shadow-md transition-shadow cursor-pointer`}
                    onClick={() => onViewDetails(quote)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{quote.name}</p>
                        {isOverdue && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{quote.event_type} • {formatDate(quote.event_date)}</p>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(quote.quote_amount)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <a
                          href={`tel:${quote.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Call customer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`mailto:${quote.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Email customer"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => onViewDetails(quote)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Quotes</h2>
          <div className="space-y-3">
            {recentQuotes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No quotes yet</p>
            ) : (
              recentQuotes.map((quote) => {
                const statusBadge = getStatusColor(quote.status);
                return (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => onViewDetails(quote)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{quote.name}</p>
                      <p className="text-xs text-gray-500">{quote.event_type} • {formatDate(quote.event_date)}</p>
                    </div>
                    <div className="ml-4 flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(quote.quote_amount)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
            ) : (
              upcomingEvents.map((quote) => {
                const daysUntil = Math.ceil((new Date(quote.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                    onClick={() => onViewDetails(quote)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{quote.name}</p>
                      <p className="text-xs text-gray-600">{formatDate(quote.event_date)} • {quote.start_time}</p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        daysUntil <= 3 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboardOverview;
