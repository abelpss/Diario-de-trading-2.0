import React, { useMemo } from 'react';
import { useTrades } from '../context/TradesContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { OUTCOME_R_MAP, SETUP_OPTIONS, TIMEFRAME_OPTIONS, OUTCOME_OPTIONS } from '../constants';
import type { Trade } from '../types';

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
    <h3 className="text-lg font-semibold neon-text mb-4">{title}</h3>
    <div className="h-72 w-full">
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip p-2">
        <p className="label">{`${label}`}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.color }}>{`${p.name}: ${p.value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

export const StatisticsDashboard: React.FC = () => {
  const { trades } = useTrades();

  const data = useMemo(() => {
    const setupPerformance = SETUP_OPTIONS.map(opt => ({ name: opt.label, R: 0 }));
    const assetPerformance: { [key: string]: number } = {};
    const trendPerformance = { with_m200: { wins: 0, losses: 0 }, against_m200: { wins: 0, losses: 0 }};
    const timeFrameDist = TIMEFRAME_OPTIONS.map(opt => ({ name: opt.label, value: 0 }));
    const outcomeDist = OUTCOME_OPTIONS.map(opt => ({ name: opt.label, value: 0 }));
    const setupProportion = SETUP_OPTIONS.map(opt => ({ name: opt.label, value: 0 }));
    
    const timelineData: { date: string; cumulativeR: number }[] = [];
    let cumulativeR = 0;
    
    [...trades].reverse().forEach(trade => {
        const rValue = OUTCOME_R_MAP[trade.outcome];
        cumulativeR += rValue;
        timelineData.push({ date: new Date(trade.date).toLocaleDateString(), cumulativeR });
        
        // Setup Performance
        const setup = setupPerformance.find(s => s.name.toLowerCase().includes(trade.setup));
        if (setup) setup.R += rValue;
        
        // Asset Performance
        assetPerformance[trade.asset.toUpperCase()] = (assetPerformance[trade.asset.toUpperCase()] || 0) + rValue;

        // Trend Performance
        if (trade.result === 'gain') trendPerformance[trade.trend].wins++;
        else trendPerformance[trade.trend].losses++;

        // Distributions
        const tf = timeFrameDist.find(t => t.name === trade.timeFrame);
        if (tf) tf.value++;
        
        const outcome = outcomeDist.find(o => o.name.toLowerCase().includes(trade.outcome));
        if (outcome) outcome.value++;
        
        const setupProp = setupProportion.find(s => s.name.toLowerCase().includes(trade.setup));
        if(setupProp) setupProp.value++;
    });

    const assetData = Object.entries(assetPerformance).map(([name, R]) => ({ name, R })).sort((a,b) => b.R - a.R);
    const trendData = [
        { name: 'A Favor M200', wins: trendPerformance.with_m200.wins, losses: trendPerformance.with_m200.losses },
        { name: 'Contra M200', wins: trendPerformance.against_m200.wins, losses: trendPerformance.against_m200.losses },
    ];
    
    return { setupPerformance, assetData, trendData, timeFrameDist, outcomeDist, setupProportion, timelineData };

  }, [trades]);
  
  const PIE_COLORS = ['#00FF9C', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

  if(trades.length === 0) return <div className="text-center p-8 text-gray-400">Dados insuficientes para gerar estatísticas.</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Linha do Tempo de Operações (R Acumulado)">
          <ResponsiveContainer>
              <LineChart data={data.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }}/>
                  <YAxis stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }}/>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="cumulativeR" name="R Acumulado" stroke="#00FF9C" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }}/>
              </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Desempenho por Setup (R)">
            <ResponsiveContainer>
                <BarChart data={data.setupPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
                    <YAxis stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="R" name="Resultado em R" fill="#00FF9C" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Desempenho por Ativo (R)">
            <ResponsiveContainer>
                <BarChart data={data.assetData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }}/>
                    <YAxis stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="R" name="Resultado em R" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Operações a Favor vs Contra M200">
            <ResponsiveContainer>
                <BarChart data={data.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }}/>
                    <YAxis stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="wins" name="Vitórias" stackId="a" fill="#00FF9C" />
                    <Bar dataKey="losses" name="Derrotas" stackId="a" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Proporção de Setups">
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data.setupProportion} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                      {data.setupProportion.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />}/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Distribuição por Time Frame">
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data.timeFrameDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                      {data.timeFrameDist.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />}/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    </div>
  );
};