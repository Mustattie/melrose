import React, { useState } from 'react';
import AdminLayout from './admin/AdminLayout';
import EnhancedDashboardOverview from './admin/EnhancedDashboardOverview';
import ReservationsListView from './admin/ReservationsListView';
import ReservationsCalendarView from './admin/ReservationsCalendarView';
import EnhancedReservationModal from './admin/EnhancedReservationModal';
import { Quote } from '../types/database.types';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'overview' | 'list' | 'calendar'>('overview');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleCloseModal = () => {
    setSelectedQuote(null);
  };

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1);
    setSelectedQuote(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <EnhancedDashboardOverview key={refreshKey} onViewDetails={handleViewDetails} />;
      case 'list':
        return <ReservationsListView key={refreshKey} onViewDetails={handleViewDetails} />;
      case 'calendar':
        return <ReservationsCalendarView key={refreshKey} onViewDetails={handleViewDetails} />;
      default:
        return <EnhancedDashboardOverview key={refreshKey} onViewDetails={handleViewDetails} />;
    }
  };

  return (
    <>
      <AdminLayout currentView={currentView} onViewChange={setCurrentView}>
        {renderView()}
      </AdminLayout>

      {selectedQuote && (
        <EnhancedReservationModal
          quote={selectedQuote}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default AdminDashboard;
