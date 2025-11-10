import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { Trade, TradesContextType } from '../types';

const TradesContext = createContext<TradesContextType | undefined>(undefined);

const TRADES_STORAGE_KEY = 'tradingJournalTrades';

export const TradesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTrades = localStorage.getItem(TRADES_STORAGE_KEY);
      if (storedTrades) {
        // FIX: The data from localStorage might be in an old format. By typing `parsedTrades` as `any[]`,
        // we can safely check for properties and perform migration. We also explicitly type `migratedTrades`
        // as `Trade[]` to ensure type safety going forward. This resolves the errors caused by
        // TypeScript assuming the data perfectly matches the `Trade` interface.
        const parsedTrades: any[] = JSON.parse(storedTrades);
         // Data migration for backward compatibility
        const migratedTrades: Trade[] = parsedTrades.map(trade => {
            const hasResult = 'result' in trade;
            const hasTrailingStop = 'trailingStop' in trade;

            if (hasResult && hasTrailingStop) {
                return trade;
            }

            return {
                ...trade,
                result: hasResult ? trade.result : (trade.outcome !== '-1' ? 'gain' : 'loss'),
                trailingStop: hasTrailingStop ? trade.trailingStop : 'T/F',
            };
        });
        setTrades(migratedTrades);
      }
    } catch (error) {
      console.error("Failed to load trades from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
      } catch (error) {
        console.error("Failed to save trades to localStorage", error);
      }
    }
  }, [trades, loading]);

  const addTrade = (tradeData: Omit<Trade, 'id' | 'date'>) => {
    const newTrade: Trade = {
      ...tradeData,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
    };
    setTrades(prev => [newTrade, ...prev]);
  };

  const updateTrade = (id: string, tradeData: Partial<Omit<Trade, 'id'>>) => {
    setTrades(prev => prev.map(t => t.id === id ? { ...t, ...tradeData } : t));
  };
  
  const deleteTrade = (id: string) => {
    setTrades(prev => prev.filter(t => t.id !== id));
  };
  
  const importTrades = (importedTrades: Trade[]) => {
    // Basic validation
    if (Array.isArray(importedTrades) && importedTrades.every(t => t.id && t.asset)) {
        setTrades(importedTrades);
    } else {
        alert("Formato de arquivo inválido.");
    }
  };

  const clearTrades = () => {
    setTrades([]);
  };

  return (
    <TradesContext.Provider value={{ trades, addTrade, updateTrade, deleteTrade, importTrades, clearTrades, loading }}>
      {children}
    </TradesContext.Provider>
  );
};

export const useTrades = (): TradesContextType => {
  const context = useContext(TradesContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradesProvider');
  }
  return context;
};
