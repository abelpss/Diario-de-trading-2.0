import React, { useState, useMemo } from 'react';
import { useTrades } from '../context/TradesContext';
import type { Trade } from '../types';
import { Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const TradesTable: React.FC<{ onEdit: (trade: Trade) => void }> = ({ onEdit }) => {
  const { trades, deleteTrade, loading } = useTrades();
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Trade, direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc'});
  
  const filteredTrades = useMemo(() => {
    return trades.filter(trade =>
      trade.asset.toLowerCase().includes(filter.toLowerCase()) ||
      trade.setup.toLowerCase().includes(filter.toLowerCase()) ||
      trade.comment.toLowerCase().includes(filter.toLowerCase())
    );
  }, [trades, filter]);

  const sortedTrades = useMemo(() => {
    let sortableTrades = [...filteredTrades];
    if (sortConfig !== null) {
      sortableTrades.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTrades;
  }, [filteredTrades, sortConfig]);

  const requestSort = (key: keyof Trade) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof Trade) => {
    if (!sortConfig || sortConfig.key !== key) {
        return <ChevronDown size={14} className="opacity-0 group-hover:opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  }

  const renderOutcome = (outcome: Trade['outcome']) => {
    const isWin = outcome !== '-1';
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isWin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {outcome}
      </span>
    );
  };
  
  const renderResult = (result: Trade['result']) => {
    const isGain = result === 'gain';
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${isGain ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {result}
      </span>
    );
  };
  
  const headers: { key: keyof Trade; label: string }[] = [
    { key: 'date', label: 'Data' },
    { key: 'asset', label: 'Ativo' },
    { key: 'operationType', label: 'Tipo' },
    { key: 'setup', label: 'Setup' },
    { key: 'trailingStop', label: 'Trailing' },
    { key: 'timeFrame', label: 'TimeFrame' },
    { key: 'result', label: 'Resultado' },
    { key: 'outcome', label: 'Saída' },
  ];

  if(loading) return <div className="text-center p-8">Carregando operações...</div>
  if(trades.length === 0) return <div className="text-center p-8 text-gray-400">Nenhuma operação registrada ainda. Clique em "Nova Operação" para começar.</div>

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buscar por ativo, setup, comentário..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full max-w-sm bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
              {headers.map(header => (
                <th key={header.key} scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort(header.key)}>
                  <div className="flex items-center gap-1 group">
                    {header.label} {getSortIcon(header.key)}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrades.map(trade => (
              <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">{new Date(trade.date).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium text-white">{trade.asset.toUpperCase()}</td>
                <td className={`px-4 py-3 font-semibold ${trade.operationType === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.operationType === 'buy' ? 'Compra' : 'Venda'}
                </td>
                <td className="px-4 py-3">{trade.setup}</td>
                <td className="px-4 py-3">{trade.trailingStop}</td>
                <td className="px-4 py-3">{trade.timeFrame}</td>
                <td className="px-4 py-3">{renderResult(trade.result)}</td>
                <td className="px-4 py-3">{renderOutcome(trade.outcome)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => onEdit(trade)} className="text-blue-400 hover:text-blue-300"><Edit size={16} /></button>
                    <button onClick={() => window.confirm('Tem certeza que deseja excluir esta operação?') && deleteTrade(trade.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};