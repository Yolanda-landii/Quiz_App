const readline = require('readline');

const questions = [
    { question: "What is the capital of France?", choices: ["1. Paris", "2. London", "3. Rome"], answer: 1 },
    { question: "Which planet is known as the Red Planet?", choices: ["1. Earth", "2. Mars", "3. Jupiter"], answer: 2 },
    { question: "Who wrote 'Hamlet'?", choices: ["1. Tolstoy", "2. Shakespeare", "3. Homer"], answer: 2 },
    { question: "What color is the sky?", choices: ["1. Pink", "2. Orange", "3. Blue"], answer: 3 },
    { question: "Which ocean is the deepest in the world?", choices: ["1. Atlantic", "2. Pacific", "3. Indian"], answer: 2 },
    { question: "Who painted the Mona Lisa?", choices: ["1. Vincent van Gogh", "2. Leonardo da Vinci", "3. Pablo Picasso"], answer: 2 },
];

const totalTime = 60; 
const questionTime = 10; 

let score = 0;
let currentQuestionIndex = 0;
let remainingTime = totalTime;
let quizInterval;
let questionTimeout;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion() {
    if (currentQuestionIndex >= questions.length || remainingTime <= 0) {
        endQuiz();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    console.log(`\nQuestion ${currentQuestionIndex + 1}: ${currentQuestion.question}`);
    currentQuestion.choices.forEach(choice => console.log(choice));

    questionTimeout = setTimeout(() => {
        console.log("\nTime's up for this question!");
        nextQuestion();
    }, questionTime * 1000);

    promptUserForAnswer(currentQuestion);
}

function promptUserForAnswer(currentQuestion) {
    process.stdout.write('\nYour answer: '); 
    rl.question('', (userAnswer) => {  
        if (isValidAnswer(userAnswer, currentQuestion.choices.length)) {
            clearTimeout(questionTimeout);  
            if (parseInt(userAnswer) === currentQuestion.answer) {
                score++;
                console.log("Correct!");
            } else {
                console.log("Wrong!");
            }
            nextQuestion(); 
        } else {
            console.log("Invalid input. Try again.");
            promptUserForAnswer(currentQuestion);  
        }
    });
}

function isValidAnswer(answer, numChoices) {
    const answerNum = parseInt(answer);
    return !isNaN(answerNum) && answerNum > 0 && answerNum <= numChoices;
}

function nextQuestion() {
    currentQuestionIndex++;
    askQuestion();
}


function startQuiz() {
    console.log(`Starting quiz! Total time: ${totalTime}s`);

    quizInterval = setInterval(() => {
        remainingTime--;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Total time remaining: ${remainingTime}s`);
        
        if (remainingTime === 0) {
            clearInterval(quizInterval);
            endQuiz();
        }
    }, 1000);

    askQuestion(); 
}


function endQuiz() {
    console.log(`\nQuiz over! Your final score: ${score}/${questions.length}`);
    rl.close();
    process.exit();
}
startQuiz();
