import { Quote } from '../types/database.types';

export const formatCurrency = (cents: number): string => {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const getStatusColor = (status: string): { bg: string; text: string; label: string } => {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    contacted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Contacted' },
    booked: { bg: 'bg-green-100', text: 'text-green-800', label: 'Booked' },
    completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
  };
  return colors[status] || colors.pending;
};

export const getPriorityColor = (priority: string): { bg: string; text: string; label: string } => {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    low: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Low' },
    normal: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Normal' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
    urgent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgent' },
  };
  return colors[priority] || colors.normal;
};

export const getPaymentStatusColor = (status: string): { bg: string; text: string; label: string } => {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    unpaid: { bg: 'bg-red-100', text: 'text-red-800', label: 'Unpaid' },
    partial: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Partial' },
    paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' },
  };
  return colors[status] || colors.unpaid;
};

export const calculateEventDuration = (startTime: string, endTime: string): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

export const calculatePriceBreakdown = (quote: Partial<Quote>) => {
  let basePrice = 995;
  const breakdown: { label: string; amount: number }[] = [];

  if (quote.start_time && quote.end_time) {
    const duration = calculateEventDuration(quote.start_time, quote.end_time);
    if (duration > 6) {
      basePrice = 1300;
      breakdown.push({ label: 'Base Price (>6 hours)', amount: 1300 });
    } else {
      breakdown.push({ label: 'Base Price (≤6 hours)', amount: 995 });
    }
  }

  const guestSurcharges: Record<string, number> = {
    '100-150': 100,
    '150-200': 150,
    '200-300': 200,
    '300-500': 400,
  };

  if (quote.guest_count && guestSurcharges[quote.guest_count]) {
    breakdown.push({
      label: `Guest Count Surcharge (${quote.guest_count})`,
      amount: guestSurcharges[quote.guest_count],
    });
  }

  if (quote.distance_from_mckinney && quote.distance_from_mckinney > 20) {
    const extraMiles = quote.distance_from_mckinney - 20;
    const distanceFee = extraMiles * 3;
    breakdown.push({ label: `Distance Fee (${extraMiles} mi × $3)`, amount: distanceFee });
  }

  if (quote.cleaning_attendant) {
    breakdown.push({ label: 'Cleaning Attendant', amount: 150 });
  }

  if (quote.baby_changing_station) {
    breakdown.push({ label: 'Baby Changing Station', amount: 100 });
  }

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return { breakdown, total };
};

export const isEventUpcoming = (eventDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(eventDate);
  return event >= today;
};

export const isQuoteOverdue = (createdAt: string, status: string): boolean => {
  if (status !== 'pending') return false;
  const created = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursDiff > 48;
};

export const getEventTimeRemaining = (eventDate: string): string => {
  const now = new Date();
  const event = new Date(eventDate);
  const diffMs = event.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Past event';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
  return `${Math.floor(diffDays / 30)} months`;
};

export const exportToCSV = (quotes: Quote[], filename: string = 'quotes.csv') => {
  const headers = [
    'ID', 'Created At', 'Customer Name', 'Email', 'Phone',
    'Event Type', 'Event Date', 'Start Time', 'End Time',
    'Location', 'Guest Count', 'Quote Amount', 'Status',
    'Payment Status', 'Priority', 'Tags'
  ];

  const rows = quotes.map(quote => [
    quote.id,
    formatDateTime(quote.created_at),
    quote.name,
    quote.email,
    quote.phone,
    quote.event_type === 'Other Type of Event' ? quote.custom_event_type || quote.event_type : quote.event_type,
    formatDate(quote.event_date),
    quote.start_time,
    quote.end_time,
    quote.event_location,
    quote.guest_count,
    formatCurrency(quote.quote_amount),
    quote.status,
    quote.payment_status,
    quote.priority,
    quote.tags.join('; ')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const replaceTemplateVariables = (template: string, quote: Quote): string => {
  const variables: Record<string, string> = {
    '{customer_name}': quote.name,
    '{quote_amount}': formatCurrency(quote.quote_amount),
    '{event_type}': quote.event_type === 'Other Type of Event' ? quote.custom_event_type || quote.event_type : quote.event_type,
    '{event_date}': formatDate(quote.event_date),
    '{start_time}': quote.start_time,
    '{end_time}': quote.end_time,
    '{event_location}': quote.event_location,
    '{guest_count}': quote.guest_count,
    '{deposit_amount}': formatCurrency(quote.deposit_amount || 0),
    '{balance_due}': formatCurrency((quote.quote_amount || 0) - (quote.deposit_amount || 0)),
  };

  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });

  return result;
};
