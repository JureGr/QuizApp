import React, { Component } from 'react';
import { Button } from 'antd';
import QuestionCard from './QuestionCard';

class PlayQuiz extends Component {
    state = {
        number: 0,
        questions: [],
        userAnswers: [],
        score: 0,
        gameOver: true,
        gameOver2: false
    };

    startTrivia = () => {
        this.setState({
            gameOver: false,
            questions: this.props.questions,
            score: 0,
            userAnswers: [],
            number: 0,
        });
    }

    checkAnswer = e => {
        const { gameOver, questions, score, number, userAnswers } = this.state;

        if (!gameOver) {
            // Users answer
            const answer = e.currentTarget.value;
            // Check answer against correct answer
            const correct = questions[number].correctAnswer === answer;
            // Add score if answer is correct
            if (correct) {
                this.setState({
                    score: score + 1
                });
            };
            // Save answer in the array for user answers
            const answerObject = {
                question: questions[number].text,
                answer,
                correct,
                correctAnswer: questions[number].correctAnswer,
            };
            this.setState({
                userAnswers: [...userAnswers, answerObject]
            });
        };

        const questionNumber = number + 1;

        if (questionNumber === questions.length) {
            setTimeout( this.gameOverHandler , 3000)
        }
    };

    nextQuestion = () => {
        const { number, questions } = this.state;

        // Move on to the next question if not the last question
        const nextQuestion = number + 1;

        if (nextQuestion === questions.length) {
            this.setState({
                gameOver: true,
                gameOver2: true
            });
        } else {
            this.setState({
                number: nextQuestion
            });
        }
    }

    gameOverHandler = () => {
        this.setState({
            gameOver2: true
        });
    };

    render() {
        //const { questions } = this.props;
        const { number, userAnswers, gameOver, gameOver2, questions, score } = this.state;
        console.log(questions);
        console.log(this.state);
        return (
            <div>
                {gameOver && !gameOver2 ? (
                    <Button 
                        style={{marginLeft: 550, marginTop: 200}}
                        type="primary" 
                        disabled={this.props.questions.length === 0 ? true : false}
                        onClick={this.startTrivia}
                        size="large"
                    >
                        Start Quiz
                    </Button>
                ) : null }
                {(!gameOver && !gameOver2) ? <b>Score: {score}</b> : null}
                {gameOver2 ? 
                    <legend style={{marginLeft: 550, marginTop: 200}}>Your Score: {score}/{questions.length}</legend> : 
                null}
                {!gameOver && questions.length === 0 && (<p>Loading Questions ...</p>)}
                {!gameOver && questions.length !== 0 && !gameOver2 && (
                    <QuestionCard 
                        questionNr={number + 1}
                        totalQuestions={questions.length}
                        question={questions[number].text}
                        answers={questions[number].answers}
                        userAnswer={userAnswers ? userAnswers[number] : undefined}
                        callback={this.checkAnswer}
                        userAnswers={userAnswers}
                    />
                )}
                {!gameOver &&
                questions.length !== 0 && 
                userAnswers.length === number + 1 && 
                number !== questions.length - 1 ? (
                    <Button 
                        type="primary"
                        onClick={this.nextQuestion}
                    >
                        {">> Next Question"}
                    </Button>
                ) : null}
            </div>
        )
    }
}

export default PlayQuiz;