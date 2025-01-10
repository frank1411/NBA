from score_predictor import NBAScorePredictor, format_prediction

def main():
    # Create predictor instance
    predictor = NBAScorePredictor(window_size=5)
    
    # Example historical scores for a team
    historical_scores = [
        105, 98, 112, 103, 95,  # First 5 games
        108, 115, 99, 102, 106  # Next 5 games
    ]
    
    print("NBA Score Prediction Model")
    print("-" * 30)
    
    # Add historical scores and make predictions
    for i, score in enumerate(historical_scores, 1):
        predictor.add_score(score)
        prediction = predictor.predict_next_score()
        
        print(f"Game {i} Score: {score}")
        print(f"Next game prediction: {format_prediction(prediction)}")
        print()

if __name__ == "__main__":
    main()