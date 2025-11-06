'use strict';

// Dragon Ball Z Hangman Game (refactored)
// --------------------------------------

/**
 * Game class encapsulates all game logic and DOM interactions.
 */
class HangmanGame {
  constructor(selectors) {
    const {
      wordDisplay,
      guessedDisplay,
      input,
      submitBtn,
      startBtn,
      resetBtn,
      timerDisplay,
      feedback,
      canvas
    } = selectors;

    // Cache DOM elements
    this.wordDisplay = document.querySelector(wordDisplay);
    this.guessedDisplay = document.querySelector(guessedDisplay);
    this.input = document.querySelector(input);
    this.submitBtn = document.querySelector(submitBtn);
    this.startBtn = document.querySelector(startBtn);
    this.resetBtn = document.querySelector(resetBtn);
    this.timerDisplay = document.querySelector(timerDisplay);
    this.feedback = document.querySelector(feedback);
    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext('2d');
    this.timerId = null;

    // Word list
    this.words = [
      'kamehameha',
      'supersaiyan',
      'dragonball',
      'frieza',
      'goku',
      'vegeta',
      'saiyan',
      'cell',
      'trunks',
      'gohan',
      'piccolo',
      'bulma',
      'yamcha',
      'tien',
      'chi',
      'nappa',
      'raditz',
      'bardock',
      'gotenks',
      'gogeta'
    ];

    // Bind methods
    this.initialize = this.initialize.bind(this);
    this.startGame = this.startGame.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.endGame = this.endGame.bind(this);

    // Event listeners
    this.resetBtn.addEventListener('click', this.initialize);
    this.startBtn.addEventListener('click', () => {
      this.startGame();
      this.startTimer();
    });
    this.submitBtn.addEventListener('click', this.handleGuess);
    this.input.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.handleGuess();
    });
  }

  initialize() {
    this.isGameOver = false;
    this.started = false;
    this.secretWord = '';
    this.lettersGuessed = [];
    this.remainingTime = 120;
    this.wrongGuessCount = 0;
    clearInterval(this.timerId);
    this.timerId = null;

    this.wordDisplay.innerHTML = '';
    this.guessedDisplay.textContent = 'Guessed Letters: _';
    this.feedback.textContent = '';
    this.timerDisplay.textContent = `Time: ${this.remainingTime}s`;
    this.input.value = '';
    this.input.disabled = true;
    this.submitBtn.disabled = true;
    this.startBtn.disabled = false;
    this.clearCanvas();
  }

  startGame() {
    this.initialize();
    this.started = true;
    this.secretWord = this.getSecretWord();

    this.secretWord.split('').forEach((_, i) => {
      const span = document.createElement('span');
      span.id = `letter-${i}`;
      span.classList.add('letter');
      span.textContent = '_ ';
      this.wordDisplay.appendChild(span);
    });

    this.input.disabled = false;
    this.submitBtn.disabled = false;
    this.startBtn.disabled = true;
  }

  getSecretWord() {
    const idx = Math.floor(Math.random() * this.words.length);
    return this.words[idx];
  }

  handleGuess() {
    if (!this.started || this.isGameOver) return;

    const guessed = this.input.value.toLowerCase();
    this.input.value = '';

    if (!/^[a-z]$/.test(guessed)) {
      this.feedback.textContent = 'Please enter a single letter.';
      return;
    }

    if (this.lettersGuessed.includes(guessed)) {
      this.feedback.textContent = 'You already guessed that letter!';
      return;
    }

    this.lettersGuessed.push(guessed);
    this.updateGuessedLetters();

    if (this.secretWord.includes(guessed)) {
      this.revealLetters(guessed);
      this.feedback.textContent = `Nice! "${guessed.toUpperCase()}" is in the word.`;
      if (this.checkWin()) this.endGame(true);
    } else {
      this.wrongGuessCount++;
      this.feedback.textContent = `Sorry, "${guessed.toUpperCase()}" is not in the word.`;
      this.drawSpaceman(this.wrongGuessCount);
      if (this.wrongGuessCount >= 6) this.endGame(false);
    }
  }

  updateGuessedLetters() {
    this.guessedDisplay.textContent = `Guessed Letters: ${this.lettersGuessed.join(', ').toUpperCase()}`;
  }

  revealLetters(letter) {
    this.secretWord.split('').forEach((char, i) => {
      if (char === letter) {
        const span = document.getElementById(`letter-${i}`);
        span.textContent = `${char.toUpperCase()} `;
      }
    });
  }

  checkWin() {
    return this.secretWord.split('').every((char, i) => {
      const span = document.getElementById(`letter-${i}`);
      return span.textContent.trim() === char.toUpperCase();
    });
  }

  startTimer() {
    if (this.timerId || this.isGameOver) return;
    this.started = true;
    this.timerId = setInterval(() => {
      this.remainingTime--;
      this.timerDisplay.textContent = `Time: ${this.remainingTime}s`;
      if (this.remainingTime <= 0) {
        clearInterval(this.timerId);
        this.timerId = null;
        this.endGame(false);
      }
    }, 1000);
  }

  endGame(won) {
    this.isGameOver = true;
    clearInterval(this.timerId);
    this.timerId = null;
    this.input.disabled = true;
    this.submitBtn.disabled = true;
    this.startBtn.disabled = false;

    if (won) {
      this.feedback.textContent = 'Congratulations! You achieved SuperSaiyan status!';
      alert('Congratulations! You achieved SuperSaiyan status!');
    } else {
      this.feedback.textContent = `Game Over! The word was "${this.secretWord.toUpperCase()}".`;
      alert(`Game Over! The word was "${this.secretWord.toUpperCase()}". Better luck next time!`);
      this.revealAllLetters();
    }
  }

  revealAllLetters() {
    this.secretWord.split('').forEach((char, i) => {
      const span = document.getElementById(`letter-${i}`);
      span.textContent = `${char.toUpperCase()} `;
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawSpaceman(wrong) {
    this.clearCanvas();

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'black';
    this.ctx.beginPath();
    this.ctx.moveTo(20, 180);
    this.ctx.lineTo(180, 180);
    this.ctx.stroke();

    if (wrong >= 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(40, 180);
      this.ctx.lineTo(40, 40);
      this.ctx.stroke();
    }

    if (wrong >= 2) {
      this.ctx.beginPath();
      this.ctx.moveTo(40, 40);
      this.ctx.lineTo(100, 40);
      this.ctx.stroke();
    }

    if (wrong >= 3) {
      this.ctx.beginPath();
      this.ctx.moveTo(100, 40);
      this.ctx.lineTo(100, 60);
      this.ctx.stroke();
    }

    if (wrong >= 4) {
      this.ctx.beginPath();
      this.ctx.arc(100, 70, 10, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(90, 65);
      this.ctx.lineTo(85, 50);
      this.ctx.moveTo(95, 60);
      this.ctx.lineTo(90, 45);
      this.ctx.moveTo(105, 60);
      this.ctx.lineTo(110, 45);
      this.ctx.moveTo(110, 65);
      this.ctx.lineTo(115, 50);
      this.ctx.stroke();
    }

    if (wrong >= 5) {
      this.ctx.beginPath();
      this.ctx.moveTo(100, 80);
      this.ctx.lineTo(100, 120);
      this.ctx.moveTo(100, 90);
      this.ctx.lineTo(80, 100);
      this.ctx.moveTo(100, 90);
      this.ctx.lineTo(120, 100);
      this.ctx.stroke();
    }

    if (wrong >= 6) {
      this.ctx.beginPath();
      this.ctx.moveTo(100, 120);
      this.ctx.lineTo(85, 150);
      this.ctx.moveTo(100, 120);
      this.ctx.lineTo(115, 150);
      this.ctx.stroke();

      this.ctx.strokeStyle = 'gold';
      this.ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x1 = 100 + 25 * Math.cos(angle);
        const y1 = 100 + 25 * Math.sin(angle);
        const x2 = 100 + 35 * Math.cos(angle);
        const y2 = 100 + 35 * Math.sin(angle);
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
      }
      this.ctx.stroke();
    }
  }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const game = new HangmanGame({
    wordDisplay: '#currentWord',
    guessedDisplay: '#guessedLetters',
    input: '#guessInput',
    submitBtn: '#submitButton',
    startBtn: '#startButton',
    resetBtn: '#resetButton',
    timerDisplay: '#timerDisplay',
    feedback: '#feedback',
    canvas: 'spacemanCanvas'
  });

  game.initialize();
});

