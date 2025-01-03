import React from 'react';

export function EnvironmentalFactors({ factors, onChange }) {
  const handleRestDaysChange = (value) => {
    const numValue = Number(value);
    onChange('restDays', numValue);
    if (numValue === 0) {
      onChange('isBackToBack', true);
    } else if (factors.isBackToBack) {
      onChange('isBackToBack', false);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-semibold mb-4">Factores Ambientales</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">
            Días de Descanso:
            <input
              type="number"
              value={factors.restDays}
              onChange={(e) => handleRestDaysChange(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              min="0"
              max="7"
              disabled={factors.isBackToBack}
            />
          </label>
        </div>

        <div>
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

        <div>
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

        <div>
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
    </div>
  );
}
