import React, { useState, useEffect } from 'react';
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

  const handleScoreChange = (team, score) => {
    setScores(prev => ({
      ...prev,
      [team]: score
    }));
  };

  const handleSaveScores = () => {
    console.log('Scores to save:', scores);
    alert('Puntajes guardados');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Puntajes de Equipos NBA</h1>
      
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
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
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