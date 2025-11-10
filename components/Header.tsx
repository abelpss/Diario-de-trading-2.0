import React from 'react';
import { AreaChart, List, Calendar, Settings as SettingsIcon } from 'lucide-react';

type Tab = 'operations' | 'statistics' | 'weekly-summary' | 'settings';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'operations', label: 'Operações', icon: List },
    { id: 'statistics', label: 'Estatísticas', icon: AreaChart },
    { id: 'weekly-summary', label: 'Resumo Semanal', icon: Calendar },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon },
  ];

  return (
    <header className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between py-4">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <span className="text-3xl">💹</span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
            Diário de <span className="neon-text">Trading</span>
          </h1>
        </div>
        <nav className="bg-gray-800/60 p-1 rounded-lg flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                activeTab === item.id
                  ? 'bg-gray-900 neon-text shadow-sm'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <item.icon size={16} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
