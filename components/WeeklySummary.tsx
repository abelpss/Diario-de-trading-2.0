import React, { useMemo } from 'react';
import { useTrades } from '../context/TradesContext';
import type { Setup, TimeFrame, Outcome, Trend, OperationType } from '../types';

const SummaryItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md">
    <span className="text-gray-400">{label}</span>
    <span className="font-bold text-white">{value}</span>
  </div>
);

export const WeeklySummary: React.FC = () => {
  const { trades } = useTrades();

  const weeklyStats = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyTrades = trades.filter(t => new Date(t.date) >= sevenDaysAgo);

    if (weeklyTrades.length === 0) {
      return null;
    }

    const totalOps = weeklyTrades.length;
    const wins = weeklyTrades.filter(t => t.result === 'gain').length;
    const winrate = totalOps > 0 ? ((wins / totalOps) * 100).toFixed(1) + '%' : '0%';
    
    const getMostCommon = <T extends string>(arr: T[]): string => {
        if (arr.length === 0) return 'N/A';
        const counts = arr.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).sort((a,b) => b[1] - a[1])[0][0];
    };
    
    const setupPerformance: Record<Setup, number> = { 'breakout': 0, 'pullback': 0 };
    weeklyTrades.forEach(t => {
        setupPerformance[t.setup] += t.outcome === '-1' ? -1 : parseInt(t.outcome.split(':')[0]);
    });
    const bestSetup = Object.entries(setupPerformance).sort((a,b) => b[1] - a[1])[0][0];

    const mostOperatedAsset = getMostCommon(weeklyTrades.map(t => t.asset.toUpperCase()));
    const predominantTrend = getMostCommon(weeklyTrades.map(t => t.trend));
    const mostUsedTimeframe = getMostCommon(weeklyTrades.map(t => t.timeFrame));
    const mostCommonExit = getMostCommon(weeklyTrades.map(t => t.outcome));

    return {
      totalOps,
      winrate,
      bestSetup,
      mostOperatedAsset,
      predominantTrend,
      mostUsedTimeframe,
      mostCommonExit,
    };
  }, [trades]);

  if (!weeklyStats) {
    return <p className="text-center text-gray-400">Nenhuma operação nos últimos 7 dias.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 neon-text">Resumo dos Últimos 7 Dias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <SummaryItem label="Total de Operações" value={weeklyStats.totalOps} />
          <SummaryItem label="Winrate (%)" value={weeklyStats.winrate} />
          <SummaryItem label="Setup com Melhor Desempenho" value={weeklyStats.bestSetup} />
          <SummaryItem label="Ativo Mais Operado" value={weeklyStats.mostOperatedAsset} />
        </div>
        <div className="space-y-3">
          <SummaryItem label="Tendência Predominante" value={weeklyStats.predominantTrend === 'with_m200' ? 'A favor M200' : 'Contra M200'} />
          <SummaryItem label="Time Frame Mais Usado" value={weeklyStats.mostUsedTimeframe} />
          <SummaryItem label="Saída Mais Comum" value={weeklyStats.mostCommonExit} />
        </div>
      </div>
    </div>
  );
};