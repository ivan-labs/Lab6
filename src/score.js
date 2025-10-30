export function updateScore(score, level, linesCleared, lines) {
  const linePoints = [0, 100, 300, 500, 800];
  const newScore = score + linePoints[lines] * level;
  const newLinesCleared = linesCleared + lines;

  let newLevel = level;
  if (newLinesCleared >= newLevel * 10) {
    newLevel++;
  }
  const newFallSpeed = Math.max(100, 1000 - (newLevel - 1) * 100);

  return { newScore, newLevel, newLinesCleared, newFallSpeed };
}

export function getHighScores() {
  try {
    const scores = localStorage.getItem('tetrisHighScores');
    return scores ? JSON.parse(scores) : [];
  } catch (e) {
    console.error("Не вдалося завантажити рекорди:", e);
    return [];
  }
}

export function saveHighScore(score, name) {
  const scores = getHighScores();
  const newScore = { score, name };
  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score);
  const topScores = scores.slice(0, 10);
  try {
    localStorage.setItem('tetrisHighScores', JSON.stringify(topScores));
  } catch (e) {
    console.error("Не вдалося зберегти рекорди:", e);
  }
}

export function displayHighScores(listElement) {
  const scores = getHighScores();
  listElement.innerHTML = '';
  if (scores.length === 0) {
    listElement.innerHTML = '<li>Рекордів ще немає.</li>';
    return;
  }
  scores.forEach((score, index) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between p-2 rounded ' + (index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600');
    li.innerHTML = `
                            <span>${index + 1}. ${score.name}</span>
                            <span class="font-bold text-green-400">${score.score}</span>
                        `;
    listElement.appendChild(li);
  });
}