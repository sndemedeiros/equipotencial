import React, { useState } from 'react';
import { Calculator as CalcIcon, Info, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Measurement {
  id: number;
  vA: string;
  vB: string;
  voltage: string;
  uVoltage: string;
  distance: string;
  uDistance: string;
  field: string;
}

export const FieldCalculator: React.FC<{ isExporting?: boolean }> = ({ isExporting }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: 1, vA: '', vB: '', voltage: '', uVoltage: '', distance: '', uDistance: '', field: '' },
    { id: 2, vA: '', vB: '', voltage: '', uVoltage: '', distance: '', uDistance: '', field: '' },
    { id: 3, vA: '', vB: '', voltage: '', uVoltage: '', distance: '', uDistance: '', field: '' },
    { id: 4, vA: '', vB: '', voltage: '', uVoltage: '', distance: '', uDistance: '', field: '' },
  ]);

  const updateMeasurement = (index: number, field: keyof Measurement, value: string) => {
    const newMeasurements = [...measurements];
    newMeasurements[index] = { ...newMeasurements[index], [field]: value };
    setMeasurements(newMeasurements);
  };

  const rows = [
    { label: 'Va (V)', key: 'vA' as keyof Measurement, color: 'text-slate-700' },
    { label: 'Vb (V)', key: 'vB' as keyof Measurement, color: 'text-slate-700' },
    { label: 'ΔV (V)', key: 'voltage' as keyof Measurement, color: 'text-slate-900 font-bold' },
    { label: 'Incerteza ΔV (V)', key: 'uVoltage' as keyof Measurement, color: 'text-slate-400' },
    { label: 'Δs (mm)', key: 'distance' as keyof Measurement, color: 'text-slate-700' },
    { label: 'Incerteza Δs (mm)', key: 'uDistance' as keyof Measurement, color: 'text-slate-400' },
    { label: 'E (V/mm)', key: 'field' as keyof Measurement, color: 'text-blue-600 font-black' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-10 bg-white rounded-[40px] shadow-sm border border-slate-100">
      <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
        <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
        <p className="text-sm text-blue-700 leading-relaxed">
          Utilize esta tabela para registrar os valores medidos e realizar os cálculos do campo elétrico.
          Lembre-se: <span className="font-bold italic">|E| = |ΔV| / Δs</span>.
        </p>
      </div>

      <div className={cn(isExporting ? "overflow-visible" : "overflow-x-auto")}>
        <table className={cn("w-full border-collapse", !isExporting && "min-w-[800px]")}>
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30 w-48">Parâmetro</th>
              {measurements.map((m, idx) => (
                <th key={m.id} className="px-4 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Medida {idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider bg-slate-50/30">
                  {row.label}
                </td>
                {measurements.map((m, idx) => (
                  <td key={m.id} className="px-2 py-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={m[row.key] as string}
                      onChange={(e) => updateMeasurement(idx, row.key, e.target.value.replace('.', ','))}
                      className={cn(
                        "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center",
                        row.color
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
