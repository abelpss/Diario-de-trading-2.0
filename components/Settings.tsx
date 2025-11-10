import React, { useRef } from 'react';
import { useTrades } from '../context/TradesContext';
import { Upload, Download, Trash2 } from 'lucide-react';
import type { Trade } from '../types';

export const Settings: React.FC = () => {
  const { trades, importTrades, clearTrades } = useTrades();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(trades, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'trading_journal_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const importedData = JSON.parse(content);
            importTrades(importedData as Trade[]);
            alert('Dados importados com sucesso!');
          }
        } catch (error) {
          alert('Erro ao importar o arquivo. Verifique se o formato é JSON válido.');
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    if (window.confirm('TEM CERTEZA? Todos os seus registros serão apagados permanentemente. Esta ação não pode ser desfeita.')) {
      clearTrades();
      alert('Todos os registros foram apagados.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 neon-text">Configurações e Gestão de Dados</h2>
      <div className="space-y-6">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <h3 className="font-semibold text-lg text-white mb-2">Importar / Exportar Dados</h3>
          <p className="text-gray-400 text-sm mb-4">
            Faça backup de seus dados exportando-os como um arquivo JSON, ou restaure um backup importando um arquivo.
          </p>
          <div className="flex gap-4">
            <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition">
              <Upload size={18} /> Importar JSON
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
            
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition">
              <Download size={18} /> Exportar JSON
            </button>
          </div>
        </div>

        <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/50">
          <h3 className="font-semibold text-lg text-red-300 mb-2">Zona de Perigo</h3>
          <p className="text-red-400 text-sm mb-4">
            Esta ação é irreversível. Tenha certeza de que fez um backup de seus dados antes de prosseguir.
          </p>
          <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition">
            <Trash2 size={18} /> Limpar Todos os Registros
          </button>
        </div>
      </div>
    </div>
  );
};
