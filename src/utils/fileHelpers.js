export const validateScores = (scores) => {
  return scores.every(score => 
    typeof score === 'number' && 
    !isNaN(score) && 
    score >= 60 && 
    score <= 200
  );
};