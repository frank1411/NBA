import { useState, useEffect } from 'react';
import { NBAScorePredictor } from './utils/scorePredictor';
import { FileUploader } from './components/FileUploader';
import { EnvironmentalFactors } from './components/EnvironmentalFactors';
import { validateScores } from './utils/fileHelpers';

const predictor = new NBAScorePredictor(5);

function App() {
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
  };

  const handleFactorChange = (factor, value) => {
    const newFactors = { ...gameFactors };
    newFactors[factor] = value;

    // Sincronización Back-to-Back y días de descanso
    if (factor === 'isBackToBack' && value === true) {
      newFactors.restDays = 0;
    } else if (factor === 'isBackToBack' && value === false && newFactors.restDays === 0) {
      newFactors.restDays = 1;
    }

    setGameFactors(newFactors);
  };

  const handleFileLoad = (scores) => {
    if (!validateScores(scores)) {
      alert('El archivo contiene puntuaciones inválidas. Asegúrate de que todas las puntuaciones estén entre 70 y 200 puntos.');
      return;
    }

    handleClear();
    scores.forEach(score => predictor.addScore(score, gameFactors));
    setHistory(predictor.getHistory());
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Predictor de Puntuación NBA</h1>
        
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

            <EnvironmentalFactors 
              factors={gameFactors} 
              onChange={handleFactorChange} 
            />
          </div>
        </form>

        {prediction !== null && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Predicción próximo juego:</h2>
            <p className="text-3xl font-bold text-green-600">{prediction} puntos</p>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Historial de puntuaciones:</h2>
          {history.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {history.map((score, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded">
                  {score}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay puntuaciones registradas</p>
          )}
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            Limpiar historial
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
