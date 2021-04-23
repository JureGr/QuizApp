import React, {Component} from 'react';
import { Button, Modal, Input, Select, Form } from 'antd';
import QuestionCard from './QuestionCard';
import Spinner from '../../Spinner';
import { fetchQuestions } from '../API';

const { Option } = Select;

class RandomQuiz extends Component {
    state = {
        number: 0,
        questions: [],
        userAnswers: [],
        score: 0,
        gameOver: true,
        gameOver2: false,
        isModalVisible: false,
        inputValue: "5",
        category: "8",
        difficulty: "medium",
    }

    startTrivia = async () => {
        const { inputValue, category, difficulty } = this.state;
        const newQuestions = await fetchQuestions(inputValue, category, difficulty);

        this.setState({
            questions: newQuestions,
            gameOver: false,
            score: 0,
            userAnswers: [],
            number: 0,
        });
    };

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

    showModal = () => {
        this.setState({
            isModalVisible: true
        });
    };

    handleOk = () => {
        this.startTrivia();

        this.setState({
            isModalVisible: false
        });
    };
    
    handleCancel = () => {
        this.setState({
            isModalVisible: false
        });
    };

    onChange = e => {
        this.setState({
            inputValue: e.target.value,
        })
    };

    handleSelectCategory = value => {
        this.setState({
            category: value
        })
    };

    handleSelectDifficulty = value => {
        this.setState({
            difficulty: value
        })
    };

    render() {
        const { number, userAnswers, gameOver, gameOver2, questions, score, isModalVisible } = this.state;
        return(
            <div>
                {gameOver && !gameOver2 ? (
                    <div>
                        <legend style={{marginLeft: 540, marginTop: 150}}>Random Quiz</legend>
                        <Button 
                            type="primary" 
                            size="large"
                            style={{marginLeft: 550, marginTop: 50}}
                            onClick={this.showModal}
                        >
                            Start Quiz
                        </Button>
                    </div>
                ) : null}
                {(!gameOver && !gameOver2) ? <b>Score: {score}</b> : null}
                {gameOver2 ? 
                    <legend style={{marginLeft: 550, marginTop: 200}}>Your Score: {score}/{questions.length}</legend> : 
                null}
                {!gameOver && questions.length === 0 && (<Spinner />)}

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

                <Modal title="Quiz Options" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form>
                        <Form.Item label="Number of questions">
                            <Input 
                                type="number"
                                defaultValue="5"
                                onChange={this.onChange}
                            />
                        </Form.Item>
                        <Form.Item label="Select category">
                            <Select defaultValue="8" onChange={this.handleSelectCategory}>
                                <Option value="8">Any</Option>
                                <Option value="9">General Knowledge</Option>
                                <Option value="10">Entertainment: Books</Option>
                                <Option value="11">Entertainment: Film</Option>
                                <Option value="12">Entertainment: Music</Option>
                                <Option value="13">Entertainment: Musicals & Theatres</Option>
                                <Option value="14">Entertainment: Television</Option>
                                <Option value="15">Entertainment: Video Games</Option>
                                <Option value="16">Entertainment: Board Games</Option>
                                <Option value="17">Science & Nature</Option>
                                <Option value="18">Science: Computers</Option>
                                <Option value="19">Science: Mathematics</Option>
                                <Option value="20">Mythology</Option>
                                <Option value="21">Sports</Option>
                                <Option value="22">Geography</Option>
                                <Option value="23">History</Option>
                                <Option value="24">Politics</Option>
                                <Option value="25">Art</Option>
                                <Option value="26">Celebrities</Option>
                                <Option value="27">Animals</Option>
                                <Option value="28">Vehicles</Option>
                                <Option value="29">Entertainment: Comics</Option>
                                <Option value="30">Science: Gadgets</Option>
                                <Option value="31">Entertainment: Japanese Anime & Manga</Option>
                                <Option value="32">Entertainment: Cartoon & Animations</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Select difficulty">
                            <Select defaultValue="medium" onChange={this.handleSelectDifficulty}>
                                <Option value="easy">Easy</Option>
                                <Option value="medium">Medium</Option>
                                <Option value="hard">Hard</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default RandomQuiz;