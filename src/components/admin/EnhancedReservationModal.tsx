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
  History,
  MessageSquare,
  Edit,
  Tag,
  Star
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Quote } from '../../types/database.types';
import { formatCurrency, formatDate, getStatusColor, getPriorityColor, getPaymentStatusColor, calculatePriceBreakdown } from '../../utils/quoteHelpers';
import QuoteTimeline from './QuoteTimeline';
import CommunicationPanel from './CommunicationPanel';

interface EnhancedReservationModalProps {
  quote: Quote;
  onClose: () => void;
  onUpdate: () => void;
}

const EnhancedReservationModal: React.FC<EnhancedReservationModalProps> = ({
  quote,
  onClose,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'payment'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Quote>(quote);
  const [showCommunication, setShowCommunication] = useState(false);
  const [newTag, setNewTag] = useState('');

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
    } else if (name === 'quote_amount' || name === 'deposit_amount') {
      setFormData((prev) => ({ ...prev, [name]: Math.round(parseFloat(value) * 100) }));
    } else if (name === 'distance_from_mckinney') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          status: formData.status,
          priority: formData.priority,
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
          deposit_amount: formData.deposit_amount,
          payment_status: formData.payment_status,
          payment_method: formData.payment_method,
          tags: formData.tags,
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

  const { breakdown, total } = calculatePriceBreakdown(formData);

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'payment', label: 'Payment', icon: DollarSign },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reservation Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                Created {formatDate(quote.created_at)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCommunication(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex space-x-1 p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 max-h-[calc(100vh-350px)] overflow-y-auto">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
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
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(formData.status).bg} ${getStatusColor(formData.status).text}`}>
                        {getStatusColor(formData.status).label}
                      </span>
                    )}

                    {isEditing ? (
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="low">Low Priority</option>
                        <option value="normal">Normal Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(formData.priority).bg} ${getPriorityColor(formData.priority).text}`}>
                        {getPriorityColor(formData.priority).label}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-red-600" />
                      Customer Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900">{formData.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${formData.email}`} className="text-blue-600 hover:underline">
                          {formData.email}
                        </a>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="flex items-center space-x-2">
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
                        <p className="text-gray-900">{formatDate(formData.event_date)}</p>
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
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-red-600" />
                    Tags
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        placeholder="Add a tag..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

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
            )}

            {activeTab === 'timeline' && <QuoteTimeline quoteId={quote.id} />}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Price Breakdown</h3>
                  {breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="font-medium text-gray-900">${item.amount}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Calculated Total</span>
                    <span className="font-bold text-xl text-gray-900">${total}</span>
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
                        Current quote: {formatCurrency(formData.quote_amount)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    {isEditing ? (
                      <select
                        name="payment_status"
                        value={formData.payment_status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partially Paid</option>
                        <option value="paid">Paid in Full</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(formData.payment_status).bg} ${getPaymentStatusColor(formData.payment_status).text}`}>
                        {getPaymentStatusColor(formData.payment_status).label}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount</label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        name="deposit_amount"
                        value={(formData.deposit_amount / 100).toFixed(2)}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formatCurrency(formData.deposit_amount)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    {isEditing ? (
                      <select
                        name="payment_method"
                        value={formData.payment_method || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select method...</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">{formData.payment_method || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showCommunication && (
        <CommunicationPanel
          quote={quote}
          onClose={() => setShowCommunication(false)}
          onSent={() => {
            setShowCommunication(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
};

export default EnhancedReservationModal;
