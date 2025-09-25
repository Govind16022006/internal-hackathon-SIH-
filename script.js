const quizQuestions = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlinking Text Mark Language"],
    answer: 0
  },
  {
    question: "Which language is used for styling web pages?",
    options: ["HTML", "JQuery", "CSS", "XML"],
    answer: 2
  },
  {
    question: "Which is not a JavaScript framework?",
    options: ["React", "Angular", "Vue", "Django"],
    answer: 3
  },
  {
    question: "Inside which HTML element do we put the JavaScript?",
    options: ["<js>", "<script>", "<javascript>", "<scripting>"],
    answer: 1
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "/* */", "#", "<!-- -->"],
    answer: 0
  },
  {
    question: "Which company developed the React library?",
    options: ["Google", "Facebook", "Microsoft", "Apple"],
    answer: 1
  },
  {
    question: "What is the correct syntax to link an external JavaScript file?",
    options: ["<script href='script.js'>", "<script src='script.js'>", "<script ref='script.js'>", "<script name='script.js'>"],
    answer: 1
  },
  {
    question: "Which method is used to add an element at the end of an array in JavaScript?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: 0
  },
  {
    question: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets", "Creative Style Sheets"],
    answer: 0
  },
  {
    question: "Which HTML attribute is used to define inline styles?",
    options: ["class", "style", "font", "styles"],
    answer: 1
  }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 600; // 10 minutes in seconds
let timerStarted = false;

const quizContainer = document.getElementById('quiz-container');
const nextBtn = document.getElementById('next-btn');
const skipBtn = document.getElementById('skip-btn');
const backBtn = document.getElementById('back-btn');
const resultContainer = document.getElementById('result-container');
const scoreSpan = document.getElementById('score');
const totalSpan = document.getElementById('total');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress');

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    updateTimerColor();
    if (timeLeft <= 0) {
      endQuiz();
    }
  }, 1000);
}

function updateTimerColor() {
  const timerElement = document.getElementById('timer');
  if (timeLeft > 300) {
    timerElement.style.color = '#00ff00'; // Green
    timerElement.classList.remove('urgent');
  } else if (timeLeft > 120) {
    timerElement.style.color = '#ffff00'; // Yellow
    timerElement.classList.remove('urgent');
  } else {
    timerElement.style.color = '#ff0000'; // Red
    timerElement.classList.add('urgent');
  }
}

function displayQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  quizContainer.innerHTML = `
    <div class="question">
      <h3>${question.question}</h3>
      <div class="options">
        ${question.options.map((option, index) => `
          <label>
            <input type="radio" name="answer" value="${index}">
            ${option}
          </label>
        `).join('')}
      </div>
    </div>
  `;
  updateProgress();

  // Add event listener to start timer on first answer click
  const optionInputs = quizContainer.querySelectorAll('input[name="answer"]');
  optionInputs.forEach(input => {
    input.addEventListener('click', () => {
      if (!timerStarted) {
        startTimer();
        timerStarted = true;
      }
    });
  });
}

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 600;
  timerStarted = false;
  resultContainer.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  nextBtn.textContent = 'Next';
  nextBtn.style.display = 'block';
  skipBtn.style.display = 'block';
  displayQuestion();
  timerDisplay.textContent = "10:00";
  progressBar.style.width = '0%';
}

function nextQuestion() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
    const answer = parseInt(selectedOption.value);
    if (answer === quizQuestions[currentQuestionIndex].answer) {
      score++;
    }
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

function skipQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timer);
  quizContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');
  scoreSpan.textContent = score;
  totalSpan.textContent = quizQuestions.length;
  nextBtn.style.display = 'none';
  skipBtn.style.display = 'none';

  // Save progress to localStorage
  const studentName = document.getElementById('studentName').value.trim();
  if (studentName) {
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    progressData.push({ name: studentName, score: score });
    localStorage.setItem('progressData', JSON.stringify(progressData));
  }
}


nextBtn.addEventListener('click', () => {
  if (nextBtn.textContent === 'Start Quiz') {
    startQuiz();
  } else {
    nextQuestion();
  }
});

// Add animation for next level quiz box
function animateQuizBox() {
  const quizBox = document.querySelector('.container');
  quizBox.style.transition = 'transform 0.6s ease, box-shadow 0.6s ease';
  quizBox.style.transform = 'scale(1.05) rotate(3deg)';
  quizBox.style.boxShadow = '0 0 20px 5px #a763ff';

  setTimeout(() => {
    quizBox.style.transform = 'scale(1) rotate(0deg)';
    quizBox.style.boxShadow = '0 8px 40px rgba(0,0,0,0.3)';
  }, 600);
}

// Call animation on next question and skip question
nextBtn.addEventListener('click', () => {
  if (nextBtn.textContent !== 'Start Quiz') {
    animateQuizBox();
  }
});

skipBtn.addEventListener('click', () => {
  animateQuizBox();
  skipQuestion();
});

backBtn.addEventListener('click', () => {
  window.location.href = 'PROJECT_OF_HACKATHON.html';
});

document.getElementById('restart-btn').addEventListener('click', () => {
  startQuiz();
  nextBtn.textContent = 'Next';
});
