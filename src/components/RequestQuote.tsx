import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Users, DollarSign, CheckCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const RequestQuote: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    customEventType: '',
    guestCount: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    eventLocation: '',
    distanceFromMckinney: '',
    waterConnection: '',
    cleaningAttendant: false,
    babyChangingStation: false,
    additionalRequests: ''
  });

  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [quote, setQuote] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventTypes = [
    'Wedding',
    'Birthday Party',
    'Family Reunion',
    'Festival',
    'Concert',
    'Football Tailgate',
    'Company Function',
    'High School Reunion',
    'High School/College Graduation',
    'Crawfish Boil',
    'Baby Shower',
    'Other Type of Event'
  ];

  const guestCounts = [
    '0-50',
    '50-100',
    '100-150',
    '150-200',
    '200-300',
    '300-500'
  ];

  const calculateQuote = () => {
    // Determine base price based on event duration
    let basePrice = 995; // Base price for less than 6 hours

    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      if (diffHours > 6) {
        basePrice = 1300;
      }
    }

    // Add guest count surcharge
    switch (formData.guestCount) {
      case '100-150':
        basePrice += 100;
        break;
      case '150-200':
        basePrice += 150;
        break;
      case '200-300':
        basePrice += 200;
        break;
      case '300-500':
        basePrice += 400;
        break;
      default:
        // No additional charge for 0-50 and 50-100
        break;
    }

    // Add distance surcharge (after 20 miles from McKinney, TX)
    const distance = parseInt(formData.distanceFromMckinney) || 0;
    if (distance > 20) {
      const extraMiles = distance - 20;
      basePrice += extraMiles * 3;
    }

    // Add optional services
    if (formData.cleaningAttendant) {
      basePrice += 150;
    }
    if (formData.babyChangingStation) {
      basePrice += 100;
    }

    return basePrice;
  };

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=5`,
        {
          headers: {
            'User-Agent': 'MelroseMobileRestrooms/1.0'
          }
        }
      );
      const data = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  const calculateDistance = (lat: number, lon: number) => {
    const originLat = 33.1972465;
    const originLon = -96.6397212;

    const R = 3958.8;
    const dLat = (lat - originLat) * Math.PI / 180;
    const dLon = (lon - originLon) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(originLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    setFormData(prev => ({ ...prev, distanceFromMckinney: Math.round(distance).toString() }));
  };

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setFormData(prev => ({ ...prev, eventLocation: suggestion.display_name }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
    calculateDistance(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      if (name === 'eventLocation') {
        if (suggestionTimeoutRef.current) {
          clearTimeout(suggestionTimeoutRef.current);
        }

        suggestionTimeoutRef.current = setTimeout(() => {
          fetchAddressSuggestions(value);
        }, 300);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const calculatedQuote = calculateQuote();

    try {
      console.log('Attempting to save quote to Supabase...');
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

      const quoteData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        event_type: formData.eventType,
        custom_event_type: formData.eventType === 'Other Type of Event' ? formData.customEventType : null,
        guest_count: formData.guestCount,
        event_date: formData.eventDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        event_location: formData.eventLocation,
        distance_from_mckinney: parseInt(formData.distanceFromMckinney) || 0,
        water_connection: formData.waterConnection,
        cleaning_attendant: formData.cleaningAttendant,
        baby_changing_station: formData.babyChangingStation,
        additional_requests: formData.additionalRequests || null,
        quote_amount: calculatedQuote * 100,
        status: 'pending' as const
      };

      console.log('Quote data to insert:', quoteData);

      const { data, error } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        alert(`Database error: ${error.message}. Your quote was calculated but not saved. Please contact us directly.`);
      } else {
        console.log('Quote saved successfully:', data);
      }

      setQuote(calculatedQuote);
      setSubmitted(true);
    } catch (error) {
      console.error('Unexpected error submitting quote:', error);
      alert('An unexpected error occurred. Please contact us directly at (469) 355-4659.');
      setQuote(calculatedQuote);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.email && formData.phone && 
           formData.eventType && formData.guestCount && 
           formData.eventDate && formData.startTime && formData.endTime &&
           formData.eventLocation && formData.distanceFromMckinney &&
           formData.waterConnection;
  };

  if (submitted && quote !== null) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Quote is Ready!</h2>
            
            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Event Type:</strong> {formData.eventType === 'Other Type of Event' ? formData.customEventType : formData.eventType}</p>
                  <p><strong>Guest Count:</strong> {formData.guestCount}</p>
                  <p><strong>Date:</strong> {formData.eventDate}</p>
                  <p><strong>Location:</strong> {formData.eventLocation}</p>
                </div>
                <div>
                  <p><strong>Time:</strong> {formData.startTime} - {formData.endTime}</p>
                  <p><strong>Distance from Dispatch Office:</strong> {formData.distanceFromMckinney} miles</p>
                  <p><strong>Water Connection:</strong> {formData.waterConnection}</p>
                  {formData.cleaningAttendant && <p><strong>✓</strong> Cleaning Attendant (+$150)</p>}
                  {formData.babyChangingStation && <p><strong>✓</strong> Baby Changing Station (+$100)</p>}
                </div>
              </div>
            </div>

            <div className="bg-red-800 text-white rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Total Quote</h3>
              <div className="text-5xl font-bold mb-2">${quote.toLocaleString()}</div>
              <p className="text-red-200">*Final pricing subject to location and availability</p>
            </div>

            <div className="text-gray-600 mb-8">
              <p className="mb-4">
                Thank you for your interest in Melrose Mobile Restrooms! We'll contact you within 24 hours 
                to confirm availability and finalize your booking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+14693554659"
                  className="bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Call Us: (469) 355-4659
                </a>
                <a
                  href="mailto:info@melrosemobilerestrooms.com"
                  className="border-2 border-red-800 text-red-800 px-6 py-3 rounded-lg font-semibold hover:bg-red-800 hover:text-white transition-colors"
                >
                  Email Us
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                setQuote(null);
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  eventType: '',
                  customEventType: '',
                  guestCount: '',
                  eventDate: '',
                  startTime: '',
                  endTime: '',
                  eventLocation: '',
                  distanceFromMckinney: '',
                  waterConnection: '',
                  cleaningAttendant: false,
                  babyChangingStation: false,
                  additionalRequests: ''
                });
              }}
              className="text-red-800 hover:text-red-600 font-semibold"
            >
              Request Another Quote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 to-red-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Request Your Quote</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get personalized pricing for your event in minutes. We'll contact you within 24 hours.
          </p>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Event Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Event *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Event Type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {formData.eventType === 'Other Type of Event' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please specify event type
                    </label>
                    <input
                      type="text"
                      name="customEventType"
                      value={formData.customEventType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How Many Guests? *
                  </label>
                  <select
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Guest Count</option>
                    {guestCounts.map((count) => (
                      <option key={count} value={count}>{count}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Time and Additional Options */}
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Event Time</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Location *
                  </label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleInputChange}
                    onFocus={() => {
                      if (addressSuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    required
                    placeholder="Start typing your address..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    autoComplete="off"
                  />
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddressSelect(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <p className="text-sm text-gray-900">{suggestion.display_name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Address suggestions will appear as you type
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance from Dispatch Office (miles) *
                  </label>
                  <input
                    type="number"
                    name="distanceFromMckinney"
                    value={formData.distanceFromMckinney}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder={isCalculatingDistance ? "Calculating..." : "Auto-calculated from address"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Free delivery within 20 miles. $3 per mile after 20 miles.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you have a water connection? *
                  </label>
                  <select
                    name="waterConnection"
                    value={formData.waterConnection}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Please select</option>
                    <option value="Yes, we have a water connection">Yes, we have a water connection</option>
                    <option value="No, please provide water">No, please provide water</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    A standard water connection is all that's needed. (If not we can provide water)
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Services</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      name="cleaningAttendant"
                      checked={formData.cleaningAttendant}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Cleaning Service Attendant (+$150)
                      </label>
                      <p className="text-sm text-gray-500">
                        Professional attendant to maintain cleanliness throughout your event
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      name="babyChangingStation"
                      checked={formData.babyChangingStation}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Baby Changing Station (+$100)
                      </label>
                      <p className="text-sm text-gray-500">
                        Convenient changing station for families with young children
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Requests or Questions
                  </label>
                  <textarea
                    name="additionalRequests"
                    value={formData.additionalRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Please let us know if you have any special requirements or questions..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2 mx-auto ${
                  isFormValid()
                    ? 'bg-red-800 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={20} />
                <span>Get My Quote</span>
              </button>
              <p className="text-sm text-gray-500 mt-2">
                We'll contact you within 24 hours with your personalized quote
              </p>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
};

export default RequestQuote;