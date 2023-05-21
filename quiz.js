let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 300; // 5 minutes in seconds
let timerId;
const quizData = [];
const userAnswers = [];

async function getQuizData(categoryID, difficulty) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const response = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple&category=${id}`);
  const data = await response.json();
  return data.results;
}

function renderQuestion() {
  const questionElement = document.getElementById('question');
  const choicesElement = document.getElementById('choices');
  const resultElement = document.getElementById('result');
  const questionNumberElement = document.getElementById('question-number');
  const timerElement = document.getElementById('timer');

  if (questionElement && choicesElement && resultElement && questionNumberElement && timerElement) {
    // Clear previous question and choices
    questionElement.innerHTML = '';
    choicesElement.innerHTML = '';
    resultElement.innerHTML = '';

    // Render current question number
    const questionNumber = currentQuestionIndex + 1;
    questionNumberElement.innerHTML = `Question #${questionNumber}`;

    // Render category name
    const currentQuestion = quizData[currentQuestionIndex];
    const categoryElement = document.getElementById('category');
    categoryElement.innerHTML = `${currentQuestion.category}`;

    // Render current question
    questionElement.innerHTML = currentQuestion.question;

    // Render answer choices
    currentQuestion.choices.forEach(choice => {
      const choiceElement = document.createElement('div');
      choiceElement.textContent = choice;
      choiceElement.classList.add('choice');
      choiceElement.addEventListener('click', () => handleChoiceClick(choice, currentQuestion.correct_answer));
      choicesElement.appendChild(choiceElement);
    });

    // Update timer
    timerElement.innerHTML = `Time left: ${formatTime(timeLeft)}`;
  }
}

function handleChoiceClick(choice, correctAnswer) {
  if (choice === correctAnswer) {
    score++;
    userAnswers.push({
      question: quizData[currentQuestionIndex].question,
      answer: choice,
      correct: true
    });
    document.getElementById('result').innerHTML = 'Correct!';
  } else {
    userAnswers.push({
      question: quizData[currentQuestionIndex].question,
      answer: choice,
      correct: false
    });
    document.getElementById('result').innerHTML = `The correct answer is: ${correctAnswer}`;
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    renderQuestion();
  } else {
    clearInterval(timerId);
    displayResult();
  }
}

function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      displayResult();
    } else {
      renderQuestion();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function startQuiz() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryID = urlParams.get('id');
  const difficulty = urlParams.get('difficulty');
  const data = await getQuizData(categoryID, difficulty);
  const firstQuestion = data[0];
  const category = firstQuestion.category;
  quizData.push(
    ...data.map(question => ({
      question: question.question,
      choices: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
      correct_answer: question.correct_answer,
      category: category,
      difficulty: difficulty
    }))
  );

  const selectedDifficultyElement = document.getElementById('selected-difficulty');
  selectedDifficultyElement.innerHTML = `Selected Difficulty: ${difficulty}`;

  startTimer();
  renderQuestion();
}

function displayResult() {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = `
    <div class="results-container">
      <div class="results-header">
        <h2>Your Results</h2>
        <p>You Scored ${score} out of ${quizData.length}.</p>
          <div class="results-buttons">
          <button class="play-button" onclick="location.reload()"><img src="/Assets/buttons/replay.svg"/> Play again</button>
          <button class="index-button" onclick="window.location.href = 'index.html'">Home</button>
          </div>
      </div>
      <div class="results-description">
        <ul id="question-results"></ul>
      </div>
    </div>
  `;

  const questionResultsElement = document.getElementById('question-results');
  userAnswers.forEach((answer, index) => {
    const resultItem = document.createElement('li');
    const answerStatus = answer.correct ? 'Correct!' : 'Incorrect';
    const correctAnswer = answer.correct ? '' : `The correct answer is: ${quizData[index].correct_answer}`;
    resultItem.innerHTML = `
      <strong>${index + 1}. ${answer.question}</strong><br>
      <div class="answer-result">
        <p>Your answer: ${answer.answer}</p>
        <p>${answerStatus}</p>
      </div>
      <p>${correctAnswer}</p>
    `;
    questionResultsElement.appendChild(resultItem);
  });
}

startQuiz();
