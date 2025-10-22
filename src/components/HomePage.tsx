import React from 'react';
import { Star, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';

type Page = 'home' | 'about' | 'restrooms' | 'quote';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 to-red-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Luxury Mobile Restroom Rentals
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Elevate your special event with our premium mobile restroom facilities. 
            Clean, elegant, and professionally maintained.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('quote')}
              className="bg-yellow-500 hover:bg-yellow-400 text-red-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Get Your Quote</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => onNavigate('restrooms')}
              className="border-2 border-white text-white hover:bg-white hover:text-red-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              View Our Restrooms
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Melrose Mobile Restrooms?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide luxury mobile restroom solutions that exceed expectations for any event.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="text-red-800" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Our luxury mobile restrooms feature high-end finishes, climate control, and premium amenities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-red-800" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Experienced team ensures timely delivery, setup, and maintenance throughout your event.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-red-800" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfect for Any Event</h3>
              <p className="text-gray-600 leading-relaxed">
                Weddings, corporate events, festivals, and private parties - we serve them all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Complete Event Solutions
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                From intimate gatherings to large celebrations, our mobile restroom rentals 
                provide the comfort and convenience your guests deserve.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-lg text-gray-700">Climate-controlled interiors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-lg text-gray-700">Premium amenities and fixtures</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-lg text-gray-700">Professional cleaning and maintenance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-lg text-gray-700">Flexible rental periods</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('about')}
                className="mt-8 bg-red-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
              >
                Learn More About Us
              </button>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-red-50 p-8 rounded-xl">
              <div className="text-center">
                <div className="w-24 h-24 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-white" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Book?</h3>
                <p className="text-gray-600 mb-6">
                  Get your personalized quote in minutes. Our team is standing by to help make your event perfect.
                </p>
                <button
                  onClick={() => onNavigate('quote')}
                  className="bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Request Your Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;