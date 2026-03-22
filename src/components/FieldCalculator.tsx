import React, { useState } from 'react';
import { Calculator as CalcIcon, Info, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Calculation {
  id: string;
  voltage: string;
  uVoltage: string;
  distance: string;
  uDistance: string;
  studentField: string;
  studentUncertainty: string;
}

export const FieldCalculator: React.FC<{ isExporting?: boolean }> = ({ isExporting }) => {
  const [calculations, setCalculations] = useState<Calculation[]>([
    { id: 'calc-1', voltage: '', uVoltage: '', distance: '', uDistance: '', studentField: '', studentUncertainty: '' }
  ]);

  const addCalculation = () => {
    setCalculations([
      ...calculations,
      { id: `calc-${Date.now()}`, voltage: '', uVoltage: '', distance: '', uDistance: '', studentField: '', studentUncertainty: '' }
    ]);
  };

  const removeCalculation = (id: string) => {
    if (calculations.length > 1) {
      setCalculations(calculations.filter(c => c.id !== id));
    }
  };

  const updateCalculation = (id: string, field: keyof Calculation, value: string) => {
    setCalculations(calculations.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-10 bg-white rounded-[40px] shadow-sm border border-slate-100">
      <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
        <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
        <p className="text-sm text-blue-700 leading-relaxed">
          Utilize este espaço para registrar os valores medidos e realizar seus cálculos de campo elétrico. 
          Lembre-se da fórmula: <span className="font-bold italic">|E| = |ΔV| / Δs</span>.
        </p>
      </div>

      <div className={cn(isExporting ? "overflow-visible" : "overflow-x-auto")}>
        <table className={cn("w-full border-collapse", !isExporting && "min-w-[700px]")}>
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-2 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">ΔV <span className="normal-case">[V]</span></th>
              <th className="px-2 py-4 text-left text-[9px] font-black text-slate-300 uppercase tracking-widest">Incerteza ΔV <span className="normal-case">[V]</span></th>
              <th className="px-2 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Δs <span className="normal-case">[mm]</span></th>
              <th className="px-2 py-4 text-left text-[9px] font-black text-slate-300 uppercase tracking-widest">Incerteza Δs <span className="normal-case">[mm]</span></th>
              <th className="px-2 py-4 text-left text-[9px] font-black text-blue-400 uppercase tracking-widest">E <span className="normal-case">[V/mm]</span></th>
              <th className="px-2 py-4 text-left text-[9px] font-black text-blue-400 uppercase tracking-widest">Incerteza E <span className="normal-case">[V/mm]</span></th>
              {!isExporting && <th className="px-2 py-4 w-10"></th>}
            </tr>
          </thead>
          <tbody>
            {calculations.map((calc) => (
              <tr key={calc.id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-1 py-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={calc.voltage}
                    onChange={(e) => updateCalculation(calc.id, 'voltage', e.target.value.replace('.', ','))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-bold transition-all"
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={calc.uVoltage}
                    onChange={(e) => updateCalculation(calc.id, 'uVoltage', e.target.value.replace('.', ','))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-400 transition-all"
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={calc.distance}
                    onChange={(e) => updateCalculation(calc.id, 'distance', e.target.value.replace('.', ','))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-bold transition-all"
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={calc.uDistance}
                    onChange={(e) => updateCalculation(calc.id, 'uDistance', e.target.value.replace('.', ','))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-400 transition-all"
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={calc.studentField}
                    onChange={(e) => updateCalculation(calc.id, 'studentField', e.target.value.replace('.', ','))}
                    className="w-full p-2 bg-blue-50/50 border border-blue-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-blue-600 font-bold transition-all"
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={calc.studentUncertainty}
                    onChange={(e) => updateCalculation(calc.id, 'studentUncertainty', e.target.value.replace('.', ','))}
                    className="w-full p-2 bg-blue-50/50 border border-blue-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-blue-400 font-bold transition-all"
                  />
                </td>
                {!isExporting && (
                  <td className="px-2 py-2 text-right">
                    {calculations.length > 1 && (
                      <button
                        onClick={() => removeCalculation(calc.id)}
                        className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isExporting && (
        <div className="flex justify-start items-center pt-4">
          <button
            onClick={addCalculation}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all text-sm"
          >
            <Plus size={18} />
            Adicionar Cálculo
          </button>
        </div>
      )}
    </div>
  );
};
