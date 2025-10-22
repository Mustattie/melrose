import React from 'react';
import { Phone, Mail, MapPin, Star } from 'lucide-react';

type Page = 'home' | 'about' | 'restrooms' | 'quote' | 'admin';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Star className="text-red-400" size={32} />
              <h3 className="text-2xl font-bold">Melrose Mobile Restrooms</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Providing luxury mobile restroom solutions for your most important events. 
              Professional service with premium amenities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.25.301.286.423.196.684-.065.188-.210.821-.269 1.053-.094.377-.385.458-.886.25-1.629-.758-2.64-3.144-2.64-5.058 0-4.142 3.003-7.946 8.651-7.946 4.54 0 8.068 3.238 8.068 7.575 0 4.524-2.853 8.153-6.816 8.153-1.329 0-2.587-.688-3.016-1.526 0 0-.658 2.51-.819 3.121-.299 1.164-1.107 2.623-1.649 3.51 1.244.375 2.572.575 3.944.575 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('restrooms')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  View Restrooms
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('quote')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Request A Quote
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Wedding Rentals</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Corporate Events</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Festival Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Private Parties</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cleaning Attendant</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="text-red-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-gray-300">(469) 355-4659</p>
                  <p className="text-sm text-gray-400">Available 24/7 for emergencies</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="text-red-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-gray-300">info@melrosemobilerestrooms.com</p>
                  <p className="text-sm text-gray-400">We respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="text-red-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-gray-300">Serving Greater Metro Area</p>
                  <p className="text-sm text-gray-400">Free delivery within 50 miles</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm">
            <p>&copy; 2025 Melrose Mobile Restrooms. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;