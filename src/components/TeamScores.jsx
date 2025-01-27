import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function TeamScores() {
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    // Aquí podrías cargar los nombres de los equipos 
    // Por ahora, usaremos una lista de ejemplo
    const teamList = [
      'Lakers', 'Celtics', 'Warriors', 'Bulls', 
      'Rockets', 'Spurs', 'Heat', 'Cavaliers'
    ];
    setTeams(teamList);
  }, []);

  const handleScoreChange = (team, score) => {
    setScores(prev => ({
      ...prev,
      [team]: score
    }));
  };

  const handleSaveScores = () => {
    // Aquí implementaremos la lógica para guardar los puntajes
    console.log('Scores to save:', scores);
    alert('Puntajes guardados');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Puntajes de Equipos</h1>
      
      <div className="grid md:grid-cols-2 gap-4">
        {teams.map(team => (
          <div key={team} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">{team}</h2>
            <input 
              type="number"
              placeholder="Puntaje del partido anterior"
              value={scores[team] || ''}
              onChange={(e) => handleScoreChange(team, e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={handleSaveScores}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Guardar Puntajes
        </button>
      </div>

      <div className="mt-4 text-center">
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