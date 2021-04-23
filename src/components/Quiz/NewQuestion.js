import React from 'react';
import { Drawer, Form, Input, Button, Alert } from 'antd';

const { TextArea } = Input;

class NewQuestion extends React.Component {
    state = {
        question: "",
        answerA: "",
        answerB: "",
        answerC: "",
        correctAnswer: "",
        quiz: this.props.currentQuiz,
        loading: false,
        errors: []
    }

    isFormValid = () => {
        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all fields' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isCorrectAnswerValid(this.state)) {
            error = { message: 'Correct answer does not match' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    isFormEmpty = ({ question, answerA, answerB, answerC, correctAnswer }) => {
        return !question.length || !answerA.length || !answerB.length || !answerC.length || !correctAnswer.length;
    };

    isCorrectAnswerValid = ({ answerA, answerB, answerC, correctAnswer }) => {
        if (answerA === correctAnswer || answerB === correctAnswer || answerC === correctAnswer) {
            return true;
        } else {
            return false;
        };
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    createQuestion = () => {
        const question = {
            text: this.state.question,
            answers: [this.state.answerA, this.state.answerB, this.state.answerC],
            correctAnswer: this.state.correctAnswer
        };
        return question;
    };

    addQuestion = () => {
        const { questionsRef } = this.props;
        const { quiz } = this.state;

        if (this.isFormValid()) {
            this.setState({ loading: true });
            questionsRef
                .child(quiz.id)
                .push()
                .set(this.createQuestion())
                .then(() => {
                    this.setState({ 
                        loading: false,
                        question: "",
                        answerA: "",
                        answerB: "",
                        answerC: "",
                        correctAnswer: "",
                        errors: []
                    })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                });
            this.refs.form.resetFields();
            this.props.closeDrawer();
        };
    };

    render() {
        const { drawer, closeDrawer } = this.props;
        const { errors, loading } = this.state;

        return (
            <Drawer
                title="Add a new question"
                placement="right"
                width={600}
                onClose={closeDrawer}
                visible={drawer}
                footer={
                    <div
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
                        Cancel
                      </Button>
                      <Button onClick={this.addQuestion} disabled={loading} type="primary">
                        Submit
                      </Button>
                    </div>
                }
            >
                <Form ref="form" layout="vertical" hideRequiredMark>
                    <Form.Item
                        name="question"
                        label="Question"
                        rules={[{ required: true, message: 'Please enter question' }]}
                    >
                        <TextArea 
                            name="question" 
                            onChange={this.handleChange} 
                            placeholder="Enter question" 
                            autoComplete="off"
                        />
                    </Form.Item>

                    <Form.Item
                        name="answerA"
                        label="A"
                        rules={[{ required: true, message: 'Please enter answer A' }]}
                    >
                        <Input 
                            name="answerA" 
                            onChange={this.handleChange}
                            placeholder="Enter answer A" 
                            autoComplete="off"
                        />
                    </Form.Item>

                    <Form.Item
                        name="answerB"
                        label="B"
                        rules={[{ required: true, message: 'Please enter answer B' }]}
                    >
                        <Input 
                            name="answerB" 
                            onChange={this.handleChange}
                            placeholder="Enter answer B" 
                            autoComplete="off"
                        />
                    </Form.Item>

                    <Form.Item
                        name="answerC"
                        label="C"
                        rules={[{ required: true, message: 'Please enter answer C' }]}
                    >
                        <Input 
                            name="answerC" 
                            onChange={this.handleChange}
                            placeholder="Enter answer C" 
                            autoComplete="off"
                        />
                    </Form.Item>

                    <Form.Item
                        name="correctAnswer"
                        label="Correct Answer"
                        rules={[{ required: true, message: 'Please choose the correct answer' }]}
                    >{/*
                        <Select name="correctAnswer" onChange={this.handleSelect} placeholder="Choose the correct answer">
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                    </Select>*/}
                        <Input 
                            name="correctAnswer" 
                            onChange={this.handleChange}
                            placeholder="Enter correct answer" 
                            autoComplete="off"
                        />
                    </Form.Item>

                </Form>
                {errors.length > 0 && (
                    <Alert message="Error" description={this.displayErrors(errors)} type="error" style={{ marginTop: 16 }} showIcon />
                )}
            </Drawer>
        );
    };
};

export default NewQuestion;