class NBAScorePredictor:
    def __init__(self, window_size=5):
        self.window_size = window_size
        self.scores_history = []
    
    def add_score(self, score):
        """Add a new score to the history"""
        self.scores_history.append(score)
    
    def predict_next_score(self):
        """Predict the next score using moving average"""
        if len(self.scores_history) < self.window_size:
            return None
        
        recent_scores = self.scores_history[-self.window_size:]
        return sum(recent_scores) / len(recent_scores)

def format_prediction(prediction):
    """Format the prediction to 1 decimal place"""
    return round(prediction, 1) if prediction is not None else "Insufficient data"