const readline = require('readline');

const questions = [
    { question: "What is the capital of France?", choices: ["1. Paris", "2. London", "3. Rome"], answer: 1 },
    { question: "Which planet is known as the Red Planet?", choices: ["1. Earth", "2. Mars", "3. Jupiter"], answer: 2 },
    { question: "Who wrote 'Hamlet'?", choices: ["1. Tolstoy", "2. Shakespeare", "3. Homer"], answer: 2 }
];

const totalTime = 30;
const questionTime = 10;

let score = 0;
let currentQuestionIndex = 0;
let remainingTime = totalTime;
let quizInterval;
let questionTimeout;
let questionInterval; 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to ask questions asynchronously
function askQuestion() {
    if (currentQuestionIndex >= questions.length || remainingTime <= 0) {
        endQuiz();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    console.log(`\nQuestion ${currentQuestionIndex + 1}: ${currentQuestion.question}`);
    currentQuestion.choices.forEach(choice => console.log(choice));

    let questionRemainingTime = questionTime;

    questionTimeout = setTimeout(() => {
        console.log("\nTime's up for this question!");
        clearInterval(questionInterval); 
        nextQuestion();
    }, questionTime * 1000);


    questionInterval = setInterval(() => {
        process.stdout.write(`\rTime remaining for this question: ${questionRemainingTime}`);
        questionRemainingTime--;

        if (questionRemainingTime < 0) {
            clearInterval(questionInterval);  
        }
    }, 1000);

    promptUserForAnswer(currentQuestion);
}

function promptUserForAnswer(currentQuestion) {
    rl.question('\nYour answer: ', (userAnswer) => {
        if (isValidAnswer(userAnswer, currentQuestion.choices.length)) {
            clearTimeout(questionTimeout);  
            clearInterval(questionInterval);  
            if (parseInt(userAnswer) === currentQuestion.answer) {
                score++;
                console.log("\nCorrect!");
            } else {
                console.log("\nWrong!");
            }
            nextQuestion();
        } else {
            console.log("\nInvalid input. Try again.");
            promptUserForAnswer(currentQuestion);  // Ask the user again, without moving to the next question
        }
    });
}

// Function to check if the answer is valid
function isValidAnswer(answer, numChoices) {
    const answerNum = parseInt(answer);
    return !isNaN(answerNum) && answerNum > 0 && answerNum <= numChoices;
}

// Function to move to the next question
function nextQuestion() {
    currentQuestionIndex++;
    askQuestion();
}

// Start the quiz with a total time countdown
function startQuiz() {
    console.log(`Starting quiz! Total time: ${totalTime}s`);

    quizInterval = setInterval(() => {
        remainingTime--;
        if (remainingTime > 0) {
            // process.stdout.write(`\rTotal quiz time remaining: ${remainingTime}s`); 
        }

        if (remainingTime === 0) {
            clearInterval(quizInterval);
            endQuiz();
        }
    }, 1000);

    askQuestion();
}

// Function to end the quiz and show the final score
function endQuiz() {
    console.log(`\nQuiz over! Your final score: ${score}/${questions.length}`);
    rl.close();
    process.exit();
}

// Start the quiz
startQuiz();
