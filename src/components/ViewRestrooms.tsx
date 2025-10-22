import React from 'react';
import { CheckCircle, Star, Users, Thermometer, Droplets, ArrowRight } from 'lucide-react';

type Page = 'home' | 'about' | 'restrooms' | 'quote';

interface ViewRestroomsProps {
  onNavigate: (page: Page) => void;
}

const ViewRestrooms: React.FC<ViewRestroomsProps> = ({ onNavigate }) => {
  const features = [
    'Climate-controlled environment',
    'Premium fixtures and finishes',
    'LED lighting system',
    'Running water with hot option',
    'Hand sanitizer dispensers',
    'Paper towel dispensers',
    'Luxury mirror and vanity area',
    'Non-slip flooring',
    'Spacious interior design',
    'Professional exterior appearance'
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 to-red-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Luxury Mobile Restrooms</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Experience the finest in mobile restroom facilities with premium amenities and elegant design.
          </p>
        </div>
      </section>

      {/* Main Restroom Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image placeholder - using a elegant background */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-12 text-center">
              <div className="w-32 h-32 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="text-white" size={64} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Mobile Restroom</h3>
              <p className="text-gray-600">High-resolution images available upon request</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Luxury That Travels to You
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our mobile restrooms feature all the comforts and conveniences you'd expect 
                from a high-end facility. Every unit is meticulously maintained and equipped 
                with premium amenities to ensure your guests enjoy a truly luxurious experience.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Thermometer className="text-red-800" size={24} />
                  <span className="text-lg text-gray-700">Climate Controlled</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Droplets className="text-red-800" size={24} />
                  <span className="text-lg text-gray-700">Running Water</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="text-red-800" size={24} />
                  <span className="text-lg text-gray-700">Spacious Interior</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="text-red-800" size={24} />
                  <span className="text-lg text-gray-700">Premium Finishes</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('quote')}
                className="bg-red-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <span>Get Your Quote</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Features & Amenities</h2>
            <p className="text-xl text-gray-600">Every detail designed for comfort and luxury</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                <span className="text-lg text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
            <p className="text-xl text-gray-600">Professional-grade facilities built to last</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Interior Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Spacious 8' x 4' interior</li>
                <li>• Porcelain toilet with foot flush</li>
                <li>• Stainless steel sink with soap dispenser</li>
                <li>• Vanity mirror with LED lighting</li>
                <li>• Paper towel and toilet paper dispensers</li>
                <li>• Hand sanitizer station</li>
                <li>• Non-slip vinyl flooring</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Exterior & Systems</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Professional exterior finish</li>
                <li>• Self-contained waste holding tank</li>
                <li>• Fresh water supply system</li>
                <li>• 12V electrical system with LED lights</li>
                <li>• Ventilation fan system</li>
                <li>• Easy-access service panels</li>
                <li>• Stabilizing jacks for setup</li>
                <li>• Weather-resistant construction</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Add-On Services */}
      <section className="py-16 px-4 bg-red-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
            <p className="text-xl">Enhance your rental with these premium add-ons</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-10 p-8 rounded-xl">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cleaning Service Attendant</h3>
              <p className="text-lg mb-4 opacity-90">
                Professional attendant to maintain cleanliness throughout your event. 
                Includes restocking supplies and continuous monitoring.
              </p>
              <p className="text-xl font-bold">+$150</p>
            </div>

            <div className="bg-white bg-opacity-10 p-8 rounded-xl">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <Star className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Baby Changing Station</h3>
              <p className="text-lg mb-4 opacity-90">
                Convenient, safe changing station for families with young children. 
                Includes diaper disposal and additional supplies.
              </p>
              <p className="text-xl font-bold">+$100</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Book Your Luxury Rental?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today for availability and pricing for your special event.
          </p>
          <button
            onClick={() => onNavigate('quote')}
            className="bg-red-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
          >
            Request Your Quote Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default ViewRestrooms;