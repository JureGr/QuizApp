import { shuffleArray } from './utils';

export const fetchQuestions = async (numberOf, category, difficulty) => {

    let endpoint = `https://opentdb.com/api.php?amount=${numberOf}&category=${category}&difficulty=${difficulty}&type=multiple`;

    if(category === "8") {
        endpoint = `https://opentdb.com/api.php?amount=${numberOf}&difficulty=${difficulty}&type=multiple`;
    }

    const data = await (await fetch(endpoint)).json();
    return data.results.map((question) => ({
        text: question.question,
        correctAnswer: question.correct_answer,
        answers: shuffleArray([...question.incorrect_answers, question.correct_answer]),
    }));
};