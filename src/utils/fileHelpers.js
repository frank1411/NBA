export const validateScores = (scores) => {
  return scores.every(score => 
    typeof score === 'number' && 
    !isNaN(score) && 
    score >= 70 && 
    score <= 200
  );
};