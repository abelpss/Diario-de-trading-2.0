import React, { useState, useMemo } from 'react';
import { TradesProvider } from './context/TradesContext';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { TradeFormModal } from './components/TradeFormModal';
import { TradesTable } from './components/TradesTable';
import { StatisticsDashboard } from './components/StatisticsDashboard';
import { WeeklySummary } from './components/WeeklySummary';
import { Settings } from './components/Settings';
import { PlusCircle } from 'lucide-react';
import type { Trade } from './types';

type Tab = 'operations' | 'statistics' | 'weekly-summary' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('operations');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const handleOpenModal = (trade: Trade | null = null) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTrade(null);
    setIsModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <StatisticsDashboard />;
      case 'weekly-summary':
        return <WeeklySummary />;
      case 'settings':
        return <Settings />;
      case 'operations':
      default:
        return <TradesTable onEdit={handleOpenModal} />;
    }
  };

  const mainContent = useMemo(renderContent, [activeTab]);

  return (
    <TradesProvider>
      <div className="min-h-screen bg-gray-900 text-gray-200">
        <div className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-20">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <main className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
          <SummaryCards />
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 md:p-6 shadow-2xl shadow-black/20">
            {mainContent}
          </div>
        </main>
        
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => handleOpenModal()}
            className="bg-green-500 hover:bg-green-400 text-gray-900 font-bold p-4 rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-400/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <PlusCircle size={24} />
            <span className="hidden sm:inline">Nova Operação</span>
          </button>
        </div>

        {isModalOpen && (
          <TradeFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            tradeToEdit={editingTrade}
          />
        )}
      </div>
    </TradesProvider>
  );
};

export default App;
