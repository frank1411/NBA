export class NBAScorePredictor {
  constructor(windowSize = 5) {
    this.windowSize = windowSize;
    this.scoresHistory = [];
    this.gameFactors = [];
  }

  addScore(score, factors = {}) {
    const gameData = {
      score: Number(score),
      isHome: factors.isHome || false,
      isBackToBack: factors.isBackToBack || false,
      rivalDefensiveRating: factors.rivalDefensiveRating || 100,
      injuredPlayers: factors.injuredPlayers || 0,
      restDays: factors.restDays || 1,
      rivalPace: factors.rivalPace || 100,
      altitude: factors.altitude || 0,
      travelDistance: factors.travelDistance || 0,
      timeZoneChange: factors.timeZoneChange || 0,
      date: new Date()
    };

    this.scoresHistory.push(gameData);
    this.gameFactors.push(factors);
  }

  calculateStreak() {
    if (this.scoresHistory.length < 3) return 0;
    const recentScores = this.scoresHistory.slice(-3);
    const avgScore = recentScores.reduce((a, b) => a + b.score, 0) / 3;
    const trend = avgScore - this.scoresHistory[this.scoresHistory.length - 4]?.score || 0;
    return trend;
  }

  predictNextScore(nextGameFactors = {}) {
    if (this.scoresHistory.length < this.windowSize) {
      return null;
    }
    
    const recentScores = this.scoresHistory.slice(-this.windowSize);
    const baselinePrediction = recentScores.reduce((a, b) => a + b.score, 0) / this.windowSize;

    let adjustedPrediction = baselinePrediction;

    // Factores existentes
    if (nextGameFactors.isHome) {
      adjustedPrediction += 3.5;
    }

    if (nextGameFactors.isBackToBack) {
      adjustedPrediction -= 4.2;
    }

    adjustedPrediction -= (nextGameFactors.injuredPlayers || 0) * 3;

    const avgDefensiveRating = 100;
    // Corregido: Ahora un rating defensivo más alto resulta en más puntos
    const defensiveImpact = ((nextGameFactors.rivalDefensiveRating || avgDefensiveRating) - avgDefensiveRating) * 0.5;
    adjustedPrediction += defensiveImpact;

    // Nuevos factores
    // Días de descanso
    const restDays = nextGameFactors.restDays || 1;
    if (restDays > 1) {
      adjustedPrediction += Math.min(restDays - 1, 3) * 1.5; // Máximo beneficio de 3 días
    }

    // Factor de racha
    const streakImpact = this.calculateStreak() * 0.3;
    adjustedPrediction += streakImpact;

    // Ritmo de juego del rival
    const paceDiff = ((nextGameFactors.rivalPace || 100) - 100) * 0.2;
    adjustedPrediction += paceDiff;

    // Factores ambientales
    if (nextGameFactors.altitude > 1000) {
      adjustedPrediction -= (nextGameFactors.altitude / 1000) * 0.5;
    }

    if (nextGameFactors.travelDistance > 1000) {
      adjustedPrediction -= Math.min((nextGameFactors.travelDistance / 1000) * 0.3, 3);
    }

    if (nextGameFactors.timeZoneChange !== 0) {
      adjustedPrediction -= Math.abs(nextGameFactors.timeZoneChange) * 0.8;
    }

    return Math.max(70, Math.min(150, adjustedPrediction));
  }

  getHistory() {
    return this.scoresHistory.map(game => game.score);
  }

  getDetailedHistory() {
    return this.scoresHistory;
  }

  clearHistory() {
    this.scoresHistory = [];
    this.gameFactors = [];
  }
}