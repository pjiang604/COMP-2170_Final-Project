let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 300; // 5 minutes in seconds
let timerId;
const quizData = [];
const userAnswers = [];

async function getQuizData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple&category=' + id);
    const data = await response.json();
    return data.results;
}

function renderQuestion() {
    if (currentQuestionIndex >= quizData.length || timeLeft <= 0) {
        // Quiz is finished
        clearInterval(timerId); // Stop the timer
        displayResult();
        return;
    }

    const questionElement = document.getElementById('question');
    const choicesElement = document.getElementById('choices');
    const resultElement = document.getElementById('result');
    const questionNumberElement = document.getElementById('question-number');
    const timerElement = document.getElementById('timer');
    const categoryElement = document.getElementById('category');
    const difficultyElement = document.getElementById('difficulty');

    // Clear previous question and choices
    questionElement.innerHTML = '';
    choicesElement.innerHTML = '';
    resultElement.innerHTML = '';

    // Render current question number
    const questionNumber = currentQuestionIndex + 1;
    questionNumberElement.innerHTML = `Question #${questionNumber}`;

    // Render category name
    const currentQuestion = quizData[currentQuestionIndex];
    categoryElement.innerHTML = `${currentQuestion.category}`;
    difficultyElement.innerHTML = `Difficulty: ${currentQuestion.difficulty}`;

    // Render current question
    questionElement.innerHTML = currentQuestion.question;

    // Render answer choices
    currentQuestion.choices.forEach(choice => {
        const choiceElement = document.createElement('li');
        choiceElement.innerHTML = choice;
        choiceElement.addEventListener('click', () => {
            if (choice === currentQuestion.correct_answer) {
                score++;
                userAnswers.push({
                    question: currentQuestion.question,
                    answer: choice,
                    correct: true
                });
                resultElement.innerHTML = 'Correct!';
            } else {
                userAnswers.push({
                    question: currentQuestion.question,
                    answer: choice,
                    correct: false
                });
                resultElement.innerHTML = `The correct answer is: ${currentQuestion.correct_answer}`;
            }
            currentQuestionIndex++;
            renderQuestion();
        });
        choicesElement.appendChild(choiceElement);
    });

    // Update timer
    timerElement.innerHTML = `Time left: ${formatTime(timeLeft)}`;
}

function displayResult() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
<div class="results-container">
    <div class="results-header">
        <h2>Quiz finished!</h2>
        <button class="play-button" onclick="location.reload()">Play again</button>
    </div>
    <p>Your final score is ${score} out of ${quizData.length}.</p>
    <div class="results-description">
        <h3>Question Results:</h3>
        <ul id="question-results"></ul>
    </div>
</div>`;

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
    <p>${correctAnswer}</p>`;
        questionResultsElement.appendChild(resultItem);
    });
}


function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        renderQuestion();
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function startQuiz() {
    const data = await getQuizData();
    const firstQuestion = data[0];
    const category = firstQuestion.category;
    const difficulty = firstQuestion.difficulty;
    quizData.push(...data.map(question => {
        const choices = [...question.incorrect_answers, question.correct_answer];
        return {
            question: question.question,
            choices: choices.sort(() => Math.random() - 0.5),
            correct_answer: question.correct_answer,
            category: category,
            difficulty: difficulty
        };
    }));
    startTimer();
    renderQuestion();
}


startQuiz();