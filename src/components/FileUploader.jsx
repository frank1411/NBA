import React from 'react';

export function FileUploader({ onFileLoad }) {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Extraer el nombre del equipo del nombre del archivo
      const fileName = file.name;
      const teamName = fileName.split('_')[0];

      const text = await file.text();
      const scores = text.split('\n')
        .map(line => line.trim())
        .filter(line => line && !isNaN(line))
        .map(Number);

      if (scores.length > 0) {
        onFileLoad(scores, teamName);
      }
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      alert('Error al leer el archivo. Asegúrate de que sea un archivo CSV válido.');
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cargar puntuaciones desde archivo CSV:
      </label>
      <input
        type="file"
        accept=".csv,.txt"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      <p className="mt-1 text-sm text-gray-500">
        El archivo debe contener una puntuación por línea
      </p>
    </div>
  );
}