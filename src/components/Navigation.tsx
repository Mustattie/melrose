import React from 'react';
import { Menu, X, Phone, Carrot as Mirror } from 'lucide-react';

type Page = 'home' | 'about' | 'restrooms' | 'quote';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home' as Page, label: 'Home' },
    { id: 'about' as Page, label: 'About Us' },
    { id: 'restrooms' as Page, label: 'View Restrooms' },
    { id: 'quote' as Page, label: 'Request A Quote' },
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 text-2xl font-bold text-red-800 hover:text-red-600 transition-colors"
            >
              <img 
                src="/image.png" 
                alt="Melrose Mobile Restrooms Luxury Logo" 
                className="w-10 h-10 object-contain"
              />
              <span>Melrose Mobile Restrooms</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-red-800 border-b-2 border-red-800'
                    : 'text-gray-700 hover:text-red-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="tel:+1234567890"
              className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Phone size={18} />
              <span>(469) 355-4659</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-red-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'text-red-800 bg-red-50'
                    : 'text-gray-700 hover:text-red-800 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="tel:+14693554659"
              className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mx-3 mt-4"
            >
              <Phone size={18} />
              <span>(469) 355-4659</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;