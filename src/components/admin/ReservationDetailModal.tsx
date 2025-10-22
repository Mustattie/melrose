import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Quote {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  custom_event_type: string | null;
  guest_count: string;
  event_date: string;
  start_time: string;
  end_time: string;
  event_location: string;
  distance_from_mckinney: number;
  water_connection: string;
  cleaning_attendant: boolean;
  baby_changing_station: boolean;
  additional_requests: string | null;
  quote_amount: number;
  status: string;
  admin_notes: string | null;
  updated_at?: string;
}

interface ReservationDetailModalProps {
  quote: Quote;
  onClose: () => void;
  onUpdate: () => void;
}

const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  quote,
  onClose,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Quote>(quote);

  useEffect(() => {
    setFormData(quote);
  }, [quote]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'quote_amount') {
      setFormData((prev) => ({ ...prev, [name]: Math.round(parseFloat(value) * 100) }));
    } else if (name === 'distance_from_mckinney') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          status: formData.status,
          admin_notes: formData.admin_notes,
          event_date: formData.event_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          event_location: formData.event_location,
          distance_from_mckinney: formData.distance_from_mckinney,
          water_connection: formData.water_connection,
          cleaning_attendant: formData.cleaning_attendant,
          baby_changing_station: formData.baby_changing_station,
          quote_amount: formData.quote_amount,
          guest_count: formData.guest_count,
          last_updated_by: user?.id,
        })
        .eq('id', quote.id);

      if (error) throw error;

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Failed to update quote. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const calculatePriceBreakdown = () => {
    let basePrice = 995;
    const breakdown: { label: string; amount: number }[] = [];

    const start = new Date(`2000-01-01T${formData.start_time}`);
    const end = new Date(`2000-01-01T${formData.end_time}`);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (diffHours > 6) {
      basePrice = 1300;
      breakdown.push({ label: 'Base Price (>6 hours)', amount: 1300 });
    } else {
      breakdown.push({ label: 'Base Price (<6 hours)', amount: 995 });
    }

    const guestSurcharges: Record<string, number> = {
      '100-150': 100,
      '150-200': 150,
      '200-300': 200,
      '300-500': 400,
    };

    if (guestSurcharges[formData.guest_count]) {
      breakdown.push({
        label: `Guest Count Surcharge (${formData.guest_count})`,
        amount: guestSurcharges[formData.guest_count],
      });
    }

    if (formData.distance_from_mckinney > 20) {
      const extraMiles = formData.distance_from_mckinney - 20;
      const distanceFee = extraMiles * 3;
      breakdown.push({ label: `Distance Fee (${extraMiles} miles × $3)`, amount: distanceFee });
    }

    if (formData.cleaning_attendant) {
      breakdown.push({ label: 'Cleaning Attendant', amount: 150 });
    }

    if (formData.baby_changing_station) {
      breakdown.push({ label: 'Baby Changing Station', amount: 100 });
    }

    return breakdown;
  };

  const breakdown = calculatePriceBreakdown();
  const calculatedTotal = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reservation Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Created {new Date(quote.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              getStatusBadge(formData.status)
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-red-600" />
                Customer Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <span>{formData.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${formData.email}`} className="text-blue-600 hover:underline">
                    {formData.email}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${formData.phone}`} className="text-blue-600 hover:underline">
                    {formData.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-red-600" />
                Event Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <p className="text-gray-900">
                  {formData.event_type === 'Other Type of Event' && formData.custom_event_type
                    ? formData.custom_event_type
                    : formData.event_type}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count</label>
                {isEditing ? (
                  <select
                    name="guest_count"
                    value={formData.guest_count}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="0-50">0-50</option>
                    <option value="50-100">50-100</option>
                    <option value="100-150">100-150</option>
                    <option value="150-200">150-200</option>
                    <option value="200-300">200-300</option>
                    <option value="300-500">300-500</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{formData.guest_count} guests</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {new Date(formData.event_date).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <input
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {formData.start_time} - {formData.end_time}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Location
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="event_location"
                  value={formData.event_location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formData.event_location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance from McKinney
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="distance_from_mckinney"
                  value={formData.distance_from_mckinney}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formData.distance_from_mckinney} miles</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Water Connection
              </label>
              {isEditing ? (
                <select
                  name="water_connection"
                  value={formData.water_connection}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{formData.water_connection}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-red-600" />
              Pricing
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-gray-900">${item.amount}</span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">${calculatedTotal}</span>
              </div>

              {isEditing && (
                <div className="pt-2 mt-2 border-t border-gray-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Override Quote Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="quote_amount"
                    value={(formData.quote_amount / 100).toFixed(2)}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current quote: ${(formData.quote_amount / 100).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                {isEditing ? (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="cleaning_attendant"
                      checked={formData.cleaning_attendant}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Cleaning Attendant (+$150)</span>
                  </label>
                ) : (
                  <>
                    <span className="text-sm text-gray-700">
                      Cleaning Attendant: {formData.cleaning_attendant ? '✓' : '✗'}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center">
                {isEditing ? (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="baby_changing_station"
                      checked={formData.baby_changing_station}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Baby Changing Station (+$100)</span>
                  </label>
                ) : (
                  <>
                    <span className="text-sm text-gray-700">
                      Baby Changing Station: {formData.baby_changing_station ? '✓' : '✗'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {formData.additional_requests && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-red-600" />
                Additional Requests
              </h3>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                {formData.additional_requests}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Admin Notes
            </h3>
            {isEditing ? (
              <textarea
                name="admin_notes"
                value={formData.admin_notes || ''}
                onChange={handleInputChange}
                rows={4}
                placeholder="Add internal notes about this reservation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                {formData.admin_notes || 'No notes added yet'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setFormData(quote);
                  setIsEditing(false);
                }}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
