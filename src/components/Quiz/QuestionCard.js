import React, { Component } from 'react';
import { Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

class QuestionCard extends Component {
    render() {
        const { questionNr, totalQuestions, question, answers, callback, userAnswer, userAnswers } = this.props;
        return(
            <div style={{marginLeft: 200, marginRight: 200}}>
                <p>
                    Question: {questionNr}/{totalQuestions}
                </p>
                <legend style={{textAlign: 'center'}}>{question}</legend>
                <div>
                    {answers.map((answer, i) => (
                        <div key={i} style={{padding: 5}}>
                            <Button value={answer} disabled={userAnswer} onClick={callback} size="large" block>
                                {userAnswer ? (userAnswers[questionNr - 1].correctAnswer === answer ? <CheckOutlined /> : <CloseOutlined />) : ''}{answer}
                            </Button><br />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default QuestionCard;