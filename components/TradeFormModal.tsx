import React, { useState, useEffect } from 'react';
import { useTrades } from '../context/TradesContext';
import type { Trade } from '../types';
import { OPERATION_TYPE_OPTIONS, SETUP_OPTIONS, TREND_OPTIONS, LOCATION_OPTIONS, TIMEFRAME_OPTIONS, OUTCOME_OPTIONS, TRAILING_STOP_OPTIONS, RESULT_OPTIONS } from '../constants';
import { X, Upload } from 'lucide-react';

interface TradeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeToEdit?: Trade | null;
}

const initialFormState: Omit<Trade, 'id' | 'date'> = {
  asset: '',
  operationType: 'buy',
  setup: 'breakout',
  trend: 'with_m200',
  location: 'near_m200',
  timeFrame: 'M5',
  trailingStop: 'T/F',
  result: 'gain',
  outcome: '1:1',
  screenshot: '',
  comment: '',
};

export const TradeFormModal: React.FC<TradeFormModalProps> = ({ isOpen, onClose, tradeToEdit }) => {
  const { addTrade, updateTrade } = useTrades();
  const [formData, setFormData] = useState(initialFormState);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (tradeToEdit) {
      setFormData({
          asset: tradeToEdit.asset,
          operationType: tradeToEdit.operationType,
          setup: tradeToEdit.setup,
          trend: tradeToEdit.trend,
          location: tradeToEdit.location,
          timeFrame: tradeToEdit.timeFrame,
          trailingStop: tradeToEdit.trailingStop,
          result: tradeToEdit.result,
          outcome: tradeToEdit.outcome,
          screenshot: tradeToEdit.screenshot,
          comment: tradeToEdit.comment,
      });
      setPreview(tradeToEdit.screenshot);
    } else {
      setFormData(initialFormState);
      setPreview(undefined);
    }
  }, [tradeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (name === 'outcome') {
        newFormData.result = value !== '-1' ? 'gain' : 'loss';
    }

    setFormData(newFormData);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, screenshot: base64String });
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeToEdit) {
      updateTrade(tradeToEdit.id, formData);
    } else {
      addTrade(formData);
    }
    onClose();
  };

  const renderSelect = (name: string, label: string, options: { value: string; label: string }[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <select name={name} value={formData[name as keyof typeof formData]} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-bold neon-text">{tradeToEdit ? 'Editar Operação' : 'Nova Operação'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Ativo</label>
              <input type="text" name="asset" value={formData.asset} onChange={handleChange} placeholder="Ex: WINFUT, PETR4" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
            </div>
            {renderSelect('operationType', 'Tipo de Operação', OPERATION_TYPE_OPTIONS)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderSelect('setup', 'Setup', SETUP_OPTIONS)}
            {renderSelect('trend', 'Tendência', TREND_OPTIONS)}
            {renderSelect('location', 'Localização', LOCATION_OPTIONS)}
            {renderSelect('timeFrame', 'Time Frame', TIMEFRAME_OPTIONS)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderSelect('trailingStop', 'Trailing Stop', TRAILING_STOP_OPTIONS)}
            {renderSelect('result', 'Resultado Final', RESULT_OPTIONS)}
            {renderSelect('outcome', 'Saída (R/R)', OUTCOME_OPTIONS)}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Comentário</label>
            <textarea name="comment" value={formData.comment} onChange={handleChange} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"></textarea>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Print da Operação (Opcional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="mx-auto h-48 rounded-md object-contain" />
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-gray-500" />
                )}
                <div className="flex text-sm text-gray-500">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-green-400 hover:text-green-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-green-500 px-2 py-1">
                    <span>Carregar um arquivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-600">PNG, JPG, GIF até 10MB</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 transition">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};