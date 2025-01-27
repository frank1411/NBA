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

  const handleSaveScores = async () => {
    if (!teamFolder) {
      alert('Primero debes seleccionar una carpeta de equipos');
      return;
    }

    for (const team of teams) {
      if (scores[team]) {
        try {
          const fileName = `${team}_puntuaciones.txt`;
          const fileHandle = await teamFolder.getFileHandle(fileName);
          
          // Leer contenido actual del archivo
          const file = await fileHandle.getFile();
          const content = await file.text();
          
          // Preparar nuevo contenido
          const lines = content.trim().split('\n');
          lines.push(scores[team]);
          const newContent = lines.join('\n');

          // Escribir contenido actualizado
          const writable = await fileHandle.createWritable();
          await writable.write(newContent);
          await writable.close();
        } catch (error) {
          console.error(`Error guardando puntaje para ${team}:`, error);
          alert(`No se pudo guardar el puntaje para ${team}`);
        }
      }
    }

    alert('Puntajes guardados en archivos');
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