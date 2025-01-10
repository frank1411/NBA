import React from 'react';

export function EnvironmentalFactors({ factors, onChange }) {
  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h3 className="font-semibold">Factores Ambientales</h3>
      
      <div className="space-y-2">
        <label className="block text-sm">
          Días de Descanso:
          <input
            type="number"
            value={factors.restDays}
            onChange={(e) => onChange('restDays', Number(e.target.value))}
            className="w-full p-2 border rounded mt-1"
            min="0"
            max="7"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">
          Altitud (metros):
          <input
            type="number"
            value={factors.altitude}
            onChange={(e) => onChange('altitude', Number(e.target.value))}
            className="w-full p-2 border rounded mt-1"
            min="0"
            max="2000"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">
          Distancia de Viaje (km):
          <input
            type="number"
            value={factors.travelDistance}
            onChange={(e) => onChange('travelDistance', Number(e.target.value))}
            className="w-full p-2 border rounded mt-1"
            min="0"
            max="5000"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">
          Cambio de Zona Horaria:
          <input
            type="number"
            value={factors.timeZoneChange}
            onChange={(e) => onChange('timeZoneChange', Number(e.target.value))}
            className="w-full p-2 border rounded mt-1"
            min="-3"
            max="3"
          />
        </label>
      </div>
    </div>
  );
}