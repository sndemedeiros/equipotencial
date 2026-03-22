import React from 'react';
import { Plus, Trash2, Table as TableIcon, Ruler, Zap, Target } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface EquipotentialPoint {
  id: string;
  x: string;
  y: string;
  v: string;
}

export interface FieldMeasurement {
  id: string;
  vA: string;
  vB: string;
  distance: string;
  uncertainty: string;
}

export interface ExperimentalData {
  id: string;
  config: 'placas' | 'pinos' | 'placa-pino' | 'placa-pino-central';
  points: EquipotentialPoint[];
  plateDistance: string;
  plateDistanceUncertainty: string;
  coordUncertainty: string;
  voltageUncertainty: string;
  fieldMeasurements: FieldMeasurement[];
}

interface Props {
  data: ExperimentalData;
  onChange: (data: ExperimentalData) => void;
  isExporting?: boolean;
}

export const ExperimentalDataEntry: React.FC<Props> = ({ data, onChange, isExporting }) => {
  const addPoint = () => {
    const newPoint: EquipotentialPoint = {
      id: Math.random().toString(36).substr(2, 9),
      x: '',
      y: '',
      v: '',
    };
    onChange({ ...data, points: [...data.points, newPoint] });
  };

  const removePoint = (id: string) => {
    onChange({ ...data, points: data.points.filter((p) => p.id !== id) });
  };

  const updatePoint = (id: string, field: keyof EquipotentialPoint, value: string) => {
    onChange({
      ...data,
      points: data.points.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const addFieldMeasurement = () => {
    const newMeasure: FieldMeasurement = {
      id: Math.random().toString(36).substr(2, 9),
      vA: '',
      vB: '',
      distance: '',
      uncertainty: '',
    };
    onChange({ ...data, fieldMeasurements: [...data.fieldMeasurements, newMeasure] });
  };

  const removeFieldMeasurement = (id: string) => {
    onChange({ ...data, fieldMeasurements: data.fieldMeasurements.filter((m) => m.id !== id) });
  };

  const updateFieldMeasurement = (id: string, field: keyof FieldMeasurement, value: string) => {
    onChange({
      ...data,
      fieldMeasurements: data.fieldMeasurements.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  };

  const configs = [
    { id: 'placas', label: 'Placas Paralelas' },
    { id: 'pinos', label: 'Dois Pinos' },
    { id: 'placa-pino', label: 'Placa e Pino' },
    { id: 'placa-pino-central', label: 'Placa e Pino Central' },
  ];

  return (
    <div className="space-y-20 py-12">
      {/* 0. Configuration Selection */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-200">
            <Zap size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Configuração dos Eletrodos</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {configs.map((cfg) => (
            <button
              key={cfg.id}
              onClick={() => onChange({ ...data, config: cfg.id as any })}
              className={cn(
                "p-6 rounded-[24px] border-2 transition-all text-left space-y-2 group",
                data.config === cfg.id 
                  ? "border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-100/50" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                data.config === cfg.id ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
              )}>
                <Target size={20} />
              </div>
              <p className={cn(
                "font-bold text-sm uppercase tracking-widest",
                data.config === cfg.id ? "text-blue-600" : "text-slate-400"
              )}>{cfg.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 1. Equipotential Points */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-200">
              <TableIcon size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Mapeamento de Pontos</h3>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 bg-slate-50/30 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Incerteza das Coordenadas <span className="normal-case">(mm)</span></label>
              <input
                type="text"
                inputMode="decimal"
                value={data.coordUncertainty}
                onChange={(e) => onChange({ ...data, coordUncertainty: e.target.value.replace('.', ',') })}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Incerteza do Potencial (V)</label>
              <input
                type="text"
                inputMode="decimal"
                value={data.voltageUncertainty}
                onChange={(e) => onChange({ ...data, voltageUncertainty: e.target.value.replace('.', ',') })}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 transition-all"
              />
            </div>
          </div>
          <div className={cn(isExporting ? "overflow-visible" : "overflow-x-auto")}>
            <table className={cn("w-full border-collapse", !isExporting && "min-w-[600px]")}>
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Coordenada X <span className="normal-case">(mm)</span></th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Coordenada Y <span className="normal-case">(mm)</span></th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Potencial (V)</th>
                  {!isExporting && <th className="px-6 py-4 w-16"></th>}
                </tr>
              </thead>
            <tbody className="divide-y divide-slate-50">
              {data.points.map((point) => (
                <tr key={point.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={point.x}
                      onChange={(e) => updatePoint(point.id, 'x', e.target.value.replace('.', ','))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium text-lg transition-all"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={point.y}
                      onChange={(e) => updatePoint(point.id, 'y', e.target.value.replace('.', ','))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium text-lg transition-all"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={point.v}
                      onChange={(e) => updatePoint(point.id, 'v', e.target.value.replace('.', ','))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-blue-600 font-bold text-lg transition-all"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isExporting && (
                      <button
                        onClick={() => removePoint(point.id)}
                        className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {data.points.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-300 italic">
                    Nenhum ponto adicionado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          <div className="p-6 bg-slate-50/30 flex justify-center border-t border-slate-100">
            <button
              onClick={addPoint}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Plus size={20} />
              ADICIONAR PONTO
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12">
        {/* 2. Distance Between Plates */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ruler className="text-blue-500" size={20} />
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Parâmetros Fixos da Geometria</h4>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Distância entre Eletrodos <span className="normal-case">(mm)</span></label>
              <input
                type="text"
                inputMode="decimal"
                value={data.plateDistance}
                onChange={(e) => onChange({ ...data, plateDistance: e.target.value.replace('.', ',') })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-lg transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Incerteza <span className="normal-case">(mm)</span></label>
              <input
                type="text"
                inputMode="decimal"
                value={data.plateDistanceUncertainty}
                onChange={(e) => onChange({ ...data, plateDistanceUncertainty: e.target.value.replace('.', ',') })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-600 transition-all"
              />
            </div>
          </div>
        </section>

        {/* 3. Distance between two equipotential lines - MULTIPLE */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="text-blue-500" size={20} />
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Medidas de Diferença de Potencial e Distância</h4>
          </div>
          
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tabela de Medidas</h5>
            </div>
            <div className={cn(isExporting ? "overflow-visible" : "overflow-x-auto")}>
              <table className={cn("w-full border-collapse", !isExporting && "min-w-[600px]")}>
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Va (V)</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Vb (V)</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Distância <span className="normal-case">(mm)</span></th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Incerteza <span className="normal-case">(mm)</span></th>
                    {!isExporting && <th className="px-6 py-4 w-16"></th>}
                  </tr>
                </thead>
              <tbody className="divide-y divide-slate-50">
                {data.fieldMeasurements.map((m) => (
                  <tr key={m.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={m.vA}
                        onChange={(e) => updateFieldMeasurement(m.id, 'vA', e.target.value.replace('.', ','))}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-bold transition-all"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={m.vB}
                        onChange={(e) => updateFieldMeasurement(m.id, 'vB', e.target.value.replace('.', ','))}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-bold transition-all"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={m.distance}
                        onChange={(e) => updateFieldMeasurement(m.id, 'distance', e.target.value.replace('.', ','))}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-blue-600 font-bold transition-all"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={m.uncertainty}
                        onChange={(e) => updateFieldMeasurement(m.id, 'uncertainty', e.target.value.replace('.', ','))}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-400 text-sm transition-all"
                      />
                    </td>
                    {!isExporting && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => removeFieldMeasurement(m.id)}
                          className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {data.fieldMeasurements.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-300 italic text-sm">
                      Nenhuma medida de distância entre equipotenciais adicionada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
            {!isExporting && (
              <div className="p-4 bg-slate-50/30 flex justify-center border-t border-slate-100">
                <button
                  onClick={addFieldMeasurement}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all text-xs"
                >
                  <Plus size={16} />
                  ADICIONAR MEDIDA
                </button>
              </div>
            )}
          </div>
        </section>
        {/* No clear buttons here */}
      </div>
    </div>
  );
};
