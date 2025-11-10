import React, { useMemo } from 'react';
import { useTrades } from '../context/TradesContext';
import { TrendingUp, TrendingDown, Repeat, Trophy, Target } from 'lucide-react';
import type { Trade, Setup, OperationType } from '../types';

interface SummaryCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, colorClass }) => (
  <div className={`bg-gray-800/50 border ${colorClass} rounded-lg p-4 flex items-center gap-4 shadow-lg`}>
    <div className={`p-3 rounded-lg bg-gray-700/50 ${colorClass.replace('border-', 'text-')}`}>
        {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export const SummaryCards: React.FC = () => {
  const { trades } = useTrades();

  const stats = useMemo(() => {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        mostUsedSetup: 'N/A',
        mostCommonOperation: 'N/A',
      };
    }

    const totalTrades = trades.length;
    const wins = trades.filter(t => t.result === 'gain').length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    const setupCounts = trades.reduce((acc, trade) => {
      acc[trade.setup] = (acc[trade.setup] || 0) + 1;
      return acc;
    }, {} as Record<Setup, number>);
    const mostUsedSetup = Object.keys(setupCounts).length > 0
      ? Object.entries(setupCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';
    
    const operationCounts = trades.reduce((acc, trade) => {
        acc[trade.operationType] = (acc[trade.operationType] || 0) + 1;
        return acc;
    }, {} as Record<OperationType, number>);
    const mostCommonOperation = Object.keys(operationCounts).length > 0
      ? Object.entries(operationCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';

    return {
      totalTrades,
      winRate: parseFloat(winRate.toFixed(1)),
      mostUsedSetup: mostUsedSetup.charAt(0).toUpperCase() + mostUsedSetup.slice(1),
      mostCommonOperation: mostCommonOperation === 'buy' ? 'Compra' : 'Venda',
    };
  }, [trades]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <SummaryCard title="Total de Trades" value={String(stats.totalTrades)} icon={<Repeat size={24} />} colorClass="border-blue-500/50" />
      <SummaryCard title="Taxa de Acerto" value={`${stats.winRate}%`} icon={<Target size={24} />} colorClass="neon-border/50" />
      <SummaryCard title="Setup Mais Usado" value={stats.mostUsedSetup} icon={<Trophy size={24} />} colorClass="border-purple-500/50" />
      <SummaryCard title="Operação Comum" value={stats.mostCommonOperation} icon={stats.mostCommonOperation === 'Compra' ? <TrendingUp size={24} /> : <TrendingDown size={24} />} colorClass="border-yellow-500/50" />
    </div>
  );
};