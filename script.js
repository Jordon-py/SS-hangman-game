/* -------------User's guess input---------------*/
const guessedLettersDiv = document.getElementById('guessedLetters');
const currentWordDiv = document.getElementById('currentWord');
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', handleGuess);
const guessInput = document.getElementById('guessInput');
guessInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleGuess();
  }
});              

/*
 -----------------Timer Functionality and game start
 */
const timerDisplay = document.getElementById('timerDisplay');
const startButton = document.getElementById('startButton');
const feedbackDiv = document.getElementById('feedback');

startButton.addEventListener('click', () => {
  startGame();
  startTimer();
});
  
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', initializeGame);

const spacemanCanvas = document.getElementById('spacemanCanvas');
const ctx = spacemanCanvas.getContext('2d');

const dbzWordList = ["kamehameha","supersaiyan","dragonball","frieza","goku","vegeta","saiyan","cell","trunks",
  "gohan","piccolo","bulma","yamcha","tien","chi","nappa","raditz","bardock","gotenks","gogeta"
];

/*---------- Variables (state) ---------*/

let lettersGuessed = [];
let secretWord = '';
let remainingTime = 180;
let timeInterval = null;
let isGameOver = false; // Boolean flag to track game state
let wrongGuessCount = 0;
let startGameFlag = false;

/*-------------- Functions -------------*/

function initializeGame() {
  isGameOver = false;
  startGameFlag = false;
  secretWord = '';
  lettersGuessed = [];
  remainingTime = 120;
  wrongGuessCount = 0;
  clearInterval(timeInterval);
  
  currentWordDiv.innerHTML = '';
  guessedLettersDiv.textContent = 'Guessed Letters: _';
  feedbackDiv.textContent = '';
  clearCanvas();
  timerDisplay.textContent = `Time: ${remainingTime}s`;
}

function startGame() {
  initializeGame();
  secretWord = getSecretWord();
  console.log(`secretWord: ${secretWord}`);

  // Display the secret word as underscores
  secretWord.split('').forEach((letter, i) => {
    let letterSpan = document.createElement('span');
    letterSpan.setAttribute('id', `letter-${i}`);
    letterSpan.classList.add('letter');
    letterSpan.textContent = '_ ';
    currentWordDiv.appendChild(letterSpan);
  });
}

// SECRET WORD ---------------------

function getSecretWord() {          
  let randomIndex = Math.floor(Math.random() * dbzWordList.length);
  let selectedWord = dbzWordList[randomIndex].toLowerCase();
  return selectedWord;
}

// ------ USER GUESS -------------------------

function handleGuess() {
  if (isGameOver || !startGameFlag) return; // Prevent actions if the game has ended or hasn't started
  
  let guessedLetter = guessInput.value.toLowerCase();
  guessInput.value = ''; // Clear input field
  
  if (!guessedLetter.match(/[a-z]/i) || guessedLetter.length !== 1) {
    feedbackDiv.textContent = 'Please enter a single letter.';
    return;
  }
  
  if (lettersGuessed.includes(guessedLetter)) {
    feedbackDiv.textContent = 'You already guessed that letter!';
    return;
  }

  lettersGuessed.push(guessedLetter);
  updateGuessedLetters();

  if (secretWord.includes(guessedLetter)) {
    revealLetters(guessedLetter);
    feedbackDiv.textContent = `Nice! "${guessedLetter.toUpperCase()}" is in the word.`;
    if (checkWinCondition()) {
      endGame(true);
    }
  } else {
    wrongGuessCount++;
    feedbackDiv.textContent = `Sorry, "${guessedLetter.toUpperCase()}" is not in the word.`;
    drawSpaceman(wrongGuessCount);
    if (wrongGuessCount >= 6)
      endGame(false);
    }
};

function updateGuessedLetters() {
  guessedLettersDiv.textContent = `Guessed Letters: ${lettersGuessed.join(', ').toUpperCase()}`;
}

function revealLetters(letter) {
  secretWord.split('').forEach((char, i) => {
    if (char === letter) {
      let letterSpan = document.getElementById(`letter-${i}`);
      letterSpan.textContent = `${char.toUpperCase()} `;
    }
  });
}

function checkWinCondition() {
  return secretWord.split('').every((letter, i) => {
    let letterSpan = document.getElementById(`letter-${i}`);
    return letterSpan.textContent.trim() === letter.toUpperCase();
  });
}

// Define endGame as a separate function outside handleGuess
function endGame(won) {
  isGameOver = true;
  clearInterval(timeInterval);
  if (won) {
    feedbackDiv.textContent = 'Congratulations! You achieved SuperSaiyan status!';
    alert('Congratulations! You achieved SuperSaiyan status!');
  } else {
    feedbackDiv.textContent = `Game Over! The word was "${secretWord.toUpperCase()}".`;
    alert(`Game Over! The word was "${secretWord.toUpperCase()}". Better luck next time!`);
    revealAllLetters();
  }
}

function revealAllLetters() {
  secretWord.split('').forEach((char, i) => {
    let letterSpan = document.getElementById(`letter-${i}`);
    letterSpan.textContent = `${char.toUpperCase()} `;
  });
}

function startTimer() {
  if (timeInterval || isGameOver) return; // Prevent multiple intervals or starting after game ends
  startGameFlag = true;
  timeInterval = setInterval(() => {
    remainingTime--;
    timerDisplay.textContent = `Time: ${remainingTime}s`;
    if (remainingTime <= 0) {
      clearInterval(timeInterval);
      endGame(false); // Player loses
    }
  }, 1000);
}

/*-------------- Canvas Drawing -------------*/
function clearCanvas() {
  ctx.clearRect(0, 0, spacemanCanvas.width, spacemanCanvas.height);
}

function drawSpaceman(wrongGuesses) {
  clearCanvas();
  
  // Draw based on number of wrong guesses
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  
  // Draw the base (bottom platform)
  ctx.beginPath();
  ctx.moveTo(20, 180);
  ctx.lineTo(180, 180);
  ctx.stroke();
  
  if (wrongGuesses >= 1) {
    // Draw the vertical pole
    ctx.beginPath();
    ctx.moveTo(40, 180);
    ctx.lineTo(40, 40);
    ctx.stroke();
  }
  
  if (wrongGuesses >= 2) {
    // Draw the top beam
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.lineTo(100, 40);
    ctx.stroke();
  }
  
  if (wrongGuesses >= 3) {
    // Draw the noose
    ctx.beginPath();
    ctx.moveTo(100, 40);
    ctx.lineTo(100, 60);
    ctx.stroke();
  }
  
  if (wrongGuesses >= 4) {
    // Draw the head (with Super Saiyan hair!)
    ctx.beginPath();
    ctx.arc(100, 70, 10, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw Super Saiyan spiky hair
    ctx.beginPath();
    ctx.moveTo(90, 65);
    ctx.lineTo(85, 50);
    ctx.moveTo(95, 60);
    ctx.lineTo(90, 45);
    ctx.moveTo(105, 60);
    ctx.lineTo(110, 45);
    ctx.moveTo(110, 65);
    ctx.lineTo(115, 50);
    ctx.stroke();
  }
  
  if (wrongGuesses >= 5) {
    // Draw the body and arms
    ctx.beginPath();
    ctx.moveTo(100, 80);
    ctx.lineTo(100, 120);
    // Left arm
    ctx.moveTo(100, 90);
    ctx.lineTo(80, 100);
    // Right arm
    ctx.moveTo(100, 90);
    ctx.lineTo(120, 100);
    ctx.stroke();
  }
  
  if (wrongGuesses >= 6) {
    // Draw the legs
    ctx.beginPath();
    // Left leg
    ctx.moveTo(100, 120);
    ctx.lineTo(85, 150);
    // Right leg
    ctx.moveTo(100, 120);
    ctx.lineTo(115, 150);
    ctx.stroke();
    
    // Add Super Saiyan aura
    ctx.strokeStyle = 'gold';
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const x1 = 100 + 25 * Math.cos(angle);
      const y1 = 100 + 25 * Math.sin(angle);
      const x2 = 100 + 35 * Math.cos(angle);
      const y2 = 100 + 35 * Math.sin(angle);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);