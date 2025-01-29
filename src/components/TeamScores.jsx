import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function TeamScores() {
  const teams = [
    'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets', 
    'Chicago Bulls', 'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 
    'Detroit Pistons', 'Golden State Warriors', 'Houston Rockets', 
    'Indiana Pacers', 'Los Angeles Clippers', 'Los Angeles Lakers', 
    'Memphis Grizzlies', 'Miami Heat', 'Milwaukee Bucks', 
    'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks', 
    'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia 76ers', 
    'Phoenix Suns', 'Portland Trail Blazers', 'Sacramento Kings', 
    'San Antonio Spurs', 'Toronto Raptors', 'Utah Jazz', 'Washington Wizards'
  ];

  const [scores, setScores] = useState({});
  const [teamFolder, setTeamFolder] = useState(null);
  const [folderPath, setFolderPath] = useState('');

  const selectTeamsFolder = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      setTeamFolder(directoryHandle);
      
      // Mostrar el nombre de la carpeta seleccionada
      setFolderPath(directoryHandle.name);
    } catch (error) {
      console.error('Error seleccionando carpeta:', error);
      alert('Debes seleccionar una carpeta válida');
    }
  };

  const handleScoreChange = (team, score) => {
    setScores(prev => ({
      ...prev,
      [team]: score
    }));
  };

  // Función para normalizar nombres de archivos
  const normalizeFileName = (teamName) => {
    // Caso especial para Clippers
    if (teamName === 'Los Angeles Clippers') {
      return 'LA Clippers_puntuaciones.txt';
    }
    
    // Normalización genérica para otros equipos
    return teamName
      .toLowerCase()
      .replace(/\s+/g, '_')      // Reemplazar espacios con guiones bajos
      .replace(/[^a-z0-9_]/g, '') // Eliminar caracteres especiales
      + '_puntuaciones.txt';
  };

  const handleSaveScores = async () => {
    if (!teamFolder) {
      alert('Primero debes seleccionar una carpeta de equipos');
      return;
    }

    let errorOccurred = false;

    for (const team of teams) {
      if (scores[team]) {
        try {
          const fileName = normalizeFileName(team);
          
          // Mostrar el nombre del archivo que se va a crear
          console.log(`Intentando guardar archivo para ${team}: ${fileName}`);

          let fileHandle;
          
          // Intentar crear o abrir el archivo
          try {
            fileHandle = await teamFolder.getFileHandle(fileName, { create: true });
          } catch (error) {
            console.error(`Error al manejar el archivo para ${team}:`, error);
            errorOccurred = true;
            continue;
          }
          
          // Leer contenido actual del archivo (si existe)
          let content = '';
          try {
            const file = await fileHandle.getFile();
            content = await file.text();
          } catch (readError) {
            console.warn(`No se pudo leer el archivo para ${team}. Creando nuevo.`);
          }
          
          // Preparar nuevo contenido
          const lines = content.trim() ? content.trim().split('\n') : [];
          lines.push(scores[team]);
          const newContent = lines.join('\n');

          // Escribir contenido actualizado
          try {
            const writable = await fileHandle.createWritable();
            await writable.write(newContent);
            await writable.close();
          } catch (writeError) {
            console.error(`Error escribiendo en el archivo para ${team}:`, writeError);
            errorOccurred = true;
          }
        } catch (error) {
          console.error(`Error general guardando puntaje para ${team}:`, error);
          errorOccurred = true;
        }
      }
    }

    if (errorOccurred) {
      alert('Algunos puntajes no se pudieron guardar. Revisa la consola para más detalles.');
    } else {
      alert('Puntajes guardados en archivos');
    }
    setScores({});
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Puntajes de Equipos NBA</h1>
      
      <div className="text-center mb-6">
        <button 
          onClick={selectTeamsFolder}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          {teamFolder ? 'Carpeta Seleccionada' : 'Seleccionar Carpeta de Equipos'}
        </button>
        {folderPath && (
          <p className="mt-2 text-sm text-gray-600">
            Carpeta seleccionada: {folderPath}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {teams.map(team => (
          <div key={team} className="bg-white shadow-md rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-semibold mr-2 truncate">{team}</span>
            <input 
              type="number"
              placeholder="Score"
              value={scores[team] || ''}
              onChange={(e) => handleScoreChange(team, e.target.value)}
              className="w-16 p-1 text-center border rounded text-sm"
              maxLength="4"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center space-x-4">
        <button 
          onClick={handleSaveScores}
          disabled={!teamFolder}
          className={`${teamFolder ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'} text-white px-6 py-2 rounded`}
        >
          Guardar Puntajes
        </button>
        <Link 
          to="/" 
          className="text-blue-500 hover:underline"
        >
          Volver a Predicción
        </Link>
      </div>
    </div>
  );
}

export default TeamScores;