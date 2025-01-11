import { useState, useEffect } from 'react';
import { NBAScorePredictor } from './utils/scorePredictor';
import { FileUploader } from './components/FileUploader';
import { validateScores } from './utils/fileHelpers';

const predictorTeam1 = new NBAScorePredictor(5);
const predictorTeam2 = new NBAScorePredictor(5);

function TeamPredictor({ predictor, defaultName, otherTeamFactors, onFactorChange }) {
  const [teamName, setTeamName] = useState(defaultName);
  const [score, setScore] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [gameFactors, setGameFactors] = useState({
    isHome: false,
    isBackToBack: false,
    rivalDefensiveRating: 100,
    injuredPlayers: 0,
    restDays: 1,
    rivalPace: 100,
    altitude: 0,
    travelDistance: 0,
    timeZoneChange: 0
  });

  useEffect(() => {
    if (history.length >= predictor.windowSize) {
      const nextPrediction = predictor.predictNextScore(gameFactors);
      setPrediction(nextPrediction ? nextPrediction.toFixed(1) : null);
    }
  }, [gameFactors, history]);

  const handleAddScore = (e) => {
    e.preventDefault();
    if (!score) return;

    predictor.addScore(score, gameFactors);
    setHistory(predictor.getHistory());
    setScore('');
  };

  const handleClear = () => {
    predictor.clearHistory();
    setHistory([]);
    setPrediction(null);
    setScore('');
    setTeamName(defaultName);
  };

  const handleFactorChange = (factor, value) => {
    const newFactors = { ...gameFactors, [factor]: value };
    
    // Si se marca como local, notificar al otro equipo
    if (factor === 'isHome') {
      onFactorChange('isHome', value);
    }
    
    // Si se marca back-to-back, establecer días de descanso en 0
    if (factor === 'isBackToBack' && value === true) {
      newFactors.restDays = 0;
    } else if (factor === 'isBackToBack' && value === false) {
      newFactors.restDays = 1;
    }
    
    setGameFactors(newFactors);
  };

  const handleFileLoad = (scores, name) => {
    if (!validateScores(scores)) {
      alert('El archivo contiene puntuaciones inválidas. Asegúrate de que todas las puntuaciones estén entre 70 y 200 puntos.');
      return;
    }

    handleClear();
    setTeamName(name);
    scores.forEach(score => predictor.addScore(score, gameFactors));
    setHistory(predictor.getHistory());
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{defaultName}</h2>
        {teamName !== defaultName && (
          <h3 className="text-xl text-blue-600 mb-2">{teamName}</h3>
        )}
        {prediction !== null && (
          <div className="bg-green-50 rounded-lg p-3 inline-block">
            <p className="text-3xl font-bold text-green-600">{prediction} puntos</p>
          </div>
        )}
      </div>

      <FileUploader onFileLoad={handleFileLoad} />

      <form onSubmit={handleAddScore} className="mb-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Ingresa puntuación"
              className="flex-1 p-2 border rounded"
              min="0"
              max="200"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Añadir
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={gameFactors.isHome}
                onChange={(e) => handleFactorChange('isHome', e.target.checked)}
                className="mr-2"
              />
              Local
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={gameFactors.isBackToBack}
                onChange={(e) => handleFactorChange('isBackToBack', e.target.checked)}
                className="mr-2"
              />
              Back-to-Back
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm">
                Rating Defensivo Rival (85-115):
                <input
                  type="number"
                  value={gameFactors.rivalDefensiveRating}
                  onChange={(e) => handleFactorChange('rivalDefensiveRating', Number(e.target.value))}
                  className="w-full p-2 border rounded mt-1"
                  min="85"
                  max="115"
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Ritmo de Juego del Rival (95-105):
                <input
                  type="number"
                  value={gameFactors.rivalPace}
                  onChange={(e) => handleFactorChange('rivalPace', Number(e.target.value))}
                  className="w-full p-2 border rounded mt-1"
                  min="95"
                  max="105"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm">
                Jugadores Clave Lesionados:
                <input
                  type="number"
                  value={gameFactors.injuredPlayers}
                  onChange={(e) => handleFactorChange('injuredPlayers', Number(e.target.value))}
                  className="w-full p-2 border rounded mt-1"
                  min="0"
                  max="5"
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Días de Descanso:
                <input
                  type="number"
                  value={gameFactors.restDays}
                  onChange={(e) => handleFactorChange('restDays', Number(e.target.value))}
                  className="w-full p-2 border rounded mt-1"
                  min="0"
                  max="7"
                  disabled={gameFactors.isBackToBack}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm">
                Altitud (metros):
                <input
                  type="number"
                  value={gameFactors.altitude}
                  onChange={(e) => handleFactorChange('altitude', Number(e.target.value))}
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
                  value={gameFactors.travelDistance}
                  onChange={(e) => handleFactorChange('travelDistance', Number(e.target.value))}
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
                  value={gameFactors.timeZoneChange}
                  onChange={(e) => handleFactorChange('timeZoneChange', Number(e.target.value))}
                  className="w-full p-2 border rounded mt-1"
                  min="-3"
                  max="3"
                />
              </label>
            </div>
          </div>
        </div>
      </form>

      {history.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {history.map((score, index) => (
              <span key={index} className="bg-white px-3 py-1 rounded shadow-sm">
                {score}
              </span>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <button
          onClick={handleClear}
          className="text-red-500 hover:text-red-600 text-sm"
        >
          Limpiar historial
        </button>
      )}
    </div>
  );
}

function App() {
  const [team1Factors, setTeam1Factors] = useState({
    isHome: false,
    isBackToBack: false
  });
  const [team2Factors, setTeam2Factors] = useState({
    isHome: false,
    isBackToBack: false
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Predictor de Puntuación NBA</h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <TeamPredictor 
          predictor={predictorTeam1} 
          defaultName="Equipo Local" 
          otherTeamFactors={team2Factors}
          onFactorChange={(factor, value) => setTeam2Factors(prev => ({ ...prev, [factor]: !prev[factor] }))}
        />
        <TeamPredictor 
          predictor={predictorTeam2} 
          defaultName="Equipo Visitante" 
          otherTeamFactors={team1Factors}
          onFactorChange={(factor, value) => setTeam1Factors(prev => ({ ...prev, [factor]: !prev[factor] }))}
        />
      </div>
    </div>
  );
}

export default App;
